/**
 * HelyaCare — Template Email : Dépôt confirmé
 * Envoyé au client quand l'admin approuve sa demande de dépôt manuel.
 * Adapté de MakoPay/deposit-received.template.ts
 */

import { BaseEmailTemplate, CtaButton } from "./base.template";

const METHOD_LABELS: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  mtn_momo: "MTN MoMo",
  bank: "Virement Bancaire",
  other: "Autre",
};

export const DepositReceivedTemplate = (
  firstName: string,
  amount: number,
  currency: string = "XOF",
  method: string
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";
  const methodLabel = METHOD_LABELS[method] || method;

  const content = `
    <!-- Badge confirmé -->
    <div style="background-color:#CBF27A;border-radius:12px;padding:14px 24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:13px;font-weight:800;color:#0F3D3E;letter-spacing:0.3px;">
        ✓ Votre dépôt a bien été reçu et validé
      </p>
    </div>

    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Dépôt confirmé, ${firstName} ! 💳
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;">
      Bonne nouvelle ! Votre dépôt a été validé par notre équipe et votre portefeuille a été crédité.
    </p>

    <!-- Détails du dépôt -->
    <div style="background-color:#F6F4F1;border-radius:12px;padding:24px;margin-bottom:28px;">
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">Montant crédité</span>
        <span style="font-weight:900;font-size:20px;color:#0F3D3E;">+${amount.toLocaleString("fr-FR")} ${currency}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">Méthode</span>
        <span style="font-weight:700;color:#0F3D3E;">${methodLabel}</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:8px 0;font-size:14px;">
        <span style="color:#666;">Date</span>
        <span style="font-weight:700;color:#0F3D3E;">${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</span>
      </div>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
      Les fonds sont immédiatement disponibles dans votre portefeuille. Vous pouvez les utiliser
      pour passer une commande ou accumuler vos commissions ambassadeur.
    </p>

    <div style="text-align:center;">
      ${CtaButton(`${baseUrl}/espace-client`, "Accéder à mon espace")}
    </div>
  `;

  return BaseEmailTemplate("Dépôt confirmé", content);
};
