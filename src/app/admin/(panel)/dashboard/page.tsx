"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  TrendingUp, ShoppingBag, Users, Wallet, Clock,
  AlertCircle, ArrowUpRight, CheckCircle2, Loader2, RefreshCcw
} from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface Stats {
  kpis: {
    revenue: number;
    total_orders: number;
    completed_orders: number;
    pending_orders: number;
    total_customers: number;
    total_ambassadors: number;
    pending_commissions: number;
    pending_withdrawals_count: number;
  };
  recent_orders: any[];
  pending_withdrawals: any[];
  revenue_by_day: { date: string; revenue: number; orders: number }[];
}

const fmtXOF = (n: number) => `${n.toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
        setLastUpdated(new Date());
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60_000); // Refresh toutes les minutes
    return () => clearInterval(interval);
  }, []);

  const maxRevenue = stats?.revenue_by_day.reduce((m, d) => Math.max(m, d.revenue), 1) || 1;

  return (
    <div className={`space-y-8 ${inter.className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dashboard</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {lastUpdated ? `Mis à jour ${lastUpdated.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}` : "Chargement..."}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {loading && !stats ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-[#CBF27A] animate-spin" />
        </div>
      ) : (
        <>
          {/* KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Chiffre d'affaires",
                value: fmtXOF(stats?.kpis.revenue || 0),
                icon: TrendingUp,
                color: "text-[#CBF27A]",
                bg: "bg-[#CBF27A]/10",
                border: "border-[#CBF27A]/20",
                sub: `${stats?.kpis.completed_orders || 0} commandes payées`,
              },
              {
                label: "Commandes totales",
                value: String(stats?.kpis.total_orders || 0),
                icon: ShoppingBag,
                color: "text-blue-400",
                bg: "bg-blue-400/10",
                border: "border-blue-400/20",
                sub: `${stats?.kpis.pending_orders || 0} en attente`,
                alert: (stats?.kpis.pending_orders || 0) > 0,
              },
              {
                label: "Clients",
                value: String(stats?.kpis.total_customers || 0),
                icon: Users,
                color: "text-purple-400",
                bg: "bg-purple-400/10",
                border: "border-purple-400/20",
                sub: `${stats?.kpis.total_ambassadors || 0} ambassadeurs`,
              },
              {
                label: "Retraits en attente",
                value: String(stats?.kpis.pending_withdrawals_count || 0),
                icon: Wallet,
                color: "text-orange-400",
                bg: "bg-orange-400/10",
                border: "border-orange-400/20",
                sub: `${fmtXOF(stats?.kpis.pending_commissions || 0)} commissions`,
                alert: (stats?.kpis.pending_withdrawals_count || 0) > 0,
              },
            ].map(({ label, value, icon: Icon, color, bg, border, sub, alert }) => (
              <div key={label} className={`${bg} border ${border} rounded-2xl p-5 relative overflow-hidden`}>
                {alert && (
                  <span className="absolute top-3 right-3 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />
                )}
                <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 ${color}`} />
                </div>
                <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
                <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
                {sub && <p className="text-white/30 text-xs mt-1">{sub}</p>}
              </div>
            ))}
          </div>

          {/* Revenue Chart + Withdrawals */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Mini Bar Chart — 7 derniers jours */}
            <div className="lg:col-span-2 bg-white/3 border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-bold text-base">Revenus — 7 derniers jours</h2>
                <span className="text-white/30 text-xs">XOF</span>
              </div>
              <div className="flex items-end gap-3 h-36">
                {(stats?.revenue_by_day || []).map(day => {
                  const pct = (day.revenue / maxRevenue) * 100;
                  const date = new Date(day.date);
                  const label = date.toLocaleDateString("fr-FR", { weekday: "short" });
                  return (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                      <p className="text-[#CBF27A] text-[10px] font-bold opacity-0 group-hover:opacity-100">
                        {day.orders}
                      </p>
                      <div className="w-full relative flex items-end" style={{ height: "100px" }}>
                        <div
                          className="w-full bg-[#CBF27A]/80 rounded-t-lg transition-all duration-700 ease-out hover:bg-[#CBF27A] cursor-pointer"
                          style={{ height: `${Math.max(pct, 4)}%` }}
                          title={`${fmtXOF(day.revenue)} · ${day.orders} commande(s)`}
                        />
                      </div>
                      <p className="text-white/30 text-[10px] capitalize">{label}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Retraits en attente */}
            <div className="bg-white/3 border border-white/8 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-white font-bold text-base">Retraits à traiter</h2>
                <Link href="/admin/retraits" className="text-[#CBF27A] text-xs font-bold hover:underline">
                  Tout voir →
                </Link>
              </div>
              {(stats?.pending_withdrawals || []).length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white/40 text-sm">Aucun retrait en attente</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats?.pending_withdrawals.slice(0, 4).map((w: any) => (
                    <div key={w.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                      <div>
                        <p className="text-white text-sm font-semibold">{w.customer_name || w.customer_email}</p>
                        <p className="text-orange-400 text-xs font-bold">{fmtXOF(w.amount)}</p>
                      </div>
                      <span className="px-2 py-1 bg-orange-400/10 text-orange-400 text-[10px] font-bold rounded-full border border-orange-400/20">
                        {w.method}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dernières commandes */}
          <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <h2 className="text-white font-bold text-base">Dernières commandes</h2>
              <Link href="/admin/commandes" className="text-[#CBF27A] text-xs font-bold hover:underline">
                Toutes les commandes →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left px-6 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">#</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">Client</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">Montant</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">Paiement</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">Livraison</th>
                    <th className="text-left px-4 py-3 text-white/30 text-[11px] font-bold uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(stats?.recent_orders || []).map((order: any) => (
                    <tr key={order.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-6 py-4 font-mono text-white/60 text-xs">
                        #{order.display_id || order.id.slice(-6).toUpperCase()}
                      </td>
                      <td className="px-4 py-4 text-white/80 text-sm">{order.customer_email}</td>
                      <td className="px-4 py-4 text-[#CBF27A] font-bold text-sm">{fmtXOF(order.total / 100)}</td>
                      <td className="px-4 py-4">
                        <PaymentBadge status={order.status} />
                      </td>
                      <td className="px-4 py-4">
                        <FulfillmentBadge status={order.fulfillment_status} />
                      </td>
                      <td className="px-4 py-4 text-white/30 text-xs">{order.created_at ? fmtDate(order.created_at) : "—"}</td>
                    </tr>
                  ))}
                  {(stats?.recent_orders || []).length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-white/20 text-sm">
                        Aucune commande pour l'instant
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    captured: "bg-green-500/10 text-green-400 border-green-500/20",
    awaiting: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    not_paid: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const labels: Record<string, string> = {
    captured: "Payé",
    awaiting: "En attente",
    not_paid: "Non payé",
  };
  const cls = styles[status] || "bg-white/10 text-white/40 border-white/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      {labels[status] || status}
    </span>
  );
}

function FulfillmentBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    fulfilled: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    not_fulfilled: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    shipped: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  const labels: Record<string, string> = {
    fulfilled: "Préparé",
    not_fulfilled: "À préparer",
    shipped: "Expédié",
  };
  const cls = styles[status] || "bg-white/10 text-white/40 border-white/10";
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      {labels[status] || status}
    </span>
  );
}
