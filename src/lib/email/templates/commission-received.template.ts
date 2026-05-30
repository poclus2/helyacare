/**
 * HelyaCare — Template Email : Commission reçue (MLM)
 * Envoyé à l'ambassadeur quand une commission est créditée sur son portefeuille.
 * Adapté de MakoPay/payout-received.template.ts
 */

import { BaseEmailTemplate, CtaButton } from "./base.template";

export const CommissionReceivedTemplate = (
  ambassadorFirstName: string,
  amount: number,
  currency: string = "XOF",
  level: number,
  referralName: string
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";

  const levelLabels: Record<number, string> = {
    1: "filleul direct (niveau 1)",
    2: "sous-filleul (niveau 2)",
    3: "réseau niveau 3",
  };

  const content = `
    <!-- Commission Badge -->
    <div style="background-color:#CBF27A;border-radius:12px;padding:16px 24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:13px;font-weight:800;color:#0F3D3E;letter-spacing:0.5px;">
        💰 Nouvelle commission créditée sur votre portefeuille
      </p>
    </div>

    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Félicitations, ${ambassadorFirstName} !
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;">
      Votre réseau travaille pour vous. Une commission vient d'être créditée suite à une commande de votre ${levelLabels[level] || `réseau niveau ${level}`}.
    </p>

    <!-- Détails commission -->
    <div style="background-color:#F6F4F1;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;color:#666;">Montant crédité</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:18px;font-weight:900;color:#E56B2D;">+${amount.toLocaleString("fr-FR")} ${currency}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;color:#666;">Généré par</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;font-weight:700;color:#0F3D3E;">${referralName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;color:#666;">Niveau de commission</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;font-weight:700;color:#0F3D3E;">Niveau ${level}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;">Date</td>
          <td align="right" style="padding:8px 0;font-size:14px;font-weight:700;color:#0F3D3E;">${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</td>
        </tr>
      </table>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
      Les fonds sont disponibles dans votre portefeuille ambassadeur. Vous pouvez initier un retrait
      dès que votre solde atteint le seuil minimum.
    </p>

    <div style="text-align:center;">
      ${CtaButton(`${baseUrl}/espace-client/ambassadeur`, "Voir mon portefeuille")}
    </div>
  `;

  return BaseEmailTemplate("Commission reçue", content);
};
