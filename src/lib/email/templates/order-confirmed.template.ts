/**
 * HelyaCare — Template Email : Confirmation de commande
 * Envoyé après validation du paiement Flutterwave.
 * Adapté de MakoPay/order-paid.template.ts + du code existant dans api/email/order-confirmation
 */

import { BaseEmailTemplate, CtaButton } from "./base.template";

interface OrderItem {
  title: string;
  subtitle?: string;
  quantity: number;
  unit_price: number;
}

export const OrderConfirmedTemplate = (
  firstName: string,
  orderRef: string,
  amount: number,
  currency: string = "XOF",
  items: OrderItem[] = []
): string => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";

  const itemsHtml = items.length > 0
    ? items.map(item => `
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #E8E3DC;">
            <span style="font-weight:600;color:#0F3D3E;">${item.title}</span>
            ${item.subtitle ? `<br><span style="font-size:12px;color:#888;">${item.subtitle}</span>` : ""}
          </td>
          <td style="padding:12px 0;border-bottom:1px solid #E8E3DC;text-align:center;color:#666;">×${item.quantity}</td>
          <td style="padding:12px 0;border-bottom:1px solid #E8E3DC;text-align:right;font-weight:700;color:#0F3D3E;">
            ${(item.unit_price * item.quantity).toLocaleString("fr-FR")} ${currency}
          </td>
        </tr>
      `).join("")
    : `<tr><td colspan="3" style="padding:12px 0;color:#888;text-align:center;">Voir le détail dans votre espace client</td></tr>`;

  const content = `
    <!-- Confirmation Badge -->
    <div style="background-color:#0F3D3E;border-radius:12px;padding:16px 24px;margin-bottom:28px;text-align:center;">
      <p style="margin:0;font-size:14px;font-weight:800;color:#CBF27A;letter-spacing:0.5px;">
        ✓ Paiement reçu · Commande en préparation
      </p>
    </div>

    <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0F3D3E;">
      Merci ${firstName} 🌿
    </p>
    <p style="margin:0 0 32px;font-size:15px;color:#666;line-height:1.7;">
      Votre commande est confirmée. Votre protocole HelyaCare est en cours de préparation.
    </p>

    <!-- Référence -->
    <div style="background-color:#F6F4F1;border-radius:12px;padding:20px 24px;margin-bottom:32px;">
      <p style="margin:0 0 4px;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;">Référence commande</p>
      <p style="margin:0;font-size:22px;font-weight:900;color:#0F3D3E;font-family:monospace;letter-spacing:2px;">${orderRef}</p>
    </div>

    <!-- Articles -->
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
      <thead>
        <tr>
          <th style="text-align:left;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;border-bottom:2px solid #E8E3DC;">Produit</th>
          <th style="text-align:center;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;border-bottom:2px solid #E8E3DC;">Qté</th>
          <th style="text-align:right;font-size:11px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:1px;padding-bottom:12px;border-bottom:2px solid #E8E3DC;">Prix</th>
        </tr>
      </thead>
      <tbody>${itemsHtml}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top:16px;font-weight:700;color:#0F3D3E;font-size:15px;">Total</td>
          <td style="padding-top:16px;font-weight:900;color:#0F3D3E;font-size:18px;text-align:right;">
            ${amount.toLocaleString("fr-FR")} ${currency}
          </td>
        </tr>
        <tr>
          <td colspan="3" style="padding-top:6px;font-size:12px;color:#22c55e;text-align:right;">+ Livraison offerte 🚚</td>
        </tr>
      </tfoot>
    </table>

    <!-- Étapes suivantes -->
    <div style="border-top:1px solid #E8E3DC;padding-top:28px;margin-top:8px;">
      <p style="margin:0 0 16px;font-size:15px;font-weight:700;color:#0F3D3E;">Les prochaines étapes</p>
      ${[
        { icon: "📦", title: "Préparation sous 24h", desc: "Votre cure est conditionnée avec soin par notre équipe." },
        { icon: "🚚", title: "Expédition & Suivi", desc: "Un lien de suivi vous sera transmis dès l'expédition." },
        { icon: "💬", title: "Coaching WhatsApp IA", desc: "Votre coach HelyaCare démarre votre protocole personnalisé." },
      ].map(s => `
        <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
          <tr>
            <td style="width:44px;vertical-align:top;">
              <div style="width:36px;height:36px;background:#F6F4F1;border-radius:8px;text-align:center;line-height:36px;font-size:18px;">${s.icon}</div>
            </td>
            <td style="padding-left:12px;vertical-align:top;">
              <p style="margin:0 0 2px;font-size:14px;font-weight:700;color:#0F3D3E;">${s.title}</p>
              <p style="margin:0;font-size:13px;color:#666;">${s.desc}</p>
            </td>
          </tr>
        </table>
      `).join("")}
    </div>

    <div style="text-align:center;padding-top:24px;">
      ${CtaButton(`${baseUrl}/espace-client/commandes`, "Suivre ma commande")}
    </div>
  `;

  return BaseEmailTemplate("Commande confirmée", content);
};
