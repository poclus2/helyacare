/**
 * HelyaCare — Template Email : Demande de retrait (Ambassadeur)
 * Envoyé quand un ambassadeur demande un retrait de ses commissions.
 * Adapté de MakoPay/withdrawal-requested.template.ts
 */

import { BaseEmailTemplate } from "./base.template";

export const WithdrawalRequestedTemplate = (
  ambassadorFirstName: string,
  amount: number,
  currency: string = "XOF",
  method: string
): string => {
  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Demande de retrait reçue, ${ambassadorFirstName}
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;">
      Nous avons bien reçu votre demande de retrait. Notre équipe va traiter votre virement sous 48–72h ouvrées.
    </p>

    <div style="background-color:#F6F4F1;border-radius:12px;padding:24px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">Montant demandé</span>
        <span style="font-weight:900;font-size:16px;color:#0F3D3E;">${amount.toLocaleString("fr-FR")} ${currency}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">Méthode</span>
        <span style="font-weight:700;color:#0F3D3E;">${method}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">Statut</span>
        <span style="font-weight:700;color:#f59e0b;">⏳ En traitement</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;">
        <span style="color:#666;">Date de demande</span>
        <span style="font-weight:700;color:#0F3D3E;">${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
    </div>

    <div style="background-color:#FFF7ED;border-left:4px solid #E56B2D;border-radius:0 8px 8px 0;padding:16px 20px;margin-bottom:24px;">
      <p style="margin:0;font-size:14px;color:#92400e;line-height:1.6;">
        <strong>À noter :</strong> des frais de retrait peuvent s'appliquer selon votre méthode de paiement.
        Vous recevrez un email de confirmation une fois le virement effectué.
      </p>
    </div>

    <p style="margin:0;font-size:13px;color:#888;text-align:center;">
      En cas de question, contactez-nous à <a href="mailto:care@helyacare.com" style="color:#0F3D3E;font-weight:600;text-decoration:none;">care@helyacare.com</a>
    </p>
  `;

  return BaseEmailTemplate("Demande de retrait reçue", content);
};
