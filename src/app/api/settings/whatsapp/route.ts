import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const API_KEY = process.env.MEDUSA_API_KEY || "";

const adminHeaders = {
  "Content-Type": "application/json",
  ...(API_KEY && { Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}` }),
};

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/admin/stores`, {
      headers: adminHeaders,
      next: { revalidate: 60 }, // Cache pendant 60 secondes
    });
    
    if (!res.ok) {
      return NextResponse.json({ whatsapp_number: "" });
    }
    
    const data = await res.json();
    const store = data.stores?.[0];

    return NextResponse.json({
      whatsapp_number: store?.metadata?.whatsapp_number || "",
    });
  } catch (error) {
    console.error("[public/settings/whatsapp GET]", error);
    return NextResponse.json({ whatsapp_number: "" });
  }
}
