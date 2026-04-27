"use client";

import { useEffect, useState, useCallback } from "react";
import { Inter } from "next/font/google";
import {
  Loader2, Search, ShoppingBag, RefreshCcw,
  CreditCard, Smartphone, CheckCircle2, Clock, XCircle, Package
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const fmtXOF = (n: number) => `${n.toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const METHOD_LABEL: Record<string, string> = {
  flutterwave: "Carte / Flutterwave",
  wave: "Wave",
  orange_money: "Orange Money",
  mtn_momo: "MTN MoMo",
  bank: "Virement",
  other: "Autre",
};

// Commande unifiée (Medusa ou manuelle)
interface UnifiedOrder {
  id: string;
  display_id?: string | number;
  email: string;
  items_label: string;
  items_count: number;
  amount: number;             // déjà en XOF (pas en centimes)
  payment_method: string;
  payment_status: string;     // "captured" | "pending" | "awaiting_payment" | "approved" | "rejected"
  fulfillment_status?: string;
  created_at: string;
  reference_code?: string;
  source: "medusa" | "manual";
}

function PayBadge({ status }: { status: string }) {
  const s = status?.toLowerCase();
  if (s === "captured" || s === "approved")
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-green-500/10 text-green-400 border-green-500/20"><CheckCircle2 className="w-3 h-3" />Payé</span>;
  if (s === "pending" || s === "awaiting_payment")
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-orange-500/10 text-orange-400 border-orange-500/20"><Clock className="w-3 h-3" />En attente</span>;
  if (s === "rejected" || s === "not_paid" || s === "cancelled")
    return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border bg-red-500/10 text-red-400 border-red-500/20"><XCircle className="w-3 h-3" />Rejeté</span>;
  return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold border bg-white/10 text-white/40 border-white/10">{status || "—"}</span>;
}

function FulfillBadge({ status }: { status?: string }) {
  if (!status) return <span className="text-white/20 text-xs">—</span>;
  const m: Record<string, [string, string]> = {
    fulfilled:     ["Préparé",    "bg-blue-500/10 text-blue-400 border-blue-500/20"],
    not_fulfilled: ["À préparer", "bg-orange-500/10 text-orange-400 border-orange-500/20"],
    shipped:       ["Expédié",    "bg-purple-500/10 text-purple-400 border-purple-500/20"],
    delivered:     ["Livré",      "bg-green-500/10 text-green-400 border-green-500/20"],
  };
  const [label, cls] = m[status] || [status, "bg-white/10 text-white/40 border-white/10"];
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>{label}</span>;
}

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState<"all" | "medusa" | "manual">("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const unified: UnifiedOrder[] = [];

      // ── 1. Commandes Medusa (Flutterwave, complétées) ──
      const medusaRes = await fetch("/api/admin/commandes?limit=250");
      if (medusaRes.ok) {
        const data = await medusaRes.json();
        const medusaOrders = data.orders || [];
        medusaOrders.forEach((o: any) => {
          const items = o.items || [];
          const firstItem = items[0]?.title || "Produit HelyaCare";
          unified.push({
            id: o.id,
            display_id: o.display_id,
            email: o.email || "—",
            items_label: items.length > 1 ? `${firstItem} +${items.length - 1}` : firstItem,
            items_count: items.length,
            amount: Math.round((o.total || 0) / 100),  // Medusa stocke en centimes
            payment_method: "flutterwave",
            payment_status: o.payment_status || o.status || "—",
            fulfillment_status: o.fulfillment_status,
            created_at: o.created_at,
            source: "medusa",
          });
        });
      }

      // ── 2. Dépôts manuels avec cart_items (paiements commandes) ──
      const depositsRes = await fetch("/api/admin/deposits");
      if (depositsRes.ok) {
        const data = await depositsRes.json();
        const deposits = data.deposits || [];
        deposits.forEach((dep: any) => {
          const items: any[] = dep.cart_items || [];
          // Inclure TOUS les dépôts (même sans articles) pour visibilité complète
          const firstItem = items[0]?.title || "Rechargement portefeuille";
          unified.push({
            id: dep.id,
            reference_code: dep.reference_code,
            email: dep.customer_email || "—",
            items_label: items.length > 1 ? `${firstItem} +${items.length - 1}` : firstItem,
            items_count: items.length,
            amount: dep.amount,   // déjà en XOF
            payment_method: dep.method,
            payment_status: dep.status,
            fulfillment_status: dep.status === "approved" ? "not_fulfilled" : undefined,
            created_at: dep.created_at,
            source: "manual",
          });
        });
      }

      // Tri par date décroissante
      unified.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(unified);
    } catch (e) {
      console.error("[admin/commandes]", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = orders.filter(o => {
    if (sourceFilter !== "all" && o.source !== sourceFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      o.email.toLowerCase().includes(q) ||
      String(o.display_id || "").includes(q) ||
      (o.reference_code || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: orders.length,
    medusa: orders.filter(o => o.source === "medusa").length,
    manual: orders.filter(o => o.source === "manual").length,
    pending: orders.filter(o => ["pending", "awaiting_payment"].includes(o.payment_status)).length,
    paid: orders.filter(o => ["captured", "approved"].includes(o.payment_status)).length,
  };

  return (
    <div className={`space-y-6 ${inter.className}`}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Commandes</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {stats.total} total · {stats.paid} payées · {stats.pending} en attente
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* KPI mini */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-white" },
          { label: "Payées / Approuvées", value: stats.paid, color: "text-green-400" },
          { label: "En attente", value: stats.pending, color: "text-orange-400" },
          { label: "Paiements manuels", value: stats.manual, color: "text-blue-400" },
        ].map(({ label, value, color }) => (
          <div key={label} className="bg-white/3 border border-white/8 rounded-xl px-4 py-3">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-1">{label}</p>
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Email, référence, numéro..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm
              placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "medusa", "manual"] as const).map(f => (
            <button
              key={f}
              onClick={() => setSourceFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                sourceFilter === f
                  ? "bg-[#CBF27A] text-[#0F3D3E] border-[#CBF27A]"
                  : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {f === "all" ? "Toutes" : f === "medusa" ? "💳 Flutterwave" : "📱 Manuelles"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">
              {search ? "Aucun résultat pour cette recherche" : "Aucune commande"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Référence", "Client", "Articles", "Montant", "Méthode", "Paiement", "Livraison", "Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/30 text-[11px] font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        {order.source === "manual"
                          ? <Smartphone className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                          : <CreditCard className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        }
                        <span className="font-mono text-white/60 text-xs">
                          {order.reference_code || (order.display_id ? `#HC-${order.display_id}` : `#${order.id.slice(-6).toUpperCase()}`)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-white/80 text-xs">{order.email}</td>
                    <td className="px-4 py-4 text-white/50 text-xs max-w-[150px] truncate" title={order.items_label}>
                      {order.items_label}
                    </td>
                    <td className="px-4 py-4 text-[#CBF27A] font-bold text-sm whitespace-nowrap">
                      {fmtXOF(order.amount)}
                    </td>
                    <td className="px-4 py-4 text-white/40 text-xs whitespace-nowrap">
                      {METHOD_LABEL[order.payment_method] || order.payment_method}
                    </td>
                    <td className="px-4 py-4"><PayBadge status={order.payment_status} /></td>
                    <td className="px-4 py-4"><FulfillBadge status={order.fulfillment_status} /></td>
                    <td className="px-4 py-4 text-white/30 text-xs whitespace-nowrap">
                      {order.created_at ? fmtDate(order.created_at) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
