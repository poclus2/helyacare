import { NextResponse } from "next/server";

/**
 * GET /api/prices
 * Source de vérité centralisée pour les prix.
 * Récupère les prix depuis le Backend Medusa (prix normaux et d'abonnement).
 */

const STATIC_FALLBACK: Record<string, { normal: number; subscription: number, variant_id?: string }> = {
  "crave-control":      { normal: 20_000, subscription: 17_000 },
  "apple-satiety-shot": { normal: 20_000, subscription: 17_000 },
  "helya-hydrate":      { normal: 20_000, subscription: 17_000 },
  "helya-vigor":        { normal: 20_000, subscription: 17_000 },
  "helya-perform":      { normal: 20_000, subscription: 17_000 },
  "pack-bien-etre":     { normal: 35_000, subscription: 28_000 },
};

export async function GET() {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (backendUrl) {
    try {
      // On demande aussi metadata pour récupérer le subscription_price
      const fields = ["handle", "status", "metadata", "*variants.prices"].join(",");
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
        const prices: Record<string, { normal: number; subscription: number, variant_id?: string }> = {};

        for (const product of data.products || []) {
          if (product.status !== "published") continue;
          const variant = product.variants?.[0];
          if (!variant) continue;
          
          const xofPrice = (variant.prices || []).find((p: any) => p.currency_code === "xof") || variant.prices?.[0];
          const amount = xofPrice ? Math.round(Number(xofPrice.amount) / 100) : 0;
          
          // Le prix d'abonnement est stocké dans les métadonnées (créé depuis le dashboard admin)
          const subPrice = product.metadata?.subscription_price 
            ? Number(product.metadata.subscription_price)
            : Math.round(amount * 0.85); // -15% par défaut si absent

          prices[product.handle] = {
            normal: amount,
            subscription: subPrice,
            variant_id: variant.id
          };
        }

        return NextResponse.json(
          { prices, source: "medusa" },
          { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
      }
    } catch (e) {
      console.error("[api/prices] Erreur fetch Medusa:", e);
    }
  }

  // ── Fallback statique ──────────────────────────────────────────────────
  return NextResponse.json(
    { prices: STATIC_FALLBACK, source: "static_fallback" },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60" } }
  );
}
