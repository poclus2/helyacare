/**
 * HelyaCare — SMS System — Point d'entrée
 *
 * Utilisation :
 *   import { sendOrderConfirmationSms, sendOtp } from "@/lib/sms";
 */

export {
  sendSms,
  sendOtp,
  sendWelcomeSms,
  sendOrderConfirmationSms,
  sendShippingSms,
  sendCommissionSms,
  sendRenewalReminderSms,
  sendWhatsApp,
} from "./sms.service";

export { normalizePhone, isCameroonNumber, isAfricanNumber } from "./utils/phone.util";
export type { SmsResult, ISmsProvider } from "./providers/provider.interface";
