import { NextResponse } from "next/server";
import { readFileSync } from "fs";
import { join } from "path";

const DATA_PATH = join(process.cwd(), "data", "products.json");

function readProducts(): any[] {
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return [];
  }
}

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = readProducts();

    // Build a per-product ambassador config keyed by handle
    const perProduct: Record<string, { price: number; min_qty: number }> = {};
    for (const p of products) {
      if (p.handle) {
        perProduct[p.handle] = {
          price: p.ambassador_price || 0,
          min_qty: p.ambassador_min_qty || 5,
        };
      }
    }

    return NextResponse.json({ ambassador_products: perProduct });
  } catch (error) {
    console.error("[public/settings/ambassador GET]", error);
    return NextResponse.json({ ambassador_products: {} });
  }
}
