/**
 * HelyaCare — Templates SMS
 * Courts, percutants, sans mise en forme (SMS = texte brut).
 * Max 160 caractères pour rester dans 1 seul SMS.
 */

const BRAND = "HelyaCare";

/** OTP / Code de vérification */
export const OtpSmsTemplate = (code: string): string =>
  `${BRAND} : Votre code de vérification est ${code}. Ne le partagez pas. Valable 10 min.`;

/** Confirmation de commande (après paiement Flutterwave) */
export const OrderConfirmedSmsTemplate = (
  firstName: string,
  orderRef: string,
  amount: number,
  currency: string = "XOF"
): string =>
  `${BRAND} ✅ Merci ${firstName} ! Commande ${orderRef} confirmée — ${amount.toLocaleString("fr-FR")} ${currency}. Expédition sous 24h. Suivi sur : helyacare.com/espace-client`;

/** Notification d'expédition */
export const ShippingSmsTemplate = (
  firstName: string,
  orderRef: string,
  trackingUrl?: string
): string => {
  const base = `${BRAND} 🚚 ${firstName}, votre commande ${orderRef} est expédiée !`;
  return trackingUrl
    ? `${base} Suivi : ${trackingUrl}`
    : `${base} Vous recevrez un lien de suivi sous peu.`;
};

/** Nouvelle commission créditée (ambassadeur) */
export const CommissionSmsTemplate = (
  firstName: string,
  amount: number,
  currency: string = "XOF"
): string =>
  `${BRAND} 💰 ${firstName}, ${amount.toLocaleString("fr-FR")} ${currency} de commission vient d'être créditée sur votre portefeuille ambassadeur !`;

/** Bienvenue après inscription */
export const WelcomeSmsTemplate = (firstName: string): string =>
  `${BRAND} 🌿 Bienvenue ${firstName} ! Votre compte est actif. Découvrez notre boutique : helyacare.com/boutique`;

/** Rappel de renouvellement d'abonnement */
export const SubscriptionRenewalSmsTemplate = (
  firstName: string,
  daysLeft: number
): string =>
  `${BRAND} ⏰ ${firstName}, votre cure expire dans ${daysLeft} jour${daysLeft > 1 ? "s" : ""}. Renouvelez sur : helyacare.com/boutique`;
