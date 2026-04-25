/**
 * HelyaCare — Provider NEXAH SMS (Cameroun)
 * Adapté de MakoPay/providers/nexah-sms.provider.ts
 *
 * NEXAH est le meilleur gateway SMS pour le Cameroun :
 *   - Coût : ~11 XAF/SMS
 *   - Détection automatique opérateur Orange CM / MTN CM
 *   - Sender ID adapté par opérateur
 *
 * Variables d'environnement :
 *   NEXAH_API_URL  (défaut: https://smsvas.com/bulk/public/index.php/api/v1)
 *   NEXAH_USER
 *   NEXAH_PASSWORD
 */

import type { ISmsProvider, SmsResult } from "./provider.interface";
import {
  isCameroonNumber,
  getNexahSenderId,
  normalizePhone,
} from "../utils/phone.util";

const NEXAH_API_URL =
  process.env.NEXAH_API_URL ||
  "https://smsvas.com/bulk/public/index.php/api/v1";

export const nexahSmsProvider: ISmsProvider = {
  name: "NEXAH",

  /** NEXAH gère uniquement les numéros camerounais (+237) */
  supports(phone: string): boolean {
    return isCameroonNumber(phone);
  },

  async sendSms(to: string, message: string): Promise<SmsResult> {
    const username = process.env.NEXAH_USER;
    const password = process.env.NEXAH_PASSWORD;

    if (!username || !password) {
      return {
        success: false,
        error: "NEXAH_USER / NEXAH_PASSWORD manquants dans .env",
        provider: "NEXAH",
      };
    }

    // Normaliser le numéro : 237XXXXXXXXX (sans +)
    const normalized = normalizePhone(to, "CM").replace("+", "");
    const senderId = getNexahSenderId(to);

    console.log(`[SMS/NEXAH] → ${normalized} | SenderID: ${senderId}`);

    try {
      const res = await fetch(`${NEXAH_API_URL}/sendsms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          user: username,
          password,
          senderid: senderId,
          sms: message,
          mobiles: normalized,
        }),
        signal: AbortSignal.timeout(10_000),
      });

      const data = await res.json();

      if (data.responsecode === 1 && data.sms?.length > 0) {
        const smsResult = data.sms[0];

        if (smsResult.status === "success") {
          console.log(`[SMS/NEXAH] ✅ Envoyé — ID: ${smsResult.messageid}`);
          return {
            success: true,
            messageId: smsResult.messageid,
            provider: "NEXAH",
            details: { senderId, clientId: smsResult.smsclientid },
          };
        }

        return {
          success: false,
          error: `${smsResult.errorcode}: ${smsResult.errordescription}`,
          provider: "NEXAH",
        };
      }

      return {
        success: false,
        error: data.responsemessage || "Erreur NEXAH inconnue",
        provider: "NEXAH",
      };
    } catch (err: any) {
      console.error("[SMS/NEXAH] Erreur réseau:", err.message);
      return { success: false, error: err.message, provider: "NEXAH" };
    }
  },
};

/**
 * Récupère le solde de crédits NEXAH restants.
 * Utile pour les alertes de rechargement côté admin.
 */
export async function getNexahBalance(): Promise<{
  credit: number;
  accountExpDate: string;
  balanceExpDate: string;
} | null> {
  const username = process.env.NEXAH_USER;
  const password = process.env.NEXAH_PASSWORD;
  if (!username || !password) return null;

  try {
    const res = await fetch(`${NEXAH_API_URL}/smscredit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: username, password }),
      signal: AbortSignal.timeout(10_000),
    });
    const data = await res.json();
    return {
      credit: data.credit,
      accountExpDate: data.accountexpdate,
      balanceExpDate: data.balanceexpdate,
    };
  } catch {
    return null;
  }
}
