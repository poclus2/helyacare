import { NextResponse } from "next/server";

/**
 * GET /api/payment/verify?transaction_id=xxx&tx_ref=yyy
 * Vérifie le paiement auprès de Flutterwave et crée la commande Medusa.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transaction_id = searchParams.get("transaction_id");
  const tx_ref = searchParams.get("tx_ref");
  const status = searchParams.get("status");

  if (status === "cancelled") {
    return NextResponse.json({ success: false, status: "cancelled" });
  }

  if (!transaction_id) {
    return NextResponse.json({ error: "transaction_id manquant" }, { status: 400 });
  }

  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey || secretKey.includes("XXXX")) {
    // Mode développement sans clé réelle → simuler succès
    return NextResponse.json({
      success: true,
      dev_mode: true,
      tx_ref,
      transaction_id,
      message: "Mode développement — paiement simulé",
    });
  }

  try {
    // 1. Vérification auprès de l'API Flutterwave
    const flwRes = await fetch(
      `https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,
      {
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const flwData = await flwRes.json();

    if (!flwRes.ok || flwData.status !== "success") {
      return NextResponse.json(
        { success: false, error: "Vérification Flutterwave échouée", details: flwData },
        { status: 400 }
      );
    }

    const tx = flwData.data;

    // 2. Vérifier que le paiement est bien "successful"
    if (tx.status !== "successful") {
      return NextResponse.json({ success: false, status: tx.status });
    }

    // 3. Récupérer les métadonnées stockées
    const meta = tx.meta || {};
    const cartId = meta.cart_id;
    const cartItems = meta.cart_items ? JSON.parse(meta.cart_items) : [];
    const customerId = meta.customer_id;

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

    const medusaHeaders = {
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    let orderId: string | null = null;

    // 4a. Si on a un cart Medusa → le compléter
    if (cartId) {
      try {
        const completeRes = await fetch(`${backendUrl}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: medusaHeaders,
        });
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          orderId = completeData.order?.id || completeData.data?.id || null;
        }
      } catch {}
    }

    return NextResponse.json({
      success: true,
      tx_ref: tx.tx_ref,
      transaction_id: tx.id,
      amount: tx.amount,
      currency: tx.currency,
      customer: tx.customer,
      order_id: orderId,
    });
  } catch (error: any) {
    console.error("[payment/verify]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
