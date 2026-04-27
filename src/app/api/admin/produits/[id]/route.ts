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

function toApiFormat(p: any) {
  return {
    ...p,
    variants: [
      {
        id: `${p.id}-variant-1`,
        title: "Standard",
        prices: [{ currency_code: "xof", amount: (p.price_normal || 0) * 100 }],
      },
    ],
    collection: null,
  };
}

/** GET /api/admin/produits/[id] */
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin(request);
    const { id } = await props.params;
    const products = readProducts();
    const product = products.find(p => p.id === id || p.handle === id);

    if (!product) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    return NextResponse.json({ product: toApiFormat(product) });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

/** POST /api/admin/produits/[id] — met à jour un produit */
export async function POST(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin(request);
    const { id } = await props.params;
    const body = await request.json();
    const products = readProducts();
    const idx = products.findIndex(p => p.id === id || p.handle === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    // Mise à jour partielle
    const updated = {
      ...products[idx],
      ...(body.product?.title !== undefined && { title: body.product.title }),
      ...(body.product?.description !== undefined && { description: body.product.description }),
      ...(body.product?.status !== undefined && { status: body.product.status }),
      ...(body.product?.thumbnail !== undefined && { thumbnail: body.product.thumbnail }),
      // Prix
      ...(body.price !== undefined && body.price > 0 && { price_normal: body.price }),
      ...(body.price_subscription !== undefined && { price_subscription: body.price_subscription }),
      // Images
      ...(Array.isArray(body.images) && { images: body.images }),
    };

    products[idx] = updated;
    writeProducts(products);

    return NextResponse.json({ product: toApiFormat(updated) });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/produits/update]", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}

/** DELETE /api/admin/produits/[id] */
export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin(request);
    const { id } = await props.params;
    const products = readProducts();
    const idx = products.findIndex(p => p.id === id || p.handle === id);

    if (idx === -1) {
      return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
    }

    const deleted = products[idx];
    products.splice(idx, 1);
    writeProducts(products);

    return NextResponse.json({ id: deleted.id, deleted: true });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
