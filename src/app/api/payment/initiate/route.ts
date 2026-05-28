import { NextResponse } from "next/server";
import { auth } from "@/auth";

/**
 * POST /api/payment/initiate
 * Initialise un paiement Flutterwave et retourne les paramètres
 * pour le widget inline Flutterwave.
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    const body = await request.json();

    const {
      cart,
      customer,   // { first_name, last_name, email, phone }
      address,    // { line1, line2, city, country, zip }
      amount,
      currency = "XOF",
      gateway,
      payment_method,
    } = body;

    if (!amount || !customer?.email) {
      return NextResponse.json({ error: "Données manquantes (amount, email requis)" }, { status: 400 });
    }

    // Génération d'une référence unique
    const tx_ref = `HC-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Calculate total bonus points
    const total_bonus_points = cart?.items?.reduce((sum: number, item: any) => sum + ((item.bonus_points || 0) * (item.quantity || 1)), 0) || 0;

    // Métadonnées à transmettre à Flutterwave (récupérées dans le webhook)
    const meta = {
      customer_id: session?.customer_id || null,
      cart_id: cart?.id || null,
      total_bonus_points: total_bonus_points,
      cart_items: JSON.stringify(cart?.items?.map((item: any) => ({
        variant_id: item.variant_id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
        bonus_points: item.bonus_points || 0,
      })) || []),
      address: JSON.stringify(address || {}),
    };

    // Récupérer la passerelle active depuis les paramètres
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
    let adminHeaders: Record<string, string> = { "Content-Type": "application/json" };
    try {
      const { getMedusaAdminToken } = await import("@/lib/medusa-admin-auth");
      const token = await getMedusaAdminToken();
      adminHeaders["Authorization"] = `Bearer ${token}`;
    } catch (e) {
      const apiKey = process.env.MEDUSA_API_KEY || "";
      if (apiKey) {
        adminHeaders["Authorization"] = `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}`;
      }
    }
    
    // ── Update Medusa Cart with Customer Email & Address ──
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;
    const medusaHeaders = {
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    if (cart?.id) {
      try {
        await fetch(`${backendUrl}/store/carts/${cart.id}`, {
          method: "POST",
          headers: medusaHeaders,
          body: JSON.stringify({
            email: customer.email,
            customer_id: session?.customer_id || undefined,
            shipping_address: {
              first_name: customer.first_name || "",
              last_name: customer.last_name || "",
              phone: customer.phone || "",
              address_1: address?.line1 || "",
              address_2: address?.line2 || "",
              city: address?.city || "",
              country_code: "sn", // Fallback sur SN car Medusa exige un ISO code 2 lettres
              postal_code: address?.zip || "",
            }
          })
        });
        console.log(`[payment/initiate] Panier ${cart.id} mis à jour avec le client ${customer.email}`);
      } catch (err) {
        console.error(`[payment/initiate] Erreur mise à jour panier Medusa:`, err);
      }
    }
    
    let activeGateway = "tara"; // Force Tara
      // Configuration Tara
      const taraApiKey = process.env.TARA_API_KEY || "eO4qfliMGo6yvkSmPqDPKUoH";
      const taraBusinessId = process.env.TARA_BUSINESS_ID || "5AuML9WXgI";

        // Pack extra data into tx_ref to avoid multiple query params breaking Tara
        const custom_tx_ref = `${tx_ref}__${session?.customer_id || "none"}__${amount}__${total_bonus_points}__${cart?.id || "none"}`;
        
        const taraPayload = {
          apiKey: taraApiKey,
          businessId: taraBusinessId,
          productId: tx_ref,
          productName: `Commande HelyaCare — ${cart?.items?.length || 1} article(s)`,
          productPrice: amount,
          price: amount,
          amount: amount,
          productDescription: `Paiement pour ${customer.first_name} ${customer.last_name}`,
          productPictureUrl: `${baseUrl}/logo-white.png`,
          returnUrl: `${baseUrl}/commande/succes?tx_ref=${tx_ref}`,
          webHookUrl: `${baseUrl}/api/payment/webhook-tara?tx_ref=${custom_tx_ref}`,
        };

      console.log("[payment/initiate] Tara Payload:", JSON.stringify(taraPayload, null, 2));
      const taraRes = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taraPayload),
      });

      const taraData = await taraRes.json();
      console.log("[payment/initiate] Tara Response:", JSON.stringify(taraData, null, 2));

      if (taraData.status?.toLowerCase() === "success" && taraData.generalLink) {
        const paymentUrl = payment_method === "tara_card" && taraData.cardLink 
          ? taraData.cardLink 
          : taraData.generalLink;
          
        return NextResponse.json({
          success: true,
          tx_ref,
          paymentUrl,
          gateway: "tara"
        });
      } else {
        throw new Error(`Erreur de génération du lien Tara: ${JSON.stringify(taraData)}`);
      }
  } catch (error: any) {
    console.error("[payment/initiate]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
