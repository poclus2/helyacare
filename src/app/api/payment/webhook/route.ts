import { NextResponse } from "next/server";
import crypto from "crypto";
import { sendOrderConfirmationEmail } from "@/lib/email/notifications";
import { sendOrderConfirmationSms } from "@/lib/sms";

/**
 * POST /api/payment/webhook
 * Reçoit les événements Flutterwave de façon asynchrone.
 * Utile quand l'utilisateur ferme son navigateur avant la redirection.
 *
 * Configuration dans le dashboard Flutterwave :
 * Settings → Webhooks → URL : https://votre-domaine.com/api/payment/webhook
 * Hash secret : valeur de FLUTTERWAVE_WEBHOOK_SECRET dans .env
 */
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("verif-hash");
    const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET;

    // 1. Vérification de l'authenticité du webhook
    if (!webhookSecret || webhookSecret.includes("XXXX")) {
      // Mode développement → accepter sans vérification
      console.warn("[webhook] Mode dev — signature non vérifiée");
    } else {
      if (!signature || signature !== webhookSecret) {
        console.error("[webhook] Signature invalide");
        return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
      }
    }

    const event = JSON.parse(body);
    console.log("[webhook] Événement reçu:", event.event, event.data?.tx_ref);

    // 2. Ne traiter que les paiements réussis
    if (event.event !== "charge.completed") {
      return NextResponse.json({ received: true });
    }

    const data = event.data;

    if (data.status !== "successful") {
      console.log("[webhook] Paiement non réussi:", data.status);
      return NextResponse.json({ received: true });
    }

    // 3. Vérification double auprès de l'API Flutterwave (sécurité)
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
    let verified = false;
    let cartId: string | null = null;
    let cartItems: any[] = [];
    let customerId: string | null = null;

    if (secretKey && !secretKey.includes("XXXX")) {
      const verifyRes = await fetch(
        `https://api.flutterwave.com/v3/transactions/${data.id}/verify`,
        { headers: { Authorization: `Bearer ${secretKey}` } }
      );
      if (verifyRes.ok) {
        const verifyData = await verifyRes.json();
        if (verifyData.status === "success" && verifyData.data.status === "successful") {
          verified = true;
          const meta = verifyData.data.meta || {};
          cartId = meta.cart_id || null;
          cartItems = meta.cart_items ? JSON.parse(meta.cart_items) : [];
          customerId = meta.customer_id || null;
        }
      }
    } else {
      // Mode dev → pas de double vérification
      verified = true;
      const meta = data.meta || {};
      cartId = meta.cart_id || null;
      cartItems = meta.cart_items ? JSON.parse(meta.cart_items) : [];
      customerId = meta.customer_id || null;
    }

    if (!verified) {
      console.error("[webhook] Double vérification échouée");
      return NextResponse.json({ error: "Vérification échouée" }, { status: 400 });
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaHeaders = {
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    // 4. Compléter le panier Medusa si disponible
    let orderId: string | null = null;
    if (cartId) {
      try {
        const completeRes = await fetch(`${backendUrl}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: medusaHeaders,
        });
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          orderId = completeData.order?.id || null;
          console.log("[webhook] Commande Medusa créée:", orderId);
        }
      } catch (err) {
        console.error("[webhook] Erreur création commande Medusa:", err);
      }
    }

    // 5. Créditer les commissions ambassadeur (si applicable)
    if (customerId && orderId) {
      try {
        await fetch(`${backendUrl}/store/ambassadors/commission`, {
          method: "POST",
          headers: {
            ...medusaHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            order_id: orderId,
            amount: data.amount,
          }),
        });
        console.log("[webhook] Commission MLM traitée pour:", customerId);
      } catch (err) {
        console.error("[webhook] Erreur commission MLM:", err);
      }
    }

    // 6. Email de confirmation commande (non-bloquant)
    const customerEmail = data.customer?.email;
    const customerName = data.customer?.name || "";
    const firstName = customerName.split(" ")[0] || "";
    if (customerEmail && orderId) {
      try {
        await sendOrderConfirmationEmail(
          customerEmail,
          firstName,
          orderId,
          Number(data.amount),
          data.currency || "XOF",
          cartItems
        );
        console.log("[webhook] Email confirmation envoyé à:", customerEmail);
      } catch (emailErr) {
        console.error("[webhook] Email confirmation failed (non-blocking):", emailErr);
      }
    }

    // 7. SMS de confirmation (non-bloquant)
    const customerPhone = data.customer?.phone_number;
    if (customerPhone && orderId) {
      try {
        await sendOrderConfirmationSms(
          customerPhone,
          firstName || customerName,
          orderId,
          Number(data.amount),
          data.currency || "XOF"
        );
        console.log("[webhook] SMS confirmation envoyé à:", customerPhone);
      } catch (smsErr) {
        console.error("[webhook] SMS confirmation failed (non-blocking):", smsErr);
      }
    }

    console.log("[webhook] ✅ Traitement complet — tx_ref:", data.tx_ref, "| order:", orderId);
    return NextResponse.json({ received: true, order_id: orderId });

  } catch (error: any) {
    console.error("[webhook] Erreur critique:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
