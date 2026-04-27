import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

/**
 * GET /api/prices
 * Source de vérité centralisée pour les prix.
 *
 * Priorité :
 * 1. data/products.json (catalogue local — éditable via admin panel)
 * 2. Medusa Backend (si configuré et accessible)
 * 3. Fallback statique hardcodé
 */

const STATIC_FALLBACK: Record<string, { normal: number; subscription: number }> = {
  "crave-control":      { normal: 20_000, subscription: 17_000 },
  "apple-satiety-shot": { normal: 20_000, subscription: 17_000 },
  "helya-hydrate":      { normal: 20_000, subscription: 17_000 },
  "helya-vigor":        { normal: 20_000, subscription: 17_000 },
  "helya-perform":      { normal: 20_000, subscription: 17_000 },
  "pack-bien-etre":     { normal: 35_000, subscription: 28_000 },
};

function readLocalProducts() {
  try {
    const path = join(process.cwd(), "data", "products.json");
    const raw = readFileSync(path, "utf-8");
    return JSON.parse(raw) as Array<{
      id: string;
      handle: string;
      status: string;
      price_normal: number;
      price_subscription: number;
    }>;
  } catch {
    return null;
  }
}

export async function GET() {
  // ── 1. Source prioritaire : data/products.json (admin local) ─────────────
  const localProducts = readLocalProducts();

  if (localProducts) {
    const prices: Record<string, { normal: number; subscription: number }> = {};
    for (const p of localProducts) {
      if (p.status === "published" || true) { // Inclure tous pour que /api/prices serve aussi les drafts en admin
        prices[p.handle || p.id] = {
          normal: p.price_normal || 0,
          subscription: p.price_subscription || p.price_normal || 0,
        };
      }
    }

    return NextResponse.json(
      { prices, source: "local" },
      {
        headers: {
          // Pas de cache agressif — les prix admin doivent se refleter rapidement
          "Cache-Control": "public, s-maxage=5, stale-while-revalidate=30",
        },
      }
    );
  }

  // ── 2. Fallback Medusa (si local JSON absent) ─────────────────────────────
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (backendUrl && !backendUrl.includes("localhost")) {
    try {
      const fields = ["handle", "status", "*variants.prices"].join(",");
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
        const prices: Record<string, { normal: number; subscription: number }> = {};

        for (const product of data.products || []) {
          if (product.status !== "published") continue;
          const variant = product.variants?.[0];
          if (!variant) continue;
          const xofPrice = (variant.prices || []).find((p: any) => p.currency_code === "xof") || variant.prices?.[0];
          const amount = xofPrice ? Math.round(Number(xofPrice.amount) / 100) : 0;
          prices[product.handle] = {
            normal: amount,
            subscription: Math.round(amount * 0.85), // -15% par défaut si pas de variante abo
          };
        }

        return NextResponse.json(
          { prices, source: "medusa" },
          { headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" } }
        );
      }
    } catch {
      // Fallback statique si Medusa inaccessible
    }
  }

  // ── 3. Fallback statique ──────────────────────────────────────────────────
  return NextResponse.json(
    { prices: STATIC_FALLBACK, source: "static_fallback" },
    { headers: { "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60" } }
  );
}
