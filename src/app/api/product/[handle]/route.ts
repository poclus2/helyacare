import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "products.json");

/**
 * GET /api/product/[handle]
 * Route publique (sans auth) — retourne les données complètes d'un produit
 * pour les pages PDP (Product Detail Pages).
 */
export async function GET(
  _request: Request,
  props: { params: Promise<{ handle: string }> }
) {
  try {
    const { handle } = await props.params;
    const raw = readFileSync(DATA_PATH, "utf-8");
    const products: any[] = JSON.parse(raw);
    const product = products.find(p => p.handle === handle || p.id === handle);

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json(
      { product },
      {
        headers: {
          // Cache court pour refléter rapidement les mises à jour admin
          "Cache-Control": "public, s-maxage=10, stale-while-revalidate=60",
        },
      }
    );
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
