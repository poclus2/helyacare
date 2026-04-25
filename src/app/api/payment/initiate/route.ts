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

    // Métadonnées à transmettre à Flutterwave (récupérées dans le webhook)
    const meta = {
      customer_id: session?.customer_id || null,
      cart_id: cart?.id || null,
      cart_items: JSON.stringify(cart?.items?.map((item: any) => ({
        variant_id: item.variant_id,
        title: item.title,
        quantity: item.quantity,
        unit_price: item.unit_price,
      })) || []),
      address: JSON.stringify(address || {}),
    };

    // Paramètres Flutterwave inline — retournés au client
    // Le client les utilise directement dans FlutterwaveCheckout()
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
    });
  } catch (error: any) {
    console.error("[payment/initiate]", error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}
