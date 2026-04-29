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
  // Medusa v2 : les clés API s'authentifient en Basic (clé = username, mot de passe vide)
  ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
};

export async function GET(request: Request) {
  try {
    await verifyAdmin(request);

    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const targetUrl = `${BACKEND}/admin/orders${searchParams ? `?${searchParams}` : ""}`;

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
    console.error("[admin/commandes]", error);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}
