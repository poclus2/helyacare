import { NextResponse } from "next/server";
import { sendOrderConfirmationEmail } from "@/lib/email/notifications";
import { sendOrderConfirmationSms } from "@/lib/sms";

/**
 * POST /api/payment/webhook-tara
 * Reçoit les événements de la passerelle Tara.
 * L'URL configurée lors de l'initiation est de la forme:
 * /api/payment/webhook-tara?tx_ref=HC-XXXX&cart_id=cart_XXXX
 */
export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tx_ref = searchParams.get("tx_ref");
    const cartId = searchParams.get("cart_id");

    const body = await request.text();
    console.log("[webhook-tara] Événement reçu. tx_ref:", tx_ref, "cart_id:", cartId);
    console.log("[webhook-tara] Payload:", body);

    // TODO: Ajouter la vérification de la signature Tara ou du statut dans le payload
    // Pour l'instant, on suppose que si le webhook est appelé, c'est que le paiement est réussi,
    // mais il est crucial d'adapter cette partie en fonction de la documentation de Tara.
    let parsedBody;
    try {
      parsedBody = JSON.parse(body);
    } catch (e) {
      parsedBody = body;
    }

    if (parsedBody && parsedBody.status && parsedBody.status !== "success") {
       console.log("[webhook-tara] Paiement non réussi selon le payload:", parsedBody.status);
       return NextResponse.json({ received: true });
    }

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaHeaders = {
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    // Compléter le panier Medusa si disponible
    let orderId: string | null = null;
    if (cartId) {
      try {
        const completeRes = await fetch(`${backendUrl}/store/carts/${cartId}/complete`, {
          method: "POST",
          headers: medusaHeaders,
        });
        if (completeRes.ok) {
          const completeData = await completeRes.json();
          orderId = completeData.data?.id;
          console.log(`[webhook-tara] Panier ${cartId} complété avec succès. Order: ${orderId}`);
        } else {
          console.warn(`[webhook-tara] Échec de la complétion du panier ${cartId}`);
        }
      } catch (e) {
        console.error(`[webhook-tara] Erreur lors de la complétion:`, e);
      }
    }

    // Note: L'attribution des points et les emails dépendent de la récupération des infos client 
    // et des articles, ce qui nécessiterait soit de les passer via les paramètres de requête, 
    // soit de récupérer la commande Medusa fraîchement créée.

    return NextResponse.json({ received: true, success: true });
  } catch (error) {
    console.error("[webhook-tara] Erreur interne:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
