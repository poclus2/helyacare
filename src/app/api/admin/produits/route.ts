import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);

async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find(c => c.trim().startsWith("helyacare_admin_token="))
    ?.split("=")[1];
  if (!token) throw new Error("Non authentifié");
  await jwtVerify(token, SECRET);
}

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const MEDUSA_API_KEY = process.env.MEDUSA_API_KEY || "";

/** GET /api/admin/produits — liste tous les produits depuis Medusa */
export async function GET(request: Request) {
  try {
    await verifyAdmin(request);

    const res = await fetch(`${MEDUSA_URL}/admin/products?fields=*variants.prices,*options`, {
      headers: { "Authorization": `Bearer ${MEDUSA_API_KEY}` },
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error(`Medusa API error: ${res.status}`);
    }

    const data = await res.json();
    
    // On mappe les produits Medusa pour l'UI existante du dashboard
    const formatted = data.products.map((p: any) => {
      const price_normal = p.variants?.[0]?.prices?.find((price: any) => price.currency_code === "xof")?.amount / 100 || 0;
      
      return {
        id: p.id,
        handle: p.handle,
        title: p.title,
        description: p.description,
        thumbnail: p.thumbnail,
        status: p.status,
        price_normal,
        price_subscription: p.metadata?.subscription_price || 0,
        ambassador_price: p.metadata?.ambassador_price || 0,
        ambassador_min_qty: p.metadata?.ambassador_min_qty || 5,
        variants: p.variants || [],
        collection: null,
      };
    });

    return NextResponse.json({ products: formatted, count: data.count });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[GET /api/admin/produits]", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

/** POST /api/admin/produits — crée un nouveau produit dans Medusa */
export async function POST(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();

    const newProductPayload = {
      title: body.title || "Nouveau produit",
      handle: body.handle || undefined,
      description: body.description || "",
      status: body.status || "draft",
      thumbnail: body.thumbnail || null,
      options: [{ title: "Format", values: ["Standard"] }],
      variants: [
        {
          title: "Standard",
          manage_inventory: false,
          prices: [
            {
              currency_code: "xof",
              amount: (body.price_normal || 0) * 100,
            }
          ],
          options: { Format: "Standard" }
        }
      ],
      metadata: {
        subscription_price: body.price_subscription || 0,
        ambassador_price: body.ambassador_price || 0,
        ambassador_min_qty: body.ambassador_min_qty || 5,
        is_ambassador_only: false,
        is_pack: false,
        pack_contents: []
      }
    };

    const res = await fetch(`${MEDUSA_URL}/admin/products`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${MEDUSA_API_KEY}` 
      },
      body: JSON.stringify(newProductPayload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Erreur création produit Medusa:", err);
      throw new Error("Failed to create product in Medusa");
    }

    const data = await res.json();

    return NextResponse.json({ product: data.product }, { status: 201 });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[POST /api/admin/produits]", error);
    return NextResponse.json({ error: "Erreur lors de la création" }, { status: 500 });
  }
}
