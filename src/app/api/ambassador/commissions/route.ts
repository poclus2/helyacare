import { NextResponse } from "next/server";

/**
 * GET  /api/ambassador/commissions  → Historique des commissions
 * POST /api/ambassador/commissions  → Créer une commission (appelé par le webhook)
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

// Commission : 10% pour parrain direct, 5% pour niveau 2
const COMMISSION_RATES = { level1: 0.10, level2: 0.05 };

const adminHeaders = () => ({
  "Content-Type": "application/json",
  ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
});

// ── GET : historique des commissions du customer connecté ────────────────────
export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    // Récupérer le customer connecté
    const meRes = await fetch(`${BACKEND}/store/customers/me`, {
      headers: { Authorization: authHeader, ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }) },
    });
    if (!meRes.ok) return NextResponse.json({ error: "Customer introuvable" }, { status: 404 });

    const { customer } = await meRes.json();
    const meta = customer.metadata || {};

    // Commissions stockées dans les metadata (en attendant une table dédiée)
    const commissions: Commission[] = meta.commissions ? JSON.parse(meta.commissions) : [];
    const pending = commissions.filter(c => c.status === "pending").reduce((s, c) => s + c.amount, 0);
    const paid = commissions.filter(c => c.status === "paid").reduce((s, c) => s + c.amount, 0);
    const total = commissions.reduce((s, c) => s + c.amount, 0);

    return NextResponse.json({
      customer_id: customer.id,
      referral_code: meta.referral_code || null,
      balance: { pending, paid, total },
      commissions,
    });

  } catch (error: any) {
    console.error("[commissions GET]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ── POST : enregistrer une commission (appelé par le webhook Flutterwave) ─────
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { customer_id, order_id, amount, currency = "XOF" } = body;

    if (!customer_id || !order_id || !amount) {
      return NextResponse.json({ error: "customer_id, order_id et amount requis" }, { status: 400 });
    }

    // 1. Récupérer le customer pour trouver son parrain
    const custRes = await fetch(`${BACKEND}/admin/customers/${customer_id}`, {
      headers: adminHeaders(),
    });
    if (!custRes.ok) return NextResponse.json({ received: true, skipped: "customer_not_found" });

    const { customer } = await custRes.json();
    const meta = customer.metadata || {};
    const referredBy: string | null = meta.referred_by || null;

    if (!referredBy) {
      return NextResponse.json({ received: true, skipped: "no_referrer" });
    }

    // 2. Commission niveau 1 — parrain direct
    const commission1Amount = Math.round(amount * COMMISSION_RATES.level1);
    await addCommission(referredBy, {
      id: `comm_${order_id}_l1`,
      order_id,
      buyer_id: customer_id,
      level: 1,
      amount: commission1Amount,
      currency,
      rate: COMMISSION_RATES.level1,
      status: "pending",
      created_at: new Date().toISOString(),
    });

    // 3. Commission niveau 2 — grand-parrain (si existe)
    const parentRes = await fetch(`${BACKEND}/admin/customers/${referredBy}`, {
      headers: adminHeaders(),
    });
    if (parentRes.ok) {
      const { customer: parentCustomer } = await parentRes.json();
      const grandParent = parentCustomer?.metadata?.referred_by;
      if (grandParent) {
        const commission2Amount = Math.round(amount * COMMISSION_RATES.level2);
        await addCommission(grandParent, {
          id: `comm_${order_id}_l2`,
          order_id,
          buyer_id: customer_id,
          level: 2,
          amount: commission2Amount,
          currency,
          rate: COMMISSION_RATES.level2,
          status: "pending",
          created_at: new Date().toISOString(),
        });
      }
    }

    console.log(`[commissions] Commissions créées pour l'ordre ${order_id}`);
    return NextResponse.json({ success: true, commission_l1: commission1Amount });

  } catch (error: any) {
    console.error("[commissions POST]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// ── Helper : ajouter une commission dans les metadata d'un customer ──────────
interface Commission {
  id: string;
  order_id: string;
  buyer_id: string;
  level: number;
  amount: number;
  currency: string;
  rate: number;
  status: "pending" | "paid";
  created_at: string;
}

async function addCommission(customerId: string, commission: Commission) {
  // Lire les commissions existantes
  const res = await fetch(`${BACKEND}/admin/customers/${customerId}`, {
    headers: adminHeaders(),
  });
  if (!res.ok) return;

  const { customer } = await res.json();
  const meta = customer.metadata || {};
  const existing: Commission[] = meta.commissions ? JSON.parse(meta.commissions) : [];

  // Éviter les doublons
  if (existing.find(c => c.id === commission.id)) return;

  const updated = [...existing, commission];

  // Mettre à jour les metadata
  await fetch(`${BACKEND}/admin/customers/${customerId}`, {
    method: "POST",
    headers: adminHeaders(),
    body: JSON.stringify({
      metadata: {
        ...meta,
        commissions: JSON.stringify(updated),
      },
    }),
  });
}
