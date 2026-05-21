import { NextResponse } from "next/server";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const token = session?.medusa_token as string;
    const customerId = session?.customer_id as string;
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";
    const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

    if (!token || !customerId) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const body = await request.json();
    const { placement_preference } = body;

    if (!placement_preference) {
      return NextResponse.json({ error: "Préférence requise" }, { status: 400 });
    }

    const headers = {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(publishableKey && { "x-publishable-api-key": publishableKey }),
    };

    const res = await fetch(`${backendUrl}/store/ambassadors/${customerId}`, {
      method: "POST",
      headers,
      body: JSON.stringify({ placement_preference }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("[api/ambassadeur/placement] Medusa error:", err);
      throw new Error(`Medusa API error: ${res.status}`);
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error("[api/ambassadeur/placement]", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
