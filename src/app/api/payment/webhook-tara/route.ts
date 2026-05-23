import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email/notifications";
import { sendOrderConfirmationSms } from "@/lib/sms";

/**
 * POST /api/payment/webhook-tara
 * Reçoit les événements de la passerelle Tara.
 * L'URL configurée lors de l'initiation est de la forme:
 * /api/payment/webhook-tara?tx_ref=HC-XXXX&cart_id=cart_XXXX&customer_id=cus_XXXX&amount=XXXX&bonus_points=XX
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const raw_tx_ref = searchParams.get("tx_ref") || "";
    
    // Parse the packed custom tx_ref (HC-XXXX__cus_XXXX__1000__100__cart_XXXX)
    const parts = raw_tx_ref.split("__");
    const tx_ref = parts[0] || raw_tx_ref;
    const customerId = parts.length > 1 && parts[1] !== "none" ? parts[1] : searchParams.get("customer_id");
    const amountStr = parts.length > 2 ? parts[2] : searchParams.get("amount");
    const bonusPointsStr = parts.length > 3 ? parts[3] : searchParams.get("bonus_points");
    const cartId = parts.length > 4 && parts[4] !== "none" ? parts[4] : searchParams.get("cart_id");

    const amount = amountStr ? parseFloat(amountStr) : 0;
    const bonusPoints = bonusPointsStr ? parseInt(bonusPointsStr, 10) : 0;

    const body = await request.text();
    console.log("[webhook-tara] Événement reçu. tx_ref:", tx_ref, "cart_id:", cartId);
    console.log("[webhook-tara] Payload:", body);

    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      parsedBody = body;
    }

    if (parsedBody && parsedBody.status && parsedBody.status.toLowerCase() !== "success") {
       console.log("[webhook-tara] Paiement non réussi selon le payload:", parsedBody.status);
       return NextResponse.json({ received: true });
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const apiKey = process.env.MEDUSA_API_KEY || "";

    const medusaHeaders = {
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    const adminHeaders = {
      "Content-Type": "application/json",
      ...(apiKey && { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` }),
    };

    // 1. Compléter le panier Medusa si disponible
    let orderId: string | null = null;
    if (cartId) {
      try {
        const completeRes = await fetch(`${backendUrl}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: medusaHeaders,
        });
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          orderId = completeData.order?.id || completeData.data?.id || null;
          console.log(`[webhook-tara] Panier ${cartId} complété avec succès. Order: ${orderId}`);
        } else {
          console.warn(`[webhook-tara] Échec de la complétion du panier ${cartId}. Status: ${completeRes.status}`);
        }
      } catch (e) {
        console.error(`[webhook-tara] Erreur lors de la complétion:`, e);
      }
    }

    // 1b. Fallback : Si produit 100% virtuel (aucun panier Medusa), on l'enregistre dans les metadata du client
    if (!orderId && customerId) {
      try {
        const customerRes = await fetch(`${backendUrl}/admin/customers/${customerId}`, { headers: adminHeaders });
        if (customerRes.ok) {
          const custData = await customerRes.json();
          let depositReqs = custData.customer?.metadata?.deposit_requests ? JSON.parse(custData.customer.metadata.deposit_requests) : [];
          
          const virtualOrder = {
             id: tx_ref,
             reference_code: tx_ref,
             amount: amount,
             status: "completed",
             method: "tara",
             created_at: new Date().toISOString(),
             processed_at: new Date().toISOString(),
             cart_items: [
               { title: bonusPoints > 0 ? `Pack Ambassadeur HelyaCare (${bonusPoints} PV)` : "Commande Virtuelle HelyaCare", unit_price: amount, quantity: 1 }
             ]
          };
          
          if (!depositReqs.some((d: any) => d.id === tx_ref)) {
            depositReqs.push(virtualOrder);
            await fetch(`${backendUrl}/admin/customers/${customerId}`, {
              method: "POST",
              headers: adminHeaders,
              body: JSON.stringify({ metadata: { ...custData.customer.metadata, deposit_requests: JSON.stringify(depositReqs) }})
            });
            console.log(`[webhook-tara] Commande virtuelle enregistrée dans metadata pour le client ${customerId}`);
          }
        }
      } catch (err) {
        console.error(`[webhook-tara] Erreur enregistrement commande virtuelle:`, err);
      }
    }

    // 2. Créditer les commissions ambassadeur (si applicable)
    if (customerId && orderId) {
      try {
        const commissionRes = await fetch(`${backendUrl}/store/ambassadors/commission`, {
          method: "POST",
          headers: {
            ...medusaHeaders,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            customer_id: customerId,
            order_id: orderId,
            amount: amount,
            bonus_points: bonusPoints,
          }),
        });
        if (commissionRes.ok) {
          console.log("[webhook-tara] Commission MLM traitée pour:", customerId);
        } else {
          console.warn("[webhook-tara] Échec du traitement de la commission:", await commissionRes.text());
        }
      } catch (err) {
        console.error("[webhook-tara] Erreur commission MLM:", err);
      }
    }

    // 3. Récupérer les détails de la commande pour notifications (email/SMS)
    if (orderId) {
      try {
        const orderRes = await fetch(`${backendUrl}/admin/orders/${orderId}`, {
          headers: adminHeaders,
        });

        if (orderRes.ok) {
          const { order } = await orderRes.json();
          
          const customerEmail = order.email;
          const customerName = `${order.shipping_address?.first_name || ""} ${order.shipping_address?.last_name || ""}`.trim();
          const firstName = order.shipping_address?.first_name || customerName.split(" ")[0] || "";
          const customerPhone = order.shipping_address?.phone;
          const currency = order.currency_code?.toUpperCase() || "XOF";
          const cartItems = order.items?.map((item: any) => ({
            title: item.title,
            quantity: item.quantity,
            unit_price: item.unit_price
          })) || [];

          // 3a. Email de confirmation
          if (customerEmail) {
            try {
              await sendOrderConfirmationEmail(
                customerEmail,
                firstName,
                orderId,
                amount || order.total,
                currency,
                cartItems
              );
              console.log("[webhook-tara] Email confirmation envoyé à:", customerEmail);
            } catch (emailErr) {
              console.error("[webhook-tara] Email confirmation failed:", emailErr);
            }
          }

          // 3b. SMS de confirmation
          if (customerPhone) {
            try {
              await sendOrderConfirmationSms(
                customerPhone,
                firstName,
                orderId,
                amount || order.total,
                currency
              );
              console.log("[webhook-tara] SMS confirmation envoyé à:", customerPhone);
            } catch (smsErr) {
              console.error("[webhook-tara] SMS confirmation failed:", smsErr);
            }
          }
        }
      } catch (err) {
        console.error("[webhook-tara] Erreur lors de l'envoi des notifications:", err);
      }
    }

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error("[webhook-tara] Erreur interne:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
