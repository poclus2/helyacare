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
    const apiKey = process.env.MEDUSA_API_KEY || "";
    const adminHeaders = {
      "Content-Type": "application/json",
      ...(apiKey && { Authorization: `Basic ${Buffer.from(`${apiKey}:`).toString("base64")}` }),
    };
    
    let activeGateway = "tara";
    try {
      const storeRes = await fetch(`${backendUrl}/admin/stores`, { headers: adminHeaders, cache: "no-store" });
      if (storeRes.ok) {
        const storeData = await storeRes.json();
        const store = storeData.stores?.[0];
        activeGateway = store?.metadata?.active_payment_gateway || "tara";
      }
    } catch (err) {
      console.warn("Erreur récupération store, fallback sur tara", err);
    }

    if (activeGateway === "tara") {
      // Configuration Tara
      const taraApiKey = process.env.TARA_API_KEY || "nwcpNGDWxWDQpWziZg7g8Tj4";
      const taraBusinessId = process.env.TARA_BUSINESS_ID || "5AuML9WXgI";

      const taraPayload = {
        apiKey: taraApiKey,
        businessId: taraBusinessId,
        productId: cart?.id || "cart-default",
        productName: `Commande HelyaCare — ${cart?.items?.length || 1} article(s)`,
        productPrice: amount,
        productDescription: `Paiement pour ${customer.first_name} ${customer.last_name}`,
        productPictureUrl: `${baseUrl}/logo-white.png`,
        returnUrl: `${baseUrl}/commande/succes?tx_ref=${tx_ref}&amount=${amount}`,
        webHookUrl: `${baseUrl}/api/payment/webhook-tara?tx_ref=${tx_ref}&cart_id=${cart?.id || ""}`,
      };

      const taraRes = await fetch("https://www.dklo.co/api/tara/paymentlinks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taraPayload),
      });

      const taraData = await taraRes.json();

      if (taraData.status === "success" && taraData.generalLink) {
        return NextResponse.json({
          success: true,
          tx_ref,
          paymentUrl: taraData.generalLink,
          gateway: "tara"
        });
      } else {
        throw new Error("Erreur de génération du lien Tara");
      }
    }

    // Paramètres Flutterwave (fallback ou choix explicite)
    const flutterwaveConfig = {
      public_key: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
      tx_ref,
      amount,
      currency,
      payment_options: "card,mobilemoney,ussd,banktransfer",
      redirect_url: `${baseUrl}/commande/succes`,
      customer: {
        email: customer.email,
        phone_number: customer.phone || "",
        name: `${customer.first_name || ""} ${customer.last_name || ""}`.trim(),
      },
      customizations: {
        title: "HelyaCare",
        description: `Commande HelyaCare — ${cart?.items?.length || 1} article(s)`,
        logo: `${baseUrl}/logo-white.png`,
      },
      meta,
    };

    return NextResponse.json({
      success: true,
      tx_ref,
      flutterwaveConfig,
      gateway: "flutterwave"
    });
  } catch (error: any) {
    console.error("[payment/initiate]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
