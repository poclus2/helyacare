/**
 * HelyaCare — NotificationService
 * Service central pour tous les emails transactionnels.
 * Inspiré de MakoPay/NotificationsService.
 *
 * Utilisable dans les API Routes (server-side uniquement).
 */

import { sendEmail } from "./resend";
import { WelcomeTemplate } from "./templates/welcome.template";
import { OrderConfirmedTemplate } from "./templates/order-confirmed.template";
import { NewReferralTemplate } from "./templates/new-referral.template";
import { CommissionReceivedTemplate } from "./templates/commission-received.template";
import { WithdrawalRequestedTemplate } from "./templates/withdrawal-requested.template";

export interface OrderItem {
  title: string;
  subtitle?: string;
  quantity: number;
  unit_price: number;
}

// ─── 1. Email de bienvenue ────────────────────────────────────────────────────

export async function sendWelcomeEmail(to: string, firstName: string) {
  return sendEmail({
    to,
    subject: "🌿 Bienvenue dans votre Laboratoire Vivant — HelyaCare",
    html: WelcomeTemplate(firstName),
  });
}

// ─── 2. Confirmation commande ─────────────────────────────────────────────────

export async function sendOrderConfirmationEmail(
  to: string,
  firstName: string,
  orderRef: string,
  amount: number,
  currency: string = "XOF",
  items: OrderItem[] = []
) {
  return sendEmail({
    to,
    subject: `✅ Commande confirmée — Réf. ${orderRef} | HelyaCare`,
    html: OrderConfirmedTemplate(firstName, orderRef, amount, currency, items),
  });
}

// ─── 3. Nouveau filleul (notification au parrain) ────────────────────────────

export async function sendNewReferralEmail(
  sponsorEmail: string,
  sponsorFirstName: string,
  referralFullName: string,
  referralCode: string
) {
  return sendEmail({
    to: sponsorEmail,
    subject: `🎉 ${referralFullName} a rejoint votre réseau HelyaCare !`,
    html: NewReferralTemplate(sponsorFirstName, referralFullName, referralCode),
  });
}

// ─── 4. Commission reçue (notification à l'ambassadeur) ──────────────────────

export async function sendCommissionEmail(
  ambassadorEmail: string,
  ambassadorFirstName: string,
  amount: number,
  currency: string = "XOF",
  level: number,
  referralName: string
) {
  return sendEmail({
    to: ambassadorEmail,
    subject: `💰 Nouvelle commission de ${amount.toLocaleString("fr-FR")} ${currency} — HelyaCare`,
    html: CommissionReceivedTemplate(ambassadorFirstName, amount, currency, level, referralName),
  });
}

// ─── 5. Demande de retrait reçue ─────────────────────────────────────────────

export async function sendWithdrawalRequestEmail(
  ambassadorEmail: string,
  ambassadorFirstName: string,
  amount: number,
  currency: string = "XOF",
  method: string
) {
  return sendEmail({
    to: ambassadorEmail,
    subject: `⏳ Demande de retrait en cours de traitement — HelyaCare`,
    html: WithdrawalRequestedTemplate(ambassadorFirstName, amount, currency, method),
  });
}
