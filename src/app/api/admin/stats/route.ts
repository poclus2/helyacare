import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);
const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const API_KEY = process.env.MEDUSA_API_KEY || "";

async function verifyAdmin(request: Request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const token = cookieHeader
    .split(";")
    .find(c => c.trim().startsWith("helyacare_admin_token="))
    ?.split("=")[1];
  if (!token) throw new Error("Non authentifié");
  await jwtVerify(token, SECRET);
}

const adminHeaders = {
  "Content-Type": "application/json",
  ...(API_KEY && { Authorization: `Bearer ${API_KEY}` }),
};

/**
 * GET /api/admin/stats
 * Agrège les KPIs depuis Medusa pour le dashboard admin
 */
export async function GET(request: Request) {
  try {
    await verifyAdmin(request);

    const [ordersRes, customersRes] = await Promise.allSettled([
      fetch(`${BACKEND}/admin/orders?limit=250`, { headers: adminHeaders }),
      fetch(`${BACKEND}/admin/customers?limit=500`, { headers: adminHeaders }),
    ]);

    let orders: any[] = [];
    let customers: any[] = [];

    if (ordersRes.status === "fulfilled" && ordersRes.value.ok) {
      const data = await ordersRes.value.json();
      orders = data.orders || [];
    }
    if (customersRes.status === "fulfilled" && customersRes.value.ok) {
      const data = await customersRes.value.json();
      customers = data.customers || [];
    }

    // KPIs
    const completedOrders = orders.filter(o => o.payment_status === "captured");
    const revenue = completedOrders.reduce((s: number, o: any) => s + (o.total || 0), 0);
    const pendingOrders = orders.filter(o => o.fulfillment_status === "not_fulfilled").length;
    const ambassadors = customers.filter((c: any) => c.metadata?.role === "ambassadeur");

    // Commissions en attente (agréger sur tous les ambassadeurs)
    let pendingCommissions = 0;
    for (const amb of ambassadors) {
      const comms = amb.metadata?.commissions ? JSON.parse(amb.metadata.commissions) : [];
      pendingCommissions += comms
        .filter((c: any) => c.status === "pending")
        .reduce((s: number, c: any) => s + c.amount, 0);
    }

    // Retraits en attente
    const pendingWithdrawals: any[] = [];
    for (const amb of ambassadors) {
      const wds = amb.metadata?.withdrawals ? JSON.parse(amb.metadata.withdrawals) : [];
      const pending = wds.filter((w: any) => w.status === "processing");
      pendingWithdrawals.push(...pending.map((w: any) => ({
        ...w,
        customer_name: `${amb.first_name || ""} ${amb.last_name || ""}`.trim(),
        customer_email: amb.email,
      })));
    }

    // Dernières commandes (10)
    const recentOrders = orders
      .slice(0, 10)
      .map((o: any) => ({
        id: o.id,
        display_id: o.display_id,
        customer_email: o.email,
        total: o.total,
        status: o.payment_status,
        fulfillment_status: o.fulfillment_status,
        created_at: o.created_at,
        items_count: o.items?.length || 0,
      }));

    // Revenue par jour (7 derniers jours)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });
    const revenueByDay = last7Days.map(day => ({
      date: day,
      revenue: completedOrders
        .filter((o: any) => o.created_at?.startsWith(day))
        .reduce((s: number, o: any) => s + (o.total || 0), 0),
      orders: orders.filter((o: any) => o.created_at?.startsWith(day)).length,
    }));

    return NextResponse.json({
      kpis: {
        revenue,
        total_orders: orders.length,
        completed_orders: completedOrders.length,
        pending_orders: pendingOrders,
        total_customers: customers.length,
        total_ambassadors: ambassadors.length,
        pending_commissions: pendingCommissions,
        pending_withdrawals_count: pendingWithdrawals.length,
      },
      recent_orders: recentOrders,
      pending_withdrawals: pendingWithdrawals,
      revenue_by_day: revenueByDay,
    });

  } catch (error: any) {
    if (error.message === "Non authentifié") {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }
    console.error("[admin/stats]", error);
    // Retourner des données vides en cas d'erreur Medusa (backend pas encore configuré)
    return NextResponse.json({
      kpis: { revenue: 0, total_orders: 0, completed_orders: 0, pending_orders: 0, total_customers: 0, total_ambassadors: 0, pending_commissions: 0, pending_withdrawals_count: 0 },
      recent_orders: [],
      pending_withdrawals: [],
      revenue_by_day: [],
    });
  }
}
