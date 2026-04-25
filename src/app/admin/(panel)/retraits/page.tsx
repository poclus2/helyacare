"use client";

import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import {
  Loader2, Wallet, CheckCircle2, XCircle, RefreshCcw,
  Smartphone, Building2, Clock, AlertCircle
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

// Les appels sont sécurisés via les routes internes de Next.js
const fmtXOF = (n: number) => `${n.toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

const METHOD_LABELS: Record<string, string> = {
  wave: "Wave",
  orange_money: "Orange Money",
  mtn_momo: "MTN MoMo",
  bank: "Virement bancaire",
};

export default function AdminRetraitsPage() {
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<{ id: string; type: "success" | "error"; msg: string } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/clients?limit=500`);
      if (res.ok) {
        const data = await res.json();
        const allWithdrawals: any[] = [];
        for (const c of data.customers || []) {
          const wds = c.metadata?.withdrawals ? JSON.parse(c.metadata.withdrawals) : [];
          allWithdrawals.push(...wds.map((w: any) => ({
            ...w,
            customer_name: `${c.first_name || ""} ${c.last_name || ""}`.trim() || c.email,
            customer_email: c.email,
            customer_id: c.id,
          })));
        }
        // Trier par date décroissante
        allWithdrawals.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setWithdrawals(allWithdrawals);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (withdrawal: any, action: "approve" | "reject") => {
    if (!confirm(`${action === "approve" ? "Approuver" : "Rejeter"} ce retrait de ${fmtXOF(withdrawal.amount)} ?`)) return;
    setProcessing(withdrawal.id);
    setStatusMsg(null);

    try {
      // Mettre à jour le statut du retrait dans les metadata du customer
      const getRes = await fetch(`/api/admin/clients/${withdrawal.customer_id}`);
      if (!getRes.ok) throw new Error("Customer introuvable");

      const { customer } = await getRes.json();
      const meta = customer.metadata || {};
      const existingWds: any[] = meta.withdrawals ? JSON.parse(meta.withdrawals) : [];
      const existingComms: any[] = meta.commissions ? JSON.parse(meta.commissions) : [];

      const newStatus = action === "approve" ? "paid" : "rejected";

      const updatedWds = existingWds.map((w: any) =>
        w.id === withdrawal.id
          ? { ...w, status: newStatus, processed_at: new Date().toISOString() }
          : w
      );

      // Mettre à jour les commissions liées
      const updatedComms = existingComms.map((c: any) =>
        withdrawal.commission_ids?.includes(c.id)
          ? { ...c, status: action === "approve" ? "paid" : "pending" }
          : c
      );

      const updateRes = await fetch(`/api/admin/clients/${withdrawal.customer_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          metadata: {
            ...meta,
            withdrawals: JSON.stringify(updatedWds),
            commissions: JSON.stringify(updatedComms),
          },
        }),
      });

      if (updateRes.ok) {
        setStatusMsg({
          id: withdrawal.id,
          type: "success",
          msg: action === "approve"
            ? `✓ Retrait approuvé — ${fmtXOF(withdrawal.amount)} marqué comme versé`
            : `✓ Retrait rejeté — les commissions sont remises en attente`,
        });
        await load();
      } else {
        throw new Error("Échec de la mise à jour");
      }
    } catch (err: any) {
      setStatusMsg({ id: withdrawal.id, type: "error", msg: err.message });
    } finally {
      setProcessing(null);
    }
  };

  const pending = withdrawals.filter(w => w.status === "processing");
  const history = withdrawals.filter(w => w.status !== "processing");

  return (
    <div className={`space-y-8 ${inter.className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Retraits MLM</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {pending.length} en attente · {history.length} traités
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
        </div>
      ) : (
        <>
          {/* Retraits en attente */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-white font-bold text-base">En attente de traitement</h2>
              {pending.length > 0 && (
                <span className="w-5 h-5 bg-orange-500 rounded-full text-white text-[10px] font-black flex items-center justify-center animate-pulse">
                  {pending.length}
                </span>
              )}
            </div>

            {pending.length === 0 ? (
              <div className="bg-white/3 border border-white/8 rounded-2xl p-10 text-center">
                <CheckCircle2 className="w-10 h-10 text-green-400 mx-auto mb-3" />
                <p className="text-white/40 text-sm">Aucun retrait en attente. Tout est à jour !</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pending.map(w => (
                  <div key={w.id} className="bg-white/3 border border-orange-500/20 rounded-2xl p-6">
                    {statusMsg && statusMsg.id === w.id && (
                      <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold ${
                        statusMsg.type === "success"
                          ? "bg-green-500/10 text-green-400 border border-green-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20"
                      }`}>
                        {statusMsg.msg}
                      </div>
                    )}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex gap-4 items-start">
                        <div className="w-12 h-12 bg-orange-500/10 rounded-xl flex items-center justify-center shrink-0">
                          <Wallet className="w-6 h-6 text-orange-400" />
                        </div>
                        <div>
                          <p className="text-white font-bold">{w.customer_name}</p>
                          <p className="text-white/40 text-xs">{w.customer_email}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-2xl font-extrabold text-orange-400">{fmtXOF(w.amount)}</span>
                            <span className="px-2 py-0.5 bg-white/5 border border-white/10 text-white/50 text-[11px] font-bold rounded-full">
                              {METHOD_LABELS[w.method] || w.method}
                            </span>
                          </div>
                          {w.account_details && (
                            <div className="mt-2 space-y-0.5">
                              {w.account_details.phone && (
                                <p className="text-white/50 text-xs flex items-center gap-1.5">
                                  <Smartphone className="w-3 h-3" /> {w.account_details.phone}
                                </p>
                              )}
                              {w.account_details.account_name && (
                                <p className="text-white/50 text-xs flex items-center gap-1.5">
                                  <Building2 className="w-3 h-3" /> {w.account_details.account_name}
                                </p>
                              )}
                            </div>
                          )}
                          <p className="text-white/25 text-[10px] mt-2">
                            <Clock className="w-3 h-3 inline mr-1" />
                            Demandé le {fmtDate(w.created_at)} · Réf : {w.id}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3 shrink-0">
                        <button
                          onClick={() => handleAction(w, "approve")}
                          disabled={processing === w.id}
                          className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold text-sm rounded-xl border border-green-500/20 transition-all disabled:opacity-50">
                          {processing === w.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          Approuver
                        </button>
                        <button
                          onClick={() => handleAction(w, "reject")}
                          disabled={processing === w.id}
                          className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-xl border border-red-500/20 transition-all disabled:opacity-50">
                          <XCircle className="w-4 h-4" />
                          Rejeter
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Historique */}
          {history.length > 0 && (
            <div>
              <h2 className="text-white font-bold text-base mb-4">Historique</h2>
              <div className="bg-white/3 border border-white/8 rounded-2xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/5">
                      {["Ambassadeur", "Montant", "Méthode", "Statut", "Date"].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 text-white/30 text-[11px] font-bold uppercase tracking-wider">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {history.map(w => (
                      <tr key={w.id} className="hover:bg-white/3">
                        <td className="px-5 py-3.5">
                          <p className="text-white/80 font-semibold text-sm">{w.customer_name}</p>
                          <p className="text-white/30 text-xs">{w.customer_email}</p>
                        </td>
                        <td className="px-4 py-3.5 font-bold text-white/70">{fmtXOF(w.amount)}</td>
                        <td className="px-4 py-3.5 text-white/40 text-xs">{METHOD_LABELS[w.method] || w.method}</td>
                        <td className="px-4 py-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            w.status === "paid"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}>
                            {w.status === "paid" ? "Versé" : "Rejeté"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-white/30 text-xs">{fmtDate(w.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
