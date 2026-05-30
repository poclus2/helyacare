/**
 * HelyaCare — Template Email : Nouveau filleul (MLM)
 * Envoyé à l'ambassadeur parrain quand un filleul crée son compte via son code.
 * Adapté de MakoPay/new-referral.template.ts
 */

import { BaseEmailTemplate, CtaButton } from "./base.template";

export const NewReferralTemplate = (
  sponsorFirstName: string,
  referralFullName: string,
  referralCode: string
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Votre réseau grandit, ${sponsorFirstName} !
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;">
      Bonne nouvelle : <strong style="color:#0F3D3E;">${referralFullName}</strong> vient de rejoindre
      HelyaCare grâce à votre lien de parrainage.
    </p>

    <div style="background-color:#F6F4F1;border-radius:12px;padding:24px;margin-bottom:28px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;color:#666;">Filleul</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:16px;font-weight:900;color:#0F3D3E;">${referralFullName}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;color:#666;">Code utilisé</td>
          <td align="right" style="padding:8px 0;border-bottom:1px solid #E8E3DC;font-size:14px;font-weight:700;color:#0F3D3E;">${referralCode}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;font-size:14px;color:#666;">Date</td>
          <td align="right" style="padding:8px 0;font-size:14px;font-weight:700;color:#0F3D3E;">${new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}</td>
        </tr>
      </table>
    </div>

    <div style="background-color:#CBF27A;border-radius:10px;padding:16px 20px;margin-bottom:28px;">
      <p style="margin:0;font-size:14px;font-weight:700;color:#0F3D3E;">
        À noter : Vous percevrez une commission sur chacun de ses achats. Plus il commande, plus vous gagnez.
      </p>
    </div>

    <p style="margin:0 0 24px;font-size:14px;color:#666;line-height:1.7;">
      Continuez à partager votre lien personnel pour agrandir votre réseau et maximiser vos revenus ambassadeur.
    </p>

    <div style="text-align:center;">
      ${CtaButton(`${baseUrl}/espace-client/ambassadeur`, "Voir mon réseau")}
    </div>
  `;

  return BaseEmailTemplate("Nouveau filleul dans votre réseau", content);
};
