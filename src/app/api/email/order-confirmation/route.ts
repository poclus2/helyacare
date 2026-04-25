import { NextResponse } from "next/server";

/**
 * POST /api/email/order-confirmation
 * Envoie un email de confirmation de commande via Resend.
 * Appelé depuis la page /commande/succes et le webhook Flutterwave.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, customerName, orderRef, amount, currency = "XOF", items = [] } = body;

    if (!to || !orderRef) {
      return NextResponse.json({ error: "to et orderRef sont requis" }, { status: 400 });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const emailFrom = process.env.EMAIL_FROM || "HelyaCare <commandes@helyacare.com>";

    // Mode dev : log sans envoyer si pas de vraie clé
    if (!resendApiKey || resendApiKey.includes("XXXX")) {
      console.log("[email] Mode dev — email simulé:", { to, orderRef, amount });
      return NextResponse.json({
        success: true,
        dev_mode: true,
        message: `Email simulé envoyé à ${to}`,
      });
    }

    // Construire la liste des articles HTML
    const itemsHtml = items.length > 0
      ? items.map((item: any) => `
          <tr>
            <td style="padding: 12px 0; border-bottom: 1px solid #E8E3DC;">
              <span style="font-weight: 600; color: #0F3D3E;">${item.title}</span>
              ${item.subtitle ? `<br><span style="font-size: 12px; color: #888;">${item.subtitle}</span>` : ""}
            </td>
            <td style="padding: 12px 0; border-bottom: 1px solid #E8E3DC; text-align: center; color: #666;">×${item.quantity}</td>
            <td style="padding: 12px 0; border-bottom: 1px solid #E8E3DC; text-align: right; font-weight: 700; color: #0F3D3E;">
              ${item.unit_price?.toLocaleString("fr-FR")} ${currency}
            </td>
          </tr>
        `).join("")
      : `<tr><td colspan="3" style="padding: 12px 0; color: #888; text-align: center;">Détails disponibles dans votre espace client</td></tr>`;

    const html = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Confirmation de commande HelyaCare</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F6F4F1; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F6F4F1; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background-color: #0F3D3E; border-radius: 16px 16px 0 0; padding: 40px 48px; text-align: center;">
              <p style="margin: 0; font-size: 28px; font-weight: 900; color: white; letter-spacing: -0.5px;">HelyaCare</p>
              <p style="margin: 8px 0 0; font-size: 13px; color: rgba(255,255,255,0.6); letter-spacing: 1px; text-transform: uppercase;">Votre commande est confirmée</p>
            </td>
          </tr>

          <!-- Success Band -->
          <tr>
            <td style="background-color: #CBF27A; padding: 16px 48px; text-align: center;">
              <p style="margin: 0; font-size: 14px; font-weight: 800; color: #0F3D3E; letter-spacing: 0.5px;">
                ✓ Paiement reçu · Commande en préparation
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="background-color: white; padding: 48px 48px 32px; border-radius: 0;">

              <p style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #0F3D3E;">
                Merci ${customerName || "pour votre commande"} 🌿
              </p>
              <p style="margin: 0 0 32px; font-size: 15px; color: #666; line-height: 1.6;">
                Nous avons bien reçu votre commande et votre paiement. Votre protocole HelyaCare est en cours de préparation.
              </p>

              <!-- Order Reference -->
              <div style="background-color: #F6F4F1; border-radius: 12px; padding: 20px 24px; margin-bottom: 32px;">
                <p style="margin: 0 0 4px; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px;">Référence commande</p>
                <p style="margin: 0; font-size: 22px; font-weight: 900; color: #0F3D3E; font-family: monospace; letter-spacing: 2px;">${orderRef}</p>
              </div>

              <!-- Items -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <thead>
                  <tr>
                    <th style="text-align: left; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px; border-bottom: 2px solid #E8E3DC;">Produit</th>
                    <th style="text-align: center; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px; border-bottom: 2px solid #E8E3DC;">Qté</th>
                    <th style="text-align: right; font-size: 11px; font-weight: 700; color: #888; text-transform: uppercase; letter-spacing: 1px; padding-bottom: 12px; border-bottom: 2px solid #E8E3DC;">Prix</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
                <tfoot>
                  <tr>
                    <td colspan="2" style="padding-top: 16px; font-weight: 700; color: #0F3D3E; font-size: 15px;">Total</td>
                    <td style="padding-top: 16px; font-weight: 900; color: #0F3D3E; font-size: 18px; text-align: right;">
                      ${Number(amount).toLocaleString("fr-FR")} ${currency}
                    </td>
                  </tr>
                  <tr>
                    <td colspan="3" style="padding-top: 8px; font-size: 12px; color: #22c55e; text-align: right;">+ Livraison offerte</td>
                  </tr>
                </tfoot>
              </table>

              <!-- Next Steps -->
              <div style="border-top: 1px solid #E8E3DC; padding-top: 32px; margin-top: 32px;">
                <p style="margin: 0 0 20px; font-size: 16px; font-weight: 700; color: #0F3D3E;">Les prochaines étapes</p>
                <table width="100%" cellpadding="0" cellspacing="0">
                  ${[
                    { icon: "📦", title: "Préparation sous 24h", desc: "Votre cure est conditionnée par notre équipe." },
                    { icon: "🚚", title: "Expédition & Suivi", desc: "Un lien de suivi vous sera envoyé par SMS." },
                    { icon: "💬", title: "Suivi WhatsApp IA", desc: "Votre coach HelyaCare vous contactera pour démarrer votre protocole." },
                  ].map(s => `
                  <tr>
                    <td style="width: 44px; vertical-align: top; padding-bottom: 16px;">
                      <div style="width: 36px; height: 36px; background: #F6F4F1; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; text-align: center; line-height: 36px;">${s.icon}</div>
                    </td>
                    <td style="padding-left: 12px; padding-bottom: 16px; vertical-align: top;">
                      <p style="margin: 0 0 2px; font-size: 14px; font-weight: 700; color: #0F3D3E;">${s.title}</p>
                      <p style="margin: 0; font-size: 13px; color: #666;">${s.desc}</p>
                    </td>
                  </tr>
                  `).join("")}
                </table>
              </div>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color: white; padding: 0 48px 40px; text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/espace-client"
                 style="display: inline-block; background-color: #E56B2D; color: white; font-size: 15px; font-weight: 700; padding: 16px 40px; border-radius: 12px; text-decoration: none;">
                Voir ma commande →
              </a>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0F3D3E; border-radius: 0 0 16px 16px; padding: 32px 48px; text-align: center;">
              <p style="margin: 0 0 8px; font-size: 13px; color: rgba(255,255,255,0.5);">
                Questions ? <a href="mailto:care@helyacare.com" style="color: #CBF27A; text-decoration: none;">care@helyacare.com</a>
              </p>
              <p style="margin: 0; font-size: 11px; color: rgba(255,255,255,0.3);">
                © ${new Date().getFullYear()} HelyaCare · Tous droits réservés ·
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/legal/cgv" style="color: rgba(255,255,255,0.4); text-decoration: none;">CGV</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    // Envoi via Resend
    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [to],
        subject: `✅ Commande confirmée — Réf. ${orderRef} | HelyaCare`,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error("[email] Resend error:", resendData);
      return NextResponse.json({ success: false, error: resendData }, { status: 500 });
    }

    return NextResponse.json({ success: true, email_id: resendData.id });

  } catch (error: any) {
    console.error("[email/order-confirmation]", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
