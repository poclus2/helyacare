import { NextResponse } from "next/server";
import { getMedusaAdminToken } from "@/lib/medusa-admin-auth";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const medusaToken = await getMedusaAdminToken();
    const adminHeaders = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${medusaToken}`,
    };

    const res = await fetch(`${BACKEND}/admin/stores`, {
      headers: adminHeaders,
      cache: 'no-store',
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
