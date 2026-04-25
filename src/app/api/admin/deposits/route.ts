import { NextResponse } from "next/server";
import { verifyAdminAuth } from "../_auth";
import { sendEmail } from "@/lib/email/resend";
import { DepositReceivedTemplate } from "@/lib/email/templates/deposit-received.template";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface DepositRequest {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  amount: number;
  currency: string;
  method: string;        // "wave" | "orange_money" | "mtn_momo" | "bank" | "other"
  reference_code: string;
  payer_phone?: string;
  notes?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  processed_at?: string;
  processed_by?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const MEDUSA_HEADERS = {
  "Content-Type": "application/json",
  ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
};

async function getCustomer(customerId: string) {
  const res = await fetch(`${BACKEND}/admin/customers/${customerId}`, {
    headers: {
      ...MEDUSA_HEADERS,
      Authorization: `Bearer ${process.env.MEDUSA_API_KEY || ""}`,
    },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.customer;
}

async function updateCustomerMeta(customerId: string, metadata: Record<string, string>) {
  return fetch(`${BACKEND}/admin/customers/${customerId}`, {
    method: "POST",
    headers: {
      ...MEDUSA_HEADERS,
      Authorization: `Bearer ${process.env.MEDUSA_API_KEY || ""}`,
    },
    body: JSON.stringify({ metadata }),
  });
}

// ─── GET /api/admin/deposits ──────────────────────────────────────────────────
// Récupère tous les dépôts manuels (depuis metadata Medusa)

export async function GET(request: Request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status"); // "pending" | "approved" | "rejected" | null (all)

  try {
    // Récupérer tous les clients (paginated)
    const res = await fetch(`${BACKEND}/admin/customers?limit=500`, {
      headers: {
        ...MEDUSA_HEADERS,
        Authorization: `Bearer ${process.env.MEDUSA_API_KEY || ""}`,
      },
    });

    if (!res.ok) {
      return NextResponse.json({ error: "Erreur backend Medusa" }, { status: 502 });
    }

    const data = await res.json();
    const customers = data.customers || [];

    const deposits: DepositRequest[] = [];

    for (const c of customers) {
      const meta = c.metadata || {};
      const customerDeposits: DepositRequest[] = meta.deposit_requests
        ? JSON.parse(meta.deposit_requests)
        : [];

      for (const d of customerDeposits) {
        deposits.push({
          ...d,
          customer_id: c.id,
          customer_name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email,
          customer_email: c.email,
          customer_phone: c.phone || "",
        });
      }
    }

    // Filtrer par statut si demandé
    const filtered = statusFilter
      ? deposits.filter((d) => d.status === statusFilter)
      : deposits;

    // Trier par date décroissante
    filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const stats = {
      total: deposits.length,
      pending: deposits.filter((d) => d.status === "pending").length,
      approved: deposits.filter((d) => d.status === "approved").length,
      rejected: deposits.filter((d) => d.status === "rejected").length,
      total_volume: deposits
        .filter((d) => d.status === "approved")
        .reduce((sum, d) => sum + d.amount, 0),
    };

    return NextResponse.json({ deposits: filtered, stats });
  } catch (err: any) {
    console.error("[admin/deposits GET]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ─── POST /api/admin/deposits ─────────────────────────────────────────────────
// Action admin : approuver ou rejeter un dépôt

export async function POST(request: Request) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = await request.json();
  const { deposit_id, customer_id, action, reject_reason } = body;

  if (!deposit_id || !customer_id || !action) {
    return NextResponse.json(
      { error: "deposit_id, customer_id et action requis" },
      { status: 400 }
    );
  }

  if (!["approve", "reject"].includes(action)) {
    return NextResponse.json({ error: "action invalide" }, { status: 400 });
  }

  try {
    const customer = await getCustomer(customer_id);
    if (!customer) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    const meta = customer.metadata || {};
    const deposits: DepositRequest[] = meta.deposit_requests
      ? JSON.parse(meta.deposit_requests)
      : [];

    const idx = deposits.findIndex((d) => d.id === deposit_id);
    if (idx === -1) {
      return NextResponse.json({ error: "Dépôt introuvable" }, { status: 404 });
    }

    const deposit = deposits[idx];

    if (deposit.status !== "pending") {
      return NextResponse.json(
        { error: `Ce dépôt est déjà "${deposit.status}"` },
        { status: 409 }
      );
    }

    // Mettre à jour le statut
    deposits[idx] = {
      ...deposit,
      status: action === "approve" ? "approved" : "rejected",
      processed_at: new Date().toISOString(),
      ...(reject_reason && { notes: reject_reason }),
    };

    // Si approuvé → créditer le wallet ambassadeur dans les metadata
    if (action === "approve") {
      const wallet: { balance: number; currency: string; ledger: any[] } = meta.wallet
        ? JSON.parse(meta.wallet)
        : { balance: 0, currency: deposit.currency, ledger: [] };

      wallet.balance = (wallet.balance || 0) + deposit.amount;
      wallet.ledger.push({
        id: `LGR-${Date.now()}`,
        type: "DEPOSIT",
        source: "ADMIN",
        amount: deposit.amount,
        currency: deposit.currency,
        reference: deposit.reference_code,
        balance_after: wallet.balance,
        status: "COMPLETED",
        created_at: new Date().toISOString(),
      });

      meta.wallet = JSON.stringify(wallet);
    }

    meta.deposit_requests = JSON.stringify(deposits);

    const updateRes = await updateCustomerMeta(customer_id, meta);
    if (!updateRes.ok) {
      throw new Error("Échec de la mise à jour Medusa");
    }

    // Email de notification client
    const firstName = customer.first_name || "";
    if (action === "approve" && customer.email) {
      try {
        const html = DepositReceivedTemplate(
          firstName || customer.email,
          deposit.amount,
          deposit.currency,
          deposit.method
        );
        await sendEmail({
          to: customer.email,
          subject: `✅ Dépôt confirmé — ${deposit.amount.toLocaleString("fr-FR")} ${deposit.currency} | HelyaCare`,
          html,
        });
      } catch (emailErr) {
        console.error("[admin/deposits] Email notification failed:", emailErr);
      }
    }

    return NextResponse.json({
      success: true,
      action,
      deposit: deposits[idx],
    });
  } catch (err: any) {
    console.error("[admin/deposits POST]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
