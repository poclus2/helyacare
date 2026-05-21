import { NextResponse } from "next/server";

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (!backendUrl) {
    return NextResponse.json({ products: [] });
  }

  try {
    const fields = ["id", "handle", "title", "description", "thumbnail", "status", "metadata", "*variants.prices"].join(",");
    const res = await fetch(
      `${backendUrl}/store/products?fields=${encodeURIComponent(fields)}&limit=50`,
      {
        headers: { ...(publishableKey && { "x-publishable-api-key": publishableKey }) },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 60 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const products = (data.products || [])
        .filter((p: any) => p.status === "published" && p.metadata?.is_ambassador_only !== true)
        .map((p: any) => {
          const variant = p.variants?.[0];
          const xofPrice = (variant?.prices || []).find((price: any) => price.currency_code === "xof") || variant?.prices?.[0];
          const amount = xofPrice ? Number(xofPrice.amount) : 0;
          
          return {
            id: p.id,
            priceKey: p.handle,
            handle: p.handle,
            badge: p.metadata?.badge || null,
            sku: p.metadata?.sku || null,
            title: p.title,
            desc: p.description,
            image: p.thumbnail || "/placeholder.png",
            thumbnail: p.thumbnail || "/placeholder.png",
            cta: "Ajouter au panier",
            href: `/boutique/${p.handle}`,
            saveBadge: p.metadata?.saveBadge || null,
            price_normal: amount,
            price_subscription: p.metadata?.subscription_price ? Number(p.metadata.subscription_price) : Math.round(amount * 0.85),
            variant_id: variant?.id,
            // Champs ambassadeur
            ambassador_price: p.metadata?.ambassador_price ? Number(p.metadata.ambassador_price) : 0,
            ambassador_min_qty: p.metadata?.ambassador_min_qty ? Number(p.metadata.ambassador_min_qty) : 5,
            ambassador_bonus_points: p.metadata?.ambassador_bonus_points ? Number(p.metadata.ambassador_bonus_points) : 0,
            is_ambassador_only: !!p.metadata?.is_ambassador_only,
            status: p.status,
          };
        });

      return NextResponse.json({ products });
    }
    
    return NextResponse.json({ products: [] });
  } catch (e) {
    console.error("[api/products] Erreur fetch Medusa:", e);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}
