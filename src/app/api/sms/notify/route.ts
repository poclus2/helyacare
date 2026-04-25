import { NextResponse } from "next/server";
import { sendSms, sendWhatsApp } from "@/lib/sms";

/**
 * POST /api/sms/notify
 * Endpoint générique pour envoyer un SMS ou WhatsApp depuis le backend Medusa
 * (subscribers, workflows) ou l'admin panel.
 *
 * Body: {
 *   phone: string,
 *   message: string,
 *   channel?: "sms" | "whatsapp"   // Défaut: "sms"
 * }
 *
 * Sécurité : vérifier MEDUSA_API_KEY dans le header Authorization
 * pour les appels internes depuis le backend Medusa.
 */
export async function POST(request: Request) {
  try {
    // Optionnel : protection par clé API pour les appels machine-to-machine
    const authHeader = request.headers.get("authorization");
    const internalKey = process.env.MEDUSA_API_KEY;
    if (internalKey && authHeader !== `Bearer ${internalKey}`) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await request.json();
    const { phone, message, channel = "sms" } = body;

    if (!phone || !message) {
      return NextResponse.json(
        { error: "phone et message sont requis" },
        { status: 400 }
      );
    }

    let result;
    if (channel === "whatsapp") {
      result = await sendWhatsApp(phone, message);
    } else {
      result = await sendSms(phone, message);
    }

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
    console.error("[api/sms/notify]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
