"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Loader2, Search, ShoppingBag, RefreshCcw } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Les appels sont sécurisés via les routes internes de Next.js
const fmtXOF = (n: number) => `${(n / 100).toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/commandes?limit=100`);
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = orders.filter(o =>
    !search ||
    o.email?.toLowerCase().includes(search.toLowerCase()) ||
    String(o.display_id).includes(search)
  );

  return (
    <div className={`space-y-6 ${inter.className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Commandes</h1>
          <p className="text-white/40 text-sm mt-0.5">{orders.length} commande{orders.length !== 1 ? "s" : ""}</p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher par email ou numéro..."
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20
            focus:outline-none focus:border-[#CBF27A]/40 transition-all" />
      </div>

      <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">{search ? "Aucun résultat" : "Aucune commande"}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["#", "Client", "Articles", "Montant", "Paiement", "Livraison", "Date"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/30 text-[11px] font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(order => (
                  <tr key={order.id} className="hover:bg-white/3 transition-colors">
                    <td className="px-5 py-4 font-mono text-white/50 text-xs">#{order.display_id || order.id.slice(-6).toUpperCase()}</td>
                    <td className="px-4 py-4 text-white/80">{order.email}</td>
                    <td className="px-4 py-4 text-white/50">{order.items?.length || 0} article{(order.items?.length || 0) !== 1 ? "s" : ""}</td>
                    <td className="px-4 py-4 text-[#CBF27A] font-bold">{fmtXOF(order.total || 0)}</td>
                    <td className="px-4 py-4"><PayBadge status={order.payment_status} /></td>
                    <td className="px-4 py-4"><FulfillBadge status={order.fulfillment_status} /></td>
                    <td className="px-4 py-4 text-white/30 text-xs">{order.created_at ? fmtDate(order.created_at) : "—"}</td>
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

function PayBadge({ status }: { status: string }) {
  const m: Record<string, [string, string]> = {
    captured: ["Payé", "bg-green-500/10 text-green-400 border-green-500/20"],
    awaiting: ["En attente", "bg-orange-500/10 text-orange-400 border-orange-500/20"],
    not_paid: ["Non payé", "bg-red-500/10 text-red-400 border-red-500/20"],
  };
  const [label, cls] = m[status] || [status, "bg-white/10 text-white/40 border-white/10"];
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>{label}</span>;
}

function FulfillBadge({ status }: { status: string }) {
  const m: Record<string, [string, string]> = {
    fulfilled: ["Préparé", "bg-blue-500/10 text-blue-400 border-blue-500/20"],
    not_fulfilled: ["À préparer", "bg-orange-500/10 text-orange-400 border-orange-500/20"],
    shipped: ["Expédié", "bg-purple-500/10 text-purple-400 border-purple-500/20"],
    delivered: ["Livré", "bg-green-500/10 text-green-400 border-green-500/20"],
  };
  const [label, cls] = m[status] || [status, "bg-white/10 text-white/40 border-white/10"];
  return <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>{label}</span>;
}
