import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/deposit/request
 * Crée une demande de dépôt manuel (paiement Mobile Money ou virement).
 * Utilise l'Admin API de Medusa pour persister les données de façon fiable,
 * indépendamment de l'état du token store du client.
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

const PAYMENT_INSTRUCTIONS: Record<string, { label: string; target: string; note: string }> = {
  wave: {
    label: "Wave",
    target: process.env.WAVE_NUMBER || "+221 XX XXX XX XX",
    note: "Envoyez le montant exact à ce numéro Wave. Mentionnez votre référence dans l'objet du paiement.",
  },
  orange_money: {
    label: "Orange Money",
    target: process.env.ORANGE_MONEY_NUMBER || "+221 XX XXX XX XX",
    note: "Envoyez via Orange Money à ce numéro. Ajoutez votre référence en commentaire.",
  },
  mtn_momo: {
    label: "MTN MoMo",
    target: process.env.MTN_MOMO_NUMBER || "+237 XX XX XX XX XX",
    note: "Utilisez votre MoMo pour envoyer à ce numéro. Référence obligatoire.",
  },
  bank: {
    label: "Virement Bancaire",
    target: process.env.BANK_IBAN || "IBAN: FR76 XXXX XXXX XXXX",
    note: "Effectuez un virement avec votre référence comme motif. Délai : 2-3 jours ouvrés.",
  },
  other: {
    label: "Autre",
    target: "care@helyacare.com",
    note: "Contactez-nous par email pour convenir des modalités.",
  },
};

const MIN_AMOUNT: Record<string, number> = {
  wave: 500, orange_money: 500, mtn_momo: 500, bank: 5000, other: 500,
};

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "HC-DEP-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

function getAdminHeaders() {
  const API_KEY = process.env.MEDUSA_API_KEY || "";
  return {
    "Content-Type": "application/json",
    Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`,
  };
}

// ─── POST /api/deposit/request ────────────────────────────────────────────────

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.customer_id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await request.json();
    const {
      amount,
      currency = "XOF",
      method,
      payer_phone,
      notes,
      cart_id,       // optionnel — si paiement checkout
      cart_items,    // optionnel — articles du panier
    } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }
    if (!method || !PAYMENT_INSTRUCTIONS[method]) {
      return NextResponse.json({ error: "Méthode de paiement invalide" }, { status: 400 });
    }
    if (amount < (MIN_AMOUNT[method] || 500)) {
      return NextResponse.json(
        { error: `Montant minimum : ${MIN_AMOUNT[method]} ${currency}` },
        { status: 400 }
      );
    }

    const referenceCode = generateReference();
    const now = new Date().toISOString();
    const depositId = `DEP-${Date.now()}`;

    const depositRequest = {
      id: depositId,
      customer_id: session.customer_id,
      amount,
      currency,
      method,
      reference_code: referenceCode,
      payer_phone: payer_phone || null,
      notes: notes || null,
      status: "pending",
      created_at: now,
      // Contexte commande (si paiement checkout)
      cart_id: cart_id || null,
      cart_items: cart_items || null,
      type: cart_id ? "order" : "wallet",
    };

    const adminHeaders = getAdminHeaders();

    // ── 1. Récupérer le client via Admin API (fiable, pas dépendant du token store) ──
    const getRes = await fetch(`${BACKEND}/admin/customers/${session.customer_id}`, {
      headers: adminHeaders,
    });

    if (!getRes.ok) {
      console.error("[deposit/request] Impossible de récupérer le client Medusa:", getRes.status);
      return NextResponse.json(
        { error: "Impossible de récupérer le compte client. Vérifiez votre connexion." },
        { status: 502 }
      );
    }

    const getData = await getRes.json();
    const currentMeta: Record<string, string> = { ...(getData.customer?.metadata || {}) };

    // ── 2. Ajouter le dépôt à l'historique ──
    const existingDeposits: any[] = currentMeta.deposit_requests
      ? JSON.parse(currentMeta.deposit_requests)
      : [];
    existingDeposits.push(depositRequest);
    currentMeta.deposit_requests = JSON.stringify(existingDeposits);

    // ── 3. Si c'est un paiement de commande → enregistrer aussi comme commande en attente ──
    if (cart_id) {
      const pendingOrder = {
        id: `ORD-MANUAL-${Date.now()}`,
        deposit_id: depositId,
        reference_code: referenceCode,
        amount,
        currency,
        method,
        cart_id,
        cart_items: cart_items || [],
        customer_id: session.customer_id,
        status: "awaiting_payment",
        created_at: now,
      };
      const existingPending: any[] = currentMeta.pending_orders
        ? JSON.parse(currentMeta.pending_orders)
        : [];
      existingPending.push(pendingOrder);
      currentMeta.pending_orders = JSON.stringify(existingPending);
    }

    // ── 4. Persister via Admin API ──
    const updateRes = await fetch(`${BACKEND}/admin/customers/${session.customer_id}`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({ metadata: currentMeta }),
    });

    if (!updateRes.ok) {
      const errText = await updateRes.text().catch(() => "");
      console.error("[deposit/request] Medusa update failed:", updateRes.status, errText);
      return NextResponse.json(
        { error: "Échec de l'enregistrement du dépôt. Veuillez réessayer." },
        { status: 502 }
      );
    }

    const instructions = PAYMENT_INSTRUCTIONS[method];

    return NextResponse.json({
      success: true,
      deposit: depositRequest,
      instructions: {
        method: instructions.label,
        target: instructions.target,
        reference_code: referenceCode,
        note: instructions.note,
        amount: `${amount.toLocaleString("fr-FR")} ${currency}`,
      },
    });
  } catch (err: any) {
    console.error("[deposit/request]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

// ─── GET /api/deposit/request ─────────────────────────────────────────────────

export async function GET(_request: Request) {
  try {
    const session = await auth();
    if (!session?.customer_id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const adminHeaders = getAdminHeaders();

    const getRes = await fetch(`${BACKEND}/admin/customers/${session.customer_id}`, {
      headers: adminHeaders,
    });

    if (!getRes.ok) {
      return NextResponse.json({ deposits: [], wallet: { balance: 0 } });
    }

    const getData = await getRes.json();
    const meta = getData.customer?.metadata || {};

    const deposits: any[] = meta.deposit_requests ? JSON.parse(meta.deposit_requests) : [];
    const wallet = meta.wallet ? JSON.parse(meta.wallet) : { balance: 0, currency: "XOF", ledger: [] };

    deposits.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ deposits, wallet });
  } catch (err: any) {
    console.error("[deposit/request GET]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
