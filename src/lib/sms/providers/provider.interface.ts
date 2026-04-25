/**
 * HelyaCare — Interface commune pour les providers SMS
 * Copié de MakoPay/interfaces/sms-provider.interface.ts
 */

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: string;
  details?: Record<string, unknown>;
}

export interface ISmsProvider {
  /** Identifiant lisible du provider (ex: "NEXAH", "Infobip") */
  readonly name: string;

  /**
   * Vérifie si ce provider peut gérer ce numéro.
   * Permet la cascade : NEXAH ne répond que pour le Cameroun,
   * Infobip répond pour tout le monde.
   */
  supports(phone: string, isOtp?: boolean): boolean;

  /** Envoie le SMS */
  sendSms(to: string, message: string, isOtp?: boolean): Promise<SmsResult>;
}
