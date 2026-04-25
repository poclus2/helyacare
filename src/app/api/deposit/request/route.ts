import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/deposit/request
 * Permet à un client/ambassadeur authentifié de créer une demande de dépôt manuel.
 * Le dépôt reste en PENDING jusqu'à validation admin.
 *
 * Body: {
 *   amount: number,
 *   currency?: string,          // "XOF" par défaut
 *   method: "wave" | "orange_money" | "mtn_momo" | "bank" | "other",
 *   payer_phone?: string,        // Numéro qui envoie le Mobile Money
 *   notes?: string               // Référence ou message libre
 * }
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

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

function generateReference(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let ref = "HC-DEP-";
  for (let i = 0; i < 8; i++) {
    ref += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return ref;
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.customer_id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const body = await request.json();
    const { amount, currency = "XOF", method, payer_phone, notes } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Montant invalide" }, { status: 400 });
    }

    if (!method || !PAYMENT_INSTRUCTIONS[method]) {
      return NextResponse.json({ error: "Méthode de paiement invalide" }, { status: 400 });
    }

    // Seuil minimum
    const MIN_AMOUNT: Record<string, number> = {
      wave: 500, orange_money: 500, mtn_momo: 500, bank: 5000, other: 500,
    };
    if (amount < (MIN_AMOUNT[method] || 500)) {
      return NextResponse.json(
        { error: `Montant minimum : ${MIN_AMOUNT[method]} ${currency}` },
        { status: 400 }
      );
    }

    // Générer un code de référence unique
    const referenceCode = generateReference();

    // Créer l'objet demande de dépôt
    const depositRequest = {
      id: `DEP-${Date.now()}`,
      customer_id: session.customer_id,
      amount,
      currency,
      method,
      reference_code: referenceCode,
      payer_phone: payer_phone || null,
      notes: notes || null,
      status: "pending",
      created_at: new Date().toISOString(),
    };

    // Récupérer les metadata actuelles du customer
    const getRes = await fetch(`${BACKEND}/store/customers/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
        ...(session.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
    });

    let currentMeta: Record<string, string> = {};
    if (getRes.ok) {
      const getData = await getRes.json();
      currentMeta = getData.customer?.metadata || {};
    }

    // Ajouter la demande à l'historique
    const existingDeposits = currentMeta.deposit_requests
      ? JSON.parse(currentMeta.deposit_requests)
      : [];
    existingDeposits.push(depositRequest);

    // Mettre à jour les metadata
    const updateRes = await fetch(`${BACKEND}/store/customers/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
        ...(session.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
      body: JSON.stringify({
        metadata: {
          ...currentMeta,
          deposit_requests: JSON.stringify(existingDeposits),
        },
      }),
    });

    if (!updateRes.ok) {
      console.error("[deposit/request] Medusa update failed");
      // Non-bloquant : on retourne quand même la demande avec les instructions
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

/**
 * GET /api/deposit/request
 * Retourne l'historique des dépôts du client connecté.
 */
export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.customer_id) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const getRes = await fetch(`${BACKEND}/store/customers/me`, {
      headers: {
        "Content-Type": "application/json",
        ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
        ...(session.access_token && { Authorization: `Bearer ${session.access_token}` }),
      },
    });

    if (!getRes.ok) {
      return NextResponse.json({ deposits: [], wallet: { balance: 0 } });
    }

    const getData = await getRes.json();
    const meta = getData.customer?.metadata || {};

    const deposits = meta.deposit_requests ? JSON.parse(meta.deposit_requests) : [];
    const wallet = meta.wallet ? JSON.parse(meta.wallet) : { balance: 0, currency: "XOF", ledger: [] };

    deposits.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ deposits, wallet });
  } catch (err: any) {
    console.error("[deposit/request GET]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
