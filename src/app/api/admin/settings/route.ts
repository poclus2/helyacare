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

    const res = await fetch(`${BACKEND}/admin/stores`, { headers: adminHeaders });
    if (!res.ok) throw new Error("Erreur Medusa");
    const data = await res.json();
    const store = data.stores?.[0];

    return NextResponse.json({
      whatsapp_number: store?.metadata?.whatsapp_number || "",
    });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/settings GET]", error);
    return NextResponse.json({ whatsapp_number: "" });
  }
}

export async function POST(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();
    const { whatsapp_number } = body;

    // 1. Récupérer le store actuel
    const getRes = await fetch(`${BACKEND}/admin/stores`, { headers: adminHeaders });
    if (!getRes.ok) throw new Error("Erreur lors de la récupération du store");
    const getData = await getRes.json();
    const store = getData.stores?.[0];

    if (!store) {
      throw new Error("Aucun store trouvé");
    }

    // 2. Mettre à jour le store
    const updateRes = await fetch(`${BACKEND}/admin/stores/${store.id}`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        metadata: {
          ...store.metadata,
          whatsapp_number,
        },
      }),
    });

    if (!updateRes.ok) {
      throw new Error("Erreur lors de la mise à jour du store");
    }

    return NextResponse.json({ success: true, whatsapp_number });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/settings POST]", error);
    return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
  }
}
