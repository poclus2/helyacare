import { NextResponse } from "next/server";
import { sendOtp } from "@/lib/sms";

/**
 * POST /api/sms/otp
 * Envoie un code OTP par SMS ou WhatsApp.
 *
 * Body: {
 *   phone: string,           // Numéro du destinataire
 *   code: string,            // Code OTP (généré côté client ou serveur)
 *   channel?: "sms" | "whatsapp"  // Défaut: "sms"
 * }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, code, channel = "sms" } = body;

    if (!phone || !code) {
      return NextResponse.json(
        { error: "phone et code sont requis" },
        { status: 400 }
      );
    }

    if (!["sms", "whatsapp"].includes(channel)) {
      return NextResponse.json(
        { error: 'channel doit être "sms" ou "whatsapp"' },
        { status: 400 }
      );
    }

    const result = await sendOtp(phone, code, channel as "sms" | "whatsapp");

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      provider: (result as any).provider,
      messageId: (result as any).messageId,
    });
  } catch (err: any) {
    console.error("[api/sms/otp]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
