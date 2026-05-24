import { NextResponse } from "next/server";
import { verifyAdminAuth } from "../../../_auth";
import { getMedusaAdminToken } from "@/lib/medusa-admin-auth";

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

async function getAdminHeaders() {
  const token = await getMedusaAdminToken();
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  if (!(await verifyAdminAuth())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const { id } = params;
    const body = await request.json();
    const { source, status, customer_id } = body;

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
      };

      meta.deposit_requests = JSON.stringify(deposits);

      // 3. Sauvegarder
      const updateRes = await fetch(`${BACKEND}/admin/customers/${customer_id}`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ metadata: meta }),
      });

      if (!updateRes.ok) {
        throw new Error("Échec de la mise à jour Medusa");
      }

      return NextResponse.json({ success: true, new_status: status });

    } else if (source === "medusa") {
      // Option 1 : on met à jour simplement le statut personnalisé dans les metadata de la commande Medusa
      
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

      // 2. Mettre à jour
      const updateRes = await fetch(`${BACKEND}/admin/orders/${id}`, {
        method: "POST",
        headers: adminHeaders,
        body: JSON.stringify({ metadata: orderMeta }),
      });

      if (!updateRes.ok) {
        throw new Error("Échec de la mise à jour Medusa");
      }

      return NextResponse.json({ success: true, new_status: status });
    }

    return NextResponse.json({ error: "Source inconnue" }, { status: 400 });

  } catch (err: any) {
    console.error("[admin/commandes/status POST]", err);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}
