"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { Loader2, Search, Users, Crown, User, RefreshCcw, Mail } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Les appels sont sécurisés via les routes internes de Next.js
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

export default function AdminClientsPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "ambassadeur" | "customer">("all");

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?limit=500`);
      if (res.ok) {
        const data = await res.json();
        setCustomers(data.customers || []);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = customers.filter(c => {
    const role = c.metadata?.role || "customer";
    const matchRole = filter === "all" || role === filter;
    const matchSearch = !search ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const ambassadors = customers.filter(c => c.metadata?.role === "ambassadeur").length;

  return (
    <div className={`space-y-6 ${inter.className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Clients</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {customers.length} client{customers.length !== 1 ? "s" : ""} · {ambassadors} ambassadeur{ambassadors !== 1 ? "s" : ""}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher par nom ou email..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40 transition-all" />
        </div>
        <div className="flex gap-2">
          {(["all", "customer", "ambassadeur"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                filter === f
                  ? "bg-[#CBF27A] text-[#0F3D3E]"
                  : "bg-white/5 text-white/50 hover:bg-white/10 border border-white/10"
              }`}>
              {f === "all" ? "Tous" : f === "ambassadeur" ? "Ambassadeurs" : "Clients"}
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
            <Users className="w-8 h-8 text-white/20 mx-auto mb-3" />
            <p className="text-white/30 text-sm">Aucun résultat</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {["Client", "Email", "Rôle", "Code Parrainage", "Parrainé par", "Inscrit le"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-white/30 text-[11px] font-bold uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map(c => {
                  const role = c.metadata?.role || "customer";
                  const isAmb = role === "ambassadeur";
                  const commissions = c.metadata?.commissions ? JSON.parse(c.metadata.commissions) : [];
                  const balance = commissions.filter((x: any) => x.status === "pending").reduce((s: number, x: any) => s + x.amount, 0);
                  return (
                    <tr key={c.id} className="hover:bg-white/3 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                            isAmb ? "bg-[#CBF27A]/20 text-[#CBF27A]" : "bg-white/10 text-white/60"
                          }`}>
                            {(c.first_name || c.email || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-white text-sm font-semibold">
                              {[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}
                            </p>
                            {isAmb && balance > 0 && (
                              <p className="text-[#CBF27A] text-[10px] font-bold">
                                {balance.toLocaleString("fr-FR")} XOF en attente
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-white/60 text-xs">{c.email}</td>
                      <td className="px-4 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                          isAmb
                            ? "bg-[#CBF27A]/10 text-[#CBF27A] border-[#CBF27A]/20"
                            : "bg-white/5 text-white/40 border-white/10"
                        }`}>
                          {isAmb ? <Crown className="w-3 h-3" /> : <User className="w-3 h-3" />}
                          {isAmb ? "Ambassadeur" : "Client"}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-mono text-white/50 text-xs">
                        {c.metadata?.referral_code || "—"}
                      </td>
                      <td className="px-4 py-4 text-white/40 text-xs">
                        {c.metadata?.referred_by || "—"}
                      </td>
                      <td className="px-4 py-4 text-white/30 text-xs">
                        {c.created_at ? fmtDate(c.created_at) : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
