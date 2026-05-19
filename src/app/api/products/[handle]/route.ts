import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { handle: string } }
) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (!backendUrl) {
    return NextResponse.json({ product: null }, { status: 500 });
  }

  try {
    const fields = ["id", "handle", "title", "description", "thumbnail", "status", "metadata", "*variants.prices"].join(",");
    const res = await fetch(
      `${backendUrl}/store/products?handle=${params.handle}&fields=${encodeURIComponent(fields)}`,
      {
        headers: { ...(publishableKey && { "x-publishable-api-key": publishableKey }) },
        signal: AbortSignal.timeout(4000),
        next: { revalidate: 60 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const p = data.products?.[0];
      
      if (!p) {
        return NextResponse.json({ product: null }, { status: 404 });
      }

      const variant = p.variants?.[0];
      const xofPrice = (variant?.prices || []).find((price: any) => price.currency_code === "xof") || variant?.prices?.[0];
      const amount = xofPrice ? Number(xofPrice.amount) : 0;
      
      const product = {
        id: p.id,
        priceKey: p.handle,
        badge: p.metadata?.badge || null,
        sku: p.metadata?.sku_label || p.metadata?.sku || null,
        title: p.title,
        desc: p.description,
        image: p.thumbnail || "/placeholder.png",
        cta: "Ajouter au panier",
        href: `/boutique/${p.handle}`,
        saveBadge: p.metadata?.saveBadge || null,
        price_normal: amount,
        price_subscription: p.metadata?.subscription_price ? Number(p.metadata.subscription_price) : Math.round(amount * 0.85),
        variant_id: variant?.id,
        
        // Champs Marketing Dynamiques extraits du metadata
        rating: p.metadata?.rating || 4.8,
        reviews_count: p.metadata?.reviews_count || 0,
        benefits: p.metadata?.benefits || [], // Array of strings
        ingredients: p.metadata?.ingredients || [], // Array of { title, description, icon }
        testimonials: p.metadata?.testimonials || [], // Array of { name, quote, image }
        faqs: p.metadata?.faqs || [], // Array of { q, a }
        cross_sell_handle: p.metadata?.cross_sell_handle || null,
        cross_sell_text: p.metadata?.cross_sell_text || "Ajoutez ce produit à votre routine",
      };

      return NextResponse.json({ product });
    }
    
    return NextResponse.json({ product: null }, { status: res.status });
  } catch (e) {
    console.error("[api/products/[handle]] Erreur fetch Medusa:", e);
    return NextResponse.json({ product: null }, { status: 500 });
  }
}
