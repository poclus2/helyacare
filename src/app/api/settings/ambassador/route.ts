import { NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const API_KEY = process.env.MEDUSA_API_KEY || "";

const adminHeaders = {
  "Content-Type": "application/json",
  ...(API_KEY && { Authorization: `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}` }),
};

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const res = await fetch(`${BACKEND}/admin/stores`, {
      headers: adminHeaders,
      cache: 'no-store',
    });
    
    if (!res.ok) {
      return NextResponse.json({ ambassador_settings: { min_qty: 5, prices: {} } });
    }
    
    const data = await res.json();
    const store = data.stores?.[0];

    return NextResponse.json({
      ambassador_settings: store?.metadata?.ambassador_settings || { min_qty: 5, prices: {} },
    });
  } catch (error) {
    console.error("[public/settings/ambassador GET]", error);
    return NextResponse.json({ ambassador_settings: { min_qty: 5, prices: {} } });
  }
}
