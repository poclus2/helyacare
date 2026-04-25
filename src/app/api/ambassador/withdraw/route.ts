import { NextResponse } from "next/server";

/**
 * POST /api/ambassador/withdraw
 * Demande de retrait des commissions
 *
 * Workflow :
 * 1. Vérifier le solde disponible
 * 2. Enregistrer la demande en "processing"
 * 3. Notifier l'admin par email
 * 4. Mettre les commissions en "processing" (bloquées)
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
const RESEND_KEY = process.env.RESEND_API_KEY || "";
const EMAIL_FROM = process.env.EMAIL_FROM || "HelyaCare <commandes@helyacare.com>";

const MIN_WITHDRAWAL = 10_000; // 10 000 XOF minimum

export async function POST(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { method, account_details } = body;
    // method: "wave" | "orange_money" | "mtn_momo" | "bank"
    // account_details: { phone?: string, account_name?: string, bank_code?: string }

    if (!method || !account_details) {
      return NextResponse.json({ error: "method et account_details requis" }, { status: 400 });
    }

    // 1. Récupérer le customer et ses commissions
    const meRes = await fetch(`${BACKEND}/store/customers/me`, {
      headers: {
        Authorization: authHeader,
        ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
      },
    });
    if (!meRes.ok) return NextResponse.json({ error: "Customer introuvable" }, { status: 404 });

    const { customer } = await meRes.json();
    const meta = customer.metadata || {};
    const commissions = meta.commissions ? JSON.parse(meta.commissions) : [];
    const pending = commissions.filter((c: any) => c.status === "pending");
    const pendingAmount = pending.reduce((s: number, c: any) => s + c.amount, 0);

    // 2. Vérifier le montant minimum
    if (pendingAmount < MIN_WITHDRAWAL) {
      return NextResponse.json({
        error: `Montant insuffisant. Minimum requis : ${MIN_WITHDRAWAL.toLocaleString("fr-FR")} XOF. Votre solde : ${pendingAmount.toLocaleString("fr-FR")} XOF.`,
      }, { status: 400 });
    }

    // 3. Créer la demande de retrait
    const withdrawalId = `wd_${Date.now().toString(36).toUpperCase()}`;
    const withdrawalRequest = {
      id: withdrawalId,
      customer_id: customer.id,
      customer_email: customer.email,
      customer_name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      amount: pendingAmount,
      currency: "XOF",
      method,
      account_details,
      status: "processing",
      created_at: new Date().toISOString(),
      commission_ids: pending.map((c: any) => c.id),
    };

    // 4. Marquer les commissions en "processing"
    const updatedCommissions = commissions.map((c: any) =>
      pending.find((p: any) => p.id === c.id)
        ? { ...c, status: "processing", withdrawal_id: withdrawalId }
        : c
    );

    // 5. Sauvegarder dans les metadata
    const withdrawals = meta.withdrawals ? JSON.parse(meta.withdrawals) : [];
    await fetch(`${BACKEND}/store/customers/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
        ...(PUB_KEY && { "x-publishable-api-key": PUB_KEY }),
      },
      body: JSON.stringify({
        metadata: {
          ...meta,
          commissions: JSON.stringify(updatedCommissions),
          withdrawals: JSON.stringify([...withdrawals, withdrawalRequest]),
        },
      }),
    });

    // 6. Notifier l'admin par email (si Resend configuré)
    if (RESEND_KEY && !RESEND_KEY.includes("XXXX")) {
      const methodLabels: Record<string, string> = {
        wave: "Wave",
        orange_money: "Orange Money",
        mtn_momo: "MTN MoMo",
        bank: "Virement bancaire",
      };
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: EMAIL_FROM,
          to: ["admin@helyacare.com"],
          subject: `💰 Demande de retrait — ${withdrawalRequest.customer_name} — ${pendingAmount.toLocaleString("fr-FR")} XOF`,
          html: `
            <h2>Nouvelle demande de retrait</h2>
            <p><strong>Ambassadeur :</strong> ${withdrawalRequest.customer_name} (${customer.email})</p>
            <p><strong>Montant :</strong> ${pendingAmount.toLocaleString("fr-FR")} XOF</p>
            <p><strong>Méthode :</strong> ${methodLabels[method] || method}</p>
            <p><strong>Détails :</strong> ${JSON.stringify(account_details)}</p>
            <p><strong>Référence :</strong> ${withdrawalId}</p>
            <p><strong>Date :</strong> ${new Date().toLocaleString("fr-FR")}</p>
            <hr>
            <p>Traitez ce retrait depuis le panneau admin Medusa ou directement depuis votre plateforme de paiement.</p>
          `,
        }),
      });
    }

    console.log(`[withdraw] Demande ${withdrawalId} créée pour ${customer.email} — ${pendingAmount} XOF`);

    return NextResponse.json({
      success: true,
      withdrawal_id: withdrawalId,
      amount: pendingAmount,
      status: "processing",
      message: `Demande de retrait de ${pendingAmount.toLocaleString("fr-FR")} XOF envoyée. Traitement sous 24-48h.`,
    });

  } catch (error: any) {
    console.error("[withdraw]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
