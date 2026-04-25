/**
 * HelyaCare — Email System — Point d'entrée
 *
 * Utilisation :
 *   import { sendWelcomeEmail, sendOrderConfirmationEmail } from "@/lib/email";
 */

export { sendEmail } from "./resend";
export {
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendNewReferralEmail,
  sendCommissionEmail,
  sendWithdrawalRequestEmail,
} from "./notifications";

export type { OrderItem } from "./notifications";
