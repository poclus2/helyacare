import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { getMedusaAdminToken } from "@/lib/medusa-admin-auth";

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

/** GET /api/admin/produits/[id] */
export async function GET(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await verifyAdmin(request);
    const { id } = await props.params;
    
    const medusaToken = await getMedusaAdminToken();
    const res = await fetch(`${MEDUSA_URL}/admin/products/${id}?fields=*variants.prices,*options`, {
      headers: { "Authorization": `Bearer ${medusaToken}` },
      cache: "no-store",
    });

    if (!res.ok) {
      if (res.status === 404) return NextResponse.json({ error: "Produit introuvable" }, { status: 404 });
      throw new Error(`Medusa API error: ${res.status}`);
    }

    const data = await res.json();
    const p = data.product;

    const price_normal = p.variants?.[0]?.prices?.find((price: any) => price.currency_code === "xof")?.amount || 0;

    const formatted = {
      id: p.id,
      handle: p.handle,
      title: p.title,
      description: p.description,
      thumbnail: p.thumbnail,
      images: p.images?.map((i: any) => i.url) || [],
      status: p.status,
      price_normal,
      price_subscription: p.metadata?.subscription_price || 0,
      ambassador_price: p.metadata?.ambassador_price || 0,
      ambassador_min_qty: p.metadata?.ambassador_min_qty || 5,
      ambassador_bonus_points: p.metadata?.ambassador_bonus_points || 0,
      hero_image: p.metadata?.hero_image || "",
      badge: p.metadata?.badge || "",
      sku_label: p.metadata?.sku_label || "",
      rating: p.metadata?.rating || 4.8,
      reviews_count: p.metadata?.reviews_count || 120,
      benefits: p.metadata?.benefits || [],
      ingredients: p.metadata?.ingredients || [],
      testimonials: p.metadata?.testimonials || [],
      faqs: p.metadata?.faqs || [],
      timeline: p.metadata?.timeline || null,
      cross_sell_handle: p.metadata?.cross_sell_handle || "",
      cross_sell_text: p.metadata?.cross_sell_text || "",
      variants: p.variants || [],
      collection: null,
    };

    return NextResponse.json({ product: formatted });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[GET /api/admin/produits/[id]]", error);
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
    
    // On doit d'abord récupérer le produit actuel pour obtenir ses metadatas existantes et l'ID de sa variante
    const medusaToken = await getMedusaAdminToken();
    const getRes = await fetch(`${MEDUSA_URL}/admin/products/${id}?fields=*variants.prices,*options`, {
      headers: { "Authorization": `Bearer ${medusaToken}` },
    });
    if (!getRes.ok) throw new Error("Produit introuvable pour la mise à jour");
    const existing = await getRes.json();
    const p = existing.product;

    const metadata = {
      ...p.metadata,
      ...(body.price_subscription !== undefined && { subscription_price: body.price_subscription }),
      ...(body.ambassador_price !== undefined && { ambassador_price: body.ambassador_price }),
      ...(body.ambassador_min_qty !== undefined && { ambassador_min_qty: body.ambassador_min_qty }),
      ...(body.ambassador_bonus_points !== undefined && { ambassador_bonus_points: body.ambassador_bonus_points }),
      ...(body.hero_image !== undefined && { hero_image: body.hero_image }),
      ...(body.badge !== undefined && { badge: body.badge }),
      ...(body.sku_label !== undefined && { sku_label: body.sku_label }),
      ...(body.rating !== undefined && { rating: body.rating }),
      ...(body.reviews_count !== undefined && { reviews_count: body.reviews_count }),
      ...(body.benefits !== undefined && { benefits: body.benefits }),
      ...(body.ingredients !== undefined && { ingredients: body.ingredients }),
      ...(body.testimonials !== undefined && { testimonials: body.testimonials }),
      ...(body.faqs !== undefined && { faqs: body.faqs }),
      ...(body.timeline !== undefined && { timeline: body.timeline }),
      ...(body.cross_sell_handle !== undefined && { cross_sell_handle: body.cross_sell_handle }),
      ...(body.cross_sell_text !== undefined && { cross_sell_text: body.cross_sell_text }),
    };

    // Mise à jour partielle des champs de base du produit
    const updatePayload: any = {
      title: body.product?.title !== undefined ? body.product.title : p.title,
      description: body.product?.description !== undefined ? body.product.description : p.description,
      status: body.product?.status !== undefined ? body.product.status : p.status,
      thumbnail: body.product?.thumbnail !== undefined ? body.product.thumbnail : p.thumbnail,
      metadata,
    };

    // Si on met à jour les images
    if (Array.isArray(body.images)) {
      updatePayload.images = body.images.map((url: string) => ({ url }));
    }

    const res = await fetch(`${MEDUSA_URL}/admin/products/${id}`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${medusaToken}` 
      },
      body: JSON.stringify(updatePayload),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Medusa update product error:", err);
      throw new Error("Erreur de mise à jour Medusa");
    }

    // ── Mise à jour du prix si nécessaire ──
    if (body.price !== undefined && p.variants && p.variants.length > 0) {
      const variantId = p.variants[0].id;
      // Note : dans Medusa V2, on met à jour les prix de la variante via le bon endpoint
      const priceUpdatePayload = {
        prices: [
          {
            currency_code: "xof",
            amount: body.price,
          }
        ]
      };
      const varRes = await fetch(`${MEDUSA_URL}/admin/products/${id}/variants/${variantId}`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${medusaToken}` 
        },
        body: JSON.stringify(priceUpdatePayload),
      });
      if (!varRes.ok) console.error("Erreur mise à jour prix variant:", await varRes.text());
    }

    return NextResponse.json({ product: { id, updated: true } });
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
    
    const medusaToken2 = await getMedusaAdminToken();
    const res = await fetch(`${MEDUSA_URL}/admin/products/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${medusaToken2}` },
    });

    if (!res.ok) {
      throw new Error(`Erreur suppression: ${res.status}`);
    }

    return NextResponse.json({ id, deleted: true });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/produits/delete]", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}
