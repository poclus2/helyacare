import { NextResponse } from "next/server";
import { verifyAdminAuth } from "../../../_auth";
import { getMedusaAdminToken } from "@/lib/medusa-admin-auth";
import { sendEmail } from "@/lib/email/resend";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

async function getAdminHeaders() {
  const token = await getMedusaAdminToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function buildShippedEmailHtml(
  firstName: string,
  orderRef: string,
  amount: number,
  carrier?: string,
  trackingNumber?: string
) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:Inter,Arial,sans-serif;">
  <div style="max-width:600px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,0.08);">
    <div style="background:#0F3D3E;padding:32px 40px;">
      <h1 style="color:#CBF27A;margin:0;font-size:26px;font-weight:800;">HelyaCare</h1>
      <p style="color:#fff;opacity:0.7;margin:8px 0 0;font-size:14px;">Votre commande est en route ! 🚚</p>
    </div>
    <div style="padding:40px;">
      <p style="color:#0F3D3E;font-size:16px;margin:0 0 16px;">Bonjour <strong>${firstName}</strong>,</p>
      <p style="color:#444;font-size:14px;line-height:1.6;margin:0 0 24px;">
        Bonne nouvelle ! Votre commande <strong style="color:#0F3D3E;">${orderRef}</strong> d'un montant de
        <strong style="color:#E56B2D;">${amount.toLocaleString("fr-FR")} XOF</strong>
        vient d'être expédiée et est maintenant en route vers vous.
      </p>
      ${carrier || trackingNumber ? `
      <div style="background:#f8f9fa;border:1px solid #e8e3dc;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="color:#666;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">Informations de livraison</p>
        ${carrier ? `<p style="color:#0F3D3E;font-size:14px;margin:0 0 6px;"><strong>Transporteur :</strong> ${carrier}</p>` : ""}
        ${trackingNumber ? `<p style="color:#0F3D3E;font-size:14px;margin:0;"><strong>Numéro de suivi :</strong> <span style="font-family:monospace;color:#E56B2D;">${trackingNumber}</span></p>` : ""}
      </div>
      ` : ""}
      <p style="color:#888;font-size:13px;line-height:1.6;margin:0 0 24px;">
        Votre commande devrait arriver dans les prochains jours. Vous pouvez suivre l'état de votre livraison dans votre espace client.
      </p>
      <a href="https://helyacare.com/fr/espace-client/commandes"
         style="display:inline-block;background:#0F3D3E;color:#CBF27A;text-decoration:none;font-weight:700;font-size:14px;padding:14px 28px;border-radius:12px;">
        Suivre ma commande →
      </a>
    </div>
    <div style="background:#f8f9fa;padding:20px 40px;border-top:1px solid #e8e3dc;">
      <p style="color:#999;font-size:12px;margin:0;">© 2025 HelyaCare · Satisfait ou remboursé 30 jours</p>
    </div>
  </div>
</body>
</html>`;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const {
      source,
      status,
      customer_id,
      tracking_number,
      carrier,
      admin_note,
      notify_customer,
      // customer info for email
      customer_email,
      customer_name,
      order_ref,
      amount,
    } = body;

    if (!id || !source || !status) {
      return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
    }

    const adminHeaders = await getAdminHeaders();

    if (source === "manual") {
      if (!customer_id) {
        return NextResponse.json({ error: "customer_id requis pour commande manuelle" }, { status: 400 });
      }

      // 1. Récupérer le client
      const res = await fetch(`${BACKEND}/admin/customers/${customer_id}`, {
        headers: adminHeaders,
      });
      if (!res.ok) {
        return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
      }

      const data = await res.json();
      const customer = data.customer;
      const meta = customer.metadata || {};

      // 2. Mettre à jour la deposit request (commande manuelle)
      const deposits = meta.deposit_requests ? JSON.parse(meta.deposit_requests) : [];
      const idx = deposits.findIndex((d: any) => d.id === id);
      if (idx === -1) {
        return NextResponse.json({ error: "Commande manuelle introuvable" }, { status: 404 });
      }

      deposits[idx] = {
        ...deposits[idx],
        fulfillment_status: status,
        ...(tracking_number && { tracking_number }),
        ...(carrier && { carrier }),
        ...(admin_note !== undefined && { admin_note }),
        ...(status === "shipped" && { shipped_at: new Date().toISOString() }),
        ...(status === "delivered" && { delivered_at: new Date().toISOString() }),
      };

      meta.deposit_requests = JSON.stringify(deposits);

      // 3. Sauvegarder
      const updateRes = await fetch(`${BACKEND}/admin/customers/${customer_id}`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ metadata: meta }),
      });
      if (!updateRes.ok) throw new Error("Échec de la mise à jour Medusa");

      // 4. Email client si expédition et notification demandée
      if (status === "shipped" && notify_customer && (customer_email || customer.email)) {
        const email = customer_email || customer.email;
        const name = customer_name || `${customer.first_name || ""} ${customer.last_name || ""}`.trim() || email;
        try {
          await sendEmail({
            to: email,
            subject: `🚚 Votre commande HelyaCare est expédiée — ${order_ref || id}`,
            html: buildShippedEmailHtml(name, order_ref || id, amount || 0, carrier, tracking_number),
          });
        } catch (emailErr) {
          console.error("[commandes/status] Email dispatch failed:", emailErr);
        }
      }

      return NextResponse.json({ success: true, new_status: status });

    } else if (source === "medusa") {
      // 1. Récupérer la commande Medusa
      const resOrder = await fetch(`${BACKEND}/admin/orders/${id}`, {
        headers: adminHeaders,
      });
      if (!resOrder.ok) {
        return NextResponse.json({ error: "Commande Medusa introuvable" }, { status: 404 });
      }

      const dataOrder = await resOrder.json();
      const orderMeta = dataOrder.order.metadata || {};

      orderMeta.helya_fulfillment_status = status;
      if (tracking_number) orderMeta.helya_tracking_number = tracking_number;
      if (carrier) orderMeta.helya_carrier = carrier;
      if (admin_note !== undefined) orderMeta.helya_admin_note = admin_note;
      if (status === "shipped") orderMeta.helya_shipped_at = new Date().toISOString();
      if (status === "delivered") orderMeta.helya_delivered_at = new Date().toISOString();

      // 2. Mettre à jour
      const updateRes = await fetch(`${BACKEND}/admin/orders/${id}`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ metadata: orderMeta }),
      });
      if (!updateRes.ok) throw new Error("Échec de la mise à jour Medusa");

      // 3. Email client si expédition et notification demandée
      if (status === "shipped" && notify_customer && customer_email) {
        try {
          await sendEmail({
            to: customer_email,
            subject: `🚚 Votre commande HelyaCare est expédiée — ${order_ref || `#${id.slice(-6).toUpperCase()}`}`,
            html: buildShippedEmailHtml(customer_name || customer_email, order_ref || id, amount || 0, carrier, tracking_number),
          });
        } catch (emailErr) {
          console.error("[commandes/status] Email dispatch failed:", emailErr);
        }
      }

      return NextResponse.json({ success: true, new_status: status });
    }

    return NextResponse.json({ error: "Source inconnue" }, { status: 400 });

  } catch (err: any) {
    console.error("[admin/commandes/status POST]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
