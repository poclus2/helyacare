import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);

const DATA_PATH = join(process.cwd(), "data", "products.json");

function readProducts(): any[] {
  try {
    return JSON.parse(readFileSync(DATA_PATH, "utf-8"));
  } catch {
    return [];
  }
}

function writeProducts(products: any[]) {
  writeFileSync(DATA_PATH, JSON.stringify(products, null, 2), "utf-8");
}

async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find(c => c.trim().startsWith("helyacare_admin_token="))
    ?.split("=")[1];
  if (!token) throw new Error("Non authentifié");
  await jwtVerify(token, SECRET);
}

/** GET /api/admin/produits — liste tous les produits */
export async function GET(request: Request) {
  try {
    await verifyAdmin(request);
    const products = readProducts();
    // Format compatible avec l'UI existante (qui attend product.variants)
    const formatted = products.map(p => ({
      ...p,
      variants: [
        {
          id: `${p.id}-variant-1`,
          title: "Standard",
          prices: [{ currency_code: "xof", amount: p.price_normal * 100 }],
        },
      ],
      collection: null,
    }));
    return NextResponse.json({ products: formatted, count: formatted.length });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

/** POST /api/admin/produits — crée un nouveau produit */
export async function POST(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();
    const products = readProducts();

    const newProduct = {
      id: body.handle || `product-${Date.now()}`,
      handle: body.handle || `product-${Date.now()}`,
      title: body.title || "Nouveau produit",
      sku: body.sku || "",
      description: body.description || "",
      status: body.status || "draft",
      price_normal: body.price_normal || 0,
      price_subscription: body.price_subscription || 0,
      thumbnail: body.thumbnail || null,
      badge: body.badge || null,
    };

    products.push(newProduct);
    writeProducts(products);

    return NextResponse.json({ product: newProduct }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
