/**
 * HelyaCare — Provider Infobip (SMS global + WhatsApp)
 * Adapté de MakoPay/providers/infobip.provider.ts + infobip-sms.provider.ts
 *
 * Infobip est le fallback universel : il couvre tous les pays.
 * Il gère aussi WhatsApp via l'API Conversations.
 *
 * Variables d'environnement :
 *   INFOBIP_API_KEY
 *   INFOBIP_BASE_URL          (ex: https://xxxxx.api.infobip.com)
 *   INFOBIP_SENDER_ID         (ex: "HelyaCare" ou numéro alphanumerique)
 *   INFOBIP_WHATSAPP_NUMBER   (ex: +33XXXXXXXXX — numéro WhatsApp Business)
 */

import type { ISmsProvider, SmsResult } from "./provider.interface";
import { normalizePhone } from "../utils/phone.util";

// ─── SMS ─────────────────────────────────────────────────────────────────────

export const infobipSmsProvider: ISmsProvider = {
  name: "Infobip",

  /** Infobip supporte tous les numéros (fallback global) */
  supports(): boolean {
    return true;
  },

  async sendSms(to: string, message: string): Promise<SmsResult> {
    const apiKey = process.env.INFOBIP_API_KEY;
    const baseUrl = process.env.INFOBIP_BASE_URL;
    const senderId = process.env.INFOBIP_SENDER_ID || "HelyaCare";

    if (!apiKey || !baseUrl) {
      return {
        success: false,
        error: "INFOBIP_API_KEY / INFOBIP_BASE_URL manquants dans .env",
        provider: "Infobip",
      };
    }

    const phone = normalizePhone(to);
    console.log(`[SMS/Infobip] → ${phone}`);

    try {
      const res = await fetch(`${baseUrl}/sms/2/text/advanced`, {
        method: "POST",
        headers: {
          Authorization: `App ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              from: senderId,
              destinations: [{ to: phone }],
              text: message,
            },
          ],
        }),
        signal: AbortSignal.timeout(10_000),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("[SMS/Infobip] Erreur API:", data);
        return { success: false, error: JSON.stringify(data), provider: "Infobip" };
      }

      const msgId = data.messages?.[0]?.messageId;
      const status = data.messages?.[0]?.status?.name;

      if (status && ["PENDING_ENROUTE", "PENDING_ACCEPTED", "SENT"].includes(status)) {
        console.log(`[SMS/Infobip] ✅ Envoyé — ID: ${msgId}`);
        return { success: true, messageId: msgId, provider: "Infobip" };
      }

      return {
        success: false,
        error: `Status: ${status}`,
        provider: "Infobip",
        details: data.messages?.[0],
      };
    } catch (err: any) {
      console.error("[SMS/Infobip] Erreur réseau:", err.message);
      return { success: false, error: err.message, provider: "Infobip" };
    }
  },
};

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

export interface WhatsAppResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Envoie un message WhatsApp via l'API Infobip.
 * Nécessite un numéro WhatsApp Business approuvé.
 */
export async function sendWhatsApp(
  to: string,
  message: string
): Promise<WhatsAppResult> {
  const apiKey = process.env.INFOBIP_API_KEY;
  const baseUrl = process.env.INFOBIP_BASE_URL;
  const whatsappNumber = process.env.INFOBIP_WHATSAPP_NUMBER;

  if (!apiKey || !baseUrl || !whatsappNumber) {
    console.warn("[WhatsApp] Infobip non configuré — message non envoyé");
    return { success: false, error: "WhatsApp non configuré" };
  }

  const phone = normalizePhone(to);
  console.log(`[WhatsApp/Infobip] → ${phone}`);

  try {
    const res = await fetch(`${baseUrl}/whatsapp/1/message/text`, {
      method: "POST",
      headers: {
        Authorization: `App ${apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        from: whatsappNumber,
        to: phone,
        content: { text: message },
      }),
      signal: AbortSignal.timeout(10_000),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[WhatsApp/Infobip] Erreur:", data);
      return { success: false, error: JSON.stringify(data) };
    }

    console.log(`[WhatsApp/Infobip] ✅ Envoyé — ID: ${data.messageId}`);
    return { success: true, messageId: data.messageId };
  } catch (err: any) {
    console.error("[WhatsApp/Infobip] Erreur réseau:", err.message);
    return { success: false, error: err.message };
  }
}
