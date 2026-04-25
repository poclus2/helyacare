/**
 * HelyaCare — SMS Service (Orchestrateur)
 * Adapté de MakoPay/NotificationsService — logique SMS uniquement.
 *
 * Stratégie de cascade (ordre de priorité) :
 *   1. NEXAH   → Cameroun (+237), ~11 XAF/SMS, très fiable localement
 *   2. Infobip → Tout le reste (global, fallback automatique)
 *
 * En mode dev (aucune clé configurée), les SMS sont simulés (log console).
 */

import { nexahSmsProvider } from "./providers/nexah.provider";
import { infobipSmsProvider, sendWhatsApp } from "./providers/infobip.provider";
import type { ISmsProvider, SmsResult } from "./providers/provider.interface";
import { normalizePhone } from "./utils/phone.util";
import {
  OtpSmsTemplate,
  OrderConfirmedSmsTemplate,
  ShippingSmsTemplate,
  CommissionSmsTemplate,
  WelcomeSmsTemplate,
  SubscriptionRenewalSmsTemplate,
} from "./templates/sms.templates";

/** Ordre de priorité : NEXAH (Cameroun) → Infobip (Global) */
const SMS_PROVIDERS: ISmsProvider[] = [nexahSmsProvider, infobipSmsProvider];

// ─── Couche de base ───────────────────────────────────────────────────────────

/**
 * Envoie un SMS en cascade : essaie chaque provider dans l'ordre
 * jusqu'au premier succès.
 *
 * @param to       Numéro au format international recommandé (+221XXXXXXXXX)
 * @param message  Texte du message (max 160 chars pour 1 SMS)
 * @param isOtp    Indique si c'est un OTP (peut influencer le routage)
 */
export async function sendSms(
  to: string,
  message: string,
  isOtp: boolean = false
): Promise<SmsResult> {
  // Mode dev : aucune clé configurée
  const anyKeyConfigured =
    (process.env.NEXAH_USER && process.env.NEXAH_PASSWORD) ||
    (process.env.INFOBIP_API_KEY && process.env.INFOBIP_BASE_URL);

  if (!anyKeyConfigured) {
    console.log(`[SMS - DEV] Simulating SMS to ${to}: "${message}"`);
    return { success: true, messageId: "dev-mode", provider: "DEV" };
  }

  const phone = normalizePhone(to);

  for (const provider of SMS_PROVIDERS) {
    if (!provider.supports(phone, isOtp)) {
      console.log(`[SMS] ${provider.name} ne supporte pas ${phone} — skip`);
      continue;
    }

    console.log(`[SMS] Tentative via ${provider.name} → ${phone}`);
    const result = await provider.sendSms(phone, message, isOtp);

    if (result.success) {
      return result;
    }

    console.warn(`[SMS] ${provider.name} échoué: ${result.error} — essai suivant...`);
  }

  console.error(`[SMS] Tous les providers ont échoué pour ${phone}`);
  return {
    success: false,
    error: "Tous les providers SMS ont échoué",
    provider: "NONE",
  };
}

// ─── Méthodes métier ──────────────────────────────────────────────────────────

/** Envoi d'un OTP (SMS ou WhatsApp) */
export async function sendOtp(
  to: string,
  code: string,
  channel: "sms" | "whatsapp" = "sms"
): Promise<SmsResult | { success: boolean; error?: string }> {
  const message = OtpSmsTemplate(code);

  if (channel === "whatsapp") {
    return sendWhatsApp(to, message);
  }
  return sendSms(to, message, true);
}

/** SMS de bienvenue après inscription */
export async function sendWelcomeSms(
  to: string,
  firstName: string
): Promise<SmsResult> {
  return sendSms(to, WelcomeSmsTemplate(firstName));
}

/** SMS de confirmation commande (déclenché post-paiement) */
export async function sendOrderConfirmationSms(
  to: string,
  firstName: string,
  orderRef: string,
  amount: number,
  currency: string = "XOF"
): Promise<SmsResult> {
  return sendSms(to, OrderConfirmedSmsTemplate(firstName, orderRef, amount, currency));
}

/** SMS d'expédition avec lien de suivi optionnel */
export async function sendShippingSms(
  to: string,
  firstName: string,
  orderRef: string,
  trackingUrl?: string
): Promise<SmsResult> {
  return sendSms(to, ShippingSmsTemplate(firstName, orderRef, trackingUrl));
}

/** SMS notification commission ambassadeur */
export async function sendCommissionSms(
  to: string,
  firstName: string,
  amount: number,
  currency: string = "XOF"
): Promise<SmsResult> {
  return sendSms(to, CommissionSmsTemplate(firstName, amount, currency));
}

/** SMS rappel renouvellement abonnement */
export async function sendRenewalReminderSms(
  to: string,
  firstName: string,
  daysLeft: number
): Promise<SmsResult> {
  return sendSms(to, SubscriptionRenewalSmsTemplate(firstName, daysLeft));
}

/** WhatsApp direct (coaching, support) */
export { sendWhatsApp };
