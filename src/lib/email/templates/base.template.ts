/**
 * HelyaCare — Base Email Template
 * Adapté de MakoPay/src/modules/notifications/templates/email/base.template.ts
 *
 * Template de base avec l'identité visuelle HelyaCare.
 * Couleurs : #0F3D3E (vert profond), #CBF27A (vert lime), #E56B2D (orange CTA)
 */

const BRAND_COLOR = "#0F3D3E";
const ACCENT_COLOR = "#CBF27A";
const CTA_COLOR = "#E56B2D";
const BG_COLOR = "#F6F4F1";

export const BaseEmailTemplate = (title: string, content: string): string => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — HelyaCare</title>
</head>
<body style="margin:0;padding:0;background-color:${BG_COLOR};font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-text-size-adjust:100%;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${BG_COLOR};padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:${BRAND_COLOR};border-radius:16px 16px 0 0;padding:36px 48px;text-align:center;">
              <p style="margin:0;font-size:26px;font-weight:900;color:white;letter-spacing:-0.5px;">HelyaCare</p>
              <p style="margin:6px 0 0;font-size:12px;color:rgba(255,255,255,0.55);letter-spacing:1.5px;text-transform:uppercase;">${title}</p>
            </td>
          </tr>

          <!-- ACCENT BAND -->
          <tr>
            <td style="background-color:${ACCENT_COLOR};padding:12px 48px;text-align:center;">
              <p style="margin:0;font-size:13px;font-weight:800;color:${BRAND_COLOR};letter-spacing:0.3px;">
                Living Laboratory · Santé intégrative · Afrique &amp; Diaspora
              </p>
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="background-color:white;padding:40px 48px;">
              ${content}
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:${BRAND_COLOR};border-radius:0 0 16px 16px;padding:28px 48px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:rgba(255,255,255,0.5);">
                Questions ? <a href="mailto:care@helyacare.com" style="color:${ACCENT_COLOR};text-decoration:none;">care@helyacare.com</a>
              </p>
              <p style="margin:0;font-size:11px;color:rgba(255,255,255,0.3);">
                © ${new Date().getFullYear()} HelyaCare · Tous droits réservés ·
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com"}/legal/cgv" style="color:rgba(255,255,255,0.4);text-decoration:none;">CGV</a>
                ·
                <a href="${process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com"}/legal/confidentialite" style="color:rgba(255,255,255,0.4);text-decoration:none;">Confidentialité</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

/** Bouton CTA réutilisable */
export const CtaButton = (href: string, label: string): string =>
  `<a href="${href}" style="display:inline-block;background-color:${CTA_COLOR};color:white;font-size:15px;font-weight:700;padding:16px 40px;border-radius:12px;text-decoration:none;margin-top:8px;">${label} →</a>`;

/** Card info avec lignes label/value */
export const InfoCard = (rows: { label: string; value: string; highlight?: boolean }[]): string => `
  <div style="background-color:#F6F4F1;border-radius:12px;padding:20px 24px;margin:24px 0;">
    ${rows.map(r => `
      <div style="display:flex;justify-content:space-between;padding:6px 0;border-bottom:1px solid #E8E3DC;font-size:14px;">
        <span style="color:#666;">${r.label}</span>
        <span style="font-weight:700;color:${r.highlight ? CTA_COLOR : BRAND_COLOR};">${r.value}</span>
      </div>
    `).join("")}
  </div>`;
