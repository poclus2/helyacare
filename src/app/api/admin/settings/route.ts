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
      ambassador_settings: store?.metadata?.ambassador_settings || { min_qty: 5, prices: {} },
      active_payment_gateway: store?.metadata?.active_payment_gateway || "tara", // tara is default now
      binary_bonus_settings: store?.metadata?.binary_bonus_settings || {
        percentage: 10,
        bv_to_xof_rate: 1,
        auto_execution: false,
        execution_interval: "monthly",
      },
    });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/settings GET]", error);
    return NextResponse.json({ 
      whatsapp_number: "", 
      ambassador_settings: { min_qty: 5, prices: {} },
      binary_bonus_settings: { percentage: 10, bv_to_xof_rate: 1, auto_execution: false, execution_interval: "monthly" }
    });
  }
}

export async function POST(request: Request) {
  try {
    await verifyAdmin(request);
    const body = await request.json();
    const { whatsapp_number, ambassador_settings, binary_bonus_settings } = body;

    // 1. Récupérer le store actuel
    const getRes = await fetch(`${BACKEND}/admin/stores`, { headers: adminHeaders });
    if (!getRes.ok) throw new Error("Erreur lors de la récupération du store");
    const getData = await getRes.json();
    const store = getData.stores?.[0];

    if (!store) {
      throw new Error("Aucun store trouvé");
    }

    // Préparer les metadata à mettre à jour
    const updatedMetadata = { ...store.metadata };
    if (whatsapp_number !== undefined) updatedMetadata.whatsapp_number = whatsapp_number;
    if (ambassador_settings !== undefined) updatedMetadata.ambassador_settings = ambassador_settings;
    if (binary_bonus_settings !== undefined) updatedMetadata.binary_bonus_settings = binary_bonus_settings;
    if (body.active_payment_gateway !== undefined) updatedMetadata.active_payment_gateway = body.active_payment_gateway;

    // 2. Mettre à jour le store
    const updateRes = await fetch(`${BACKEND}/admin/stores/${store.id}`, {
      method: "POST",
      headers: adminHeaders,
      body: JSON.stringify({
        metadata: updatedMetadata,
      }),
    });

    if (!updateRes.ok) {
      throw new Error("Erreur lors de la mise à jour du store");
    }

    return NextResponse.json({ 
      success: true, 
      whatsapp_number, 
      ambassador_settings, 
      binary_bonus_settings,
      active_payment_gateway: updatedMetadata.active_payment_gateway 
    });
  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/settings POST]", error);
    return NextResponse.json({ error: error.message || "Erreur interne" }, { status: 500 });
  }
}
