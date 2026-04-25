import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);
const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const API_KEY = process.env.MEDUSA_API_KEY || "";

async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find(c => c.trim().startsWith("helyacare_admin_token="))
    ?.split("=")[1];
  if (!token) throw new Error("Non authentifié");
  await jwtVerify(token, SECRET);
}

const adminHeaders = {
  "Content-Type": "application/json",
  ...(API_KEY && { Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}` }),
};

export async function GET(request: Request) {
  try {
    await verifyAdmin(request);

    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const targetUrl = `${BACKEND}/admin/products${searchParams ? `?${searchParams}` : ""}`;

    const res = await fetch(targetUrl, { headers: adminHeaders });

    if (!res.ok) {
      throw new Error(`Erreur Medusa: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/produits]", error);
    return NextResponse.json({ products: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();

    const res = await fetch(`${BACKEND}/admin/products`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      console.error("[admin/produits/POST] Erreur:", errData);
      throw new Error(`Erreur Medusa: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);

  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/produits/POST]", error);
    return NextResponse.json({ error: "Erreur lors de la création du produit" }, { status: 500 });
  }
}
