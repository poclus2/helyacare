/**
 * HelyaCare — Template Email : Bienvenue
 * Envoyé lors de la création d'un compte client.
 */

import { BaseEmailTemplate, CtaButton } from "./base.template";

export const WelcomeTemplate = (firstName: string): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";

  const content = `
    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Bienvenue dans votre Laboratoire Vivant, ${firstName} 🌿
    </p>
    <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.7;">
      Votre compte HelyaCare est désormais actif. Vous faites partie d'une communauté engagée
      dans une approche scientifique et humaine de la santé intégrative.
    </p>

    <div style="background-color:#F6F4F1;border-radius:12px;padding:24px;margin-bottom:32px;">
      <p style="margin:0 0 16px;font-size:14px;font-weight:700;color:#0F3D3E;">Ce qui vous attend :</p>
      ${[
        { icon: "🛒", text: "Accédez à la boutique et commandez votre protocole personnalisé" },
        { icon: "💬", text: "Votre coach IA HelyaCare vous guide via WhatsApp" },
        { icon: "📊", text: "Suivez vos résultats dans votre espace client" },
        { icon: "🤝", text: "Partagez votre code ambassadeur et gagnez des commissions" },
      ].map(item => `
        <div style="display:flex;align-items:flex-start;gap:12px;margin-bottom:12px;">
          <span style="font-size:20px;flex-shrink:0;">${item.icon}</span>
          <p style="margin:0;font-size:14px;color:#555;line-height:1.5;">${item.text}</p>
        </div>
      `).join("")}
    </div>

    <div style="text-align:center;padding-top:8px;">
      ${CtaButton(`${baseUrl}/boutique`, "Découvrir la boutique")}
    </div>
    <p style="margin:24px 0 0;font-size:13px;color:#888;text-align:center;">
      Ou <a href="${baseUrl}/espace-client" style="color:#0F3D3E;font-weight:600;text-decoration:none;">accédez à votre espace client</a>
    </p>
  `;

  return BaseEmailTemplate("Bienvenue chez HelyaCare", content);
};
