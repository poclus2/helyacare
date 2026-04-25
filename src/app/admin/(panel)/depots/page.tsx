"use client";

import { useEffect, useState, useCallback } from "react";
import { Inter } from "next/font/google";
import {
  Loader2, CreditCard, CheckCircle2, XCircle, RefreshCcw,
  Smartphone, Building2, Clock, AlertCircle, TrendingUp,
  Search, Filter, ChevronDown, Banknote, Copy, Check
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const fmtXOF = (n: number) => `${n.toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });

const METHOD_META: Record<string, { label: string; icon: string; color: string }> = {
  wave:         { label: "Wave",          icon: "🌊", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  orange_money: { label: "Orange Money",  icon: "🍊", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  mtn_momo:     { label: "MTN MoMo",     icon: "📱", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  bank:         { label: "Virement",      icon: "🏦", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  other:        { label: "Autre",         icon: "💳", color: "text-white/50 bg-white/5 border-white/10" },
};

const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
  pending:  { label: "En attente",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20", dot: "bg-orange-400 animate-pulse" },
  approved: { label: "Approuvé",   color: "text-green-400 bg-green-400/10 border-green-400/20",   dot: "bg-green-400" },
  rejected: { label: "Rejeté",     color: "text-red-400 bg-red-400/10 border-red-400/20",         dot: "bg-red-400" },
};

interface DepositRequest {
  id: string; customer_id: string; customer_name: string; customer_email: string;
  customer_phone: string; amount: number; currency: string; method: string;
  reference_code: string; payer_phone?: string; notes?: string;
  status: "pending" | "approved" | "rejected"; created_at: string; processed_at?: string;
}

interface Stats {
  total: number; pending: number; approved: number; rejected: number; total_volume: number;
}

export default function AdminDepositsPage() {
  const [deposits, setDeposits] = useState<DepositRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [actionResult, setActionResult] = useState<{ id: string; type: "success" | "error"; msg: string } | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("pending");
  const [search, setSearch] = useState("");
  const [rejectModal, setRejectModal] = useState<{ deposit: DepositRequest } | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = statusFilter && statusFilter !== "all" ? `?status=${statusFilter}` : "";
      const res = await fetch(`/api/admin/deposits${params}`);
      if (res.ok) {
        const data = await res.json();
        setDeposits(data.deposits || []);
        setStats(data.stats || null);
      }
    } catch {}
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (deposit: DepositRequest, action: "approve" | "reject", reason?: string) => {
    setProcessing(deposit.id);
    setActionResult(null);
    try {
      const res = await fetch("/api/admin/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deposit_id: deposit.id,
          customer_id: deposit.customer_id,
          action,
          reject_reason: reason,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setActionResult({
          id: deposit.id,
          type: "success",
          msg: action === "approve"
            ? `✅ Dépôt approuvé — ${fmtXOF(deposit.amount)} crédité sur le wallet`
            : `❌ Dépôt rejeté${reason ? ` : ${reason}` : ""}`,
        });
        setRejectModal(null);
        setRejectReason("");
        await load();
      } else {
        throw new Error(data.error || "Erreur inconnue");
      }
    } catch (err: any) {
      setActionResult({ id: deposit.id, type: "error", msg: err.message });
    } finally {
      setProcessing(null);
    }
  };

  const copyRef = (ref: string) => {
    navigator.clipboard.writeText(ref);
    setCopied(ref);
    setTimeout(() => setCopied(null), 2000);
  };

  const filtered = deposits.filter((d) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      d.customer_name.toLowerCase().includes(q) ||
      d.customer_email.toLowerCase().includes(q) ||
      d.reference_code.toLowerCase().includes(q)
    );
  });

  return (
    <div className={`space-y-8 ${inter.className}`}>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Dépôts Manuels</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {stats ? `${stats.pending} en attente · ${stats.approved} approuvés · Volume total : ${fmtXOF(stats.total_volume)}` : "Chargement..."}
          </p>
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10">
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* KPI Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "En attente", value: stats.pending, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-400/20", alert: stats.pending > 0 },
            { label: "Approuvés", value: stats.approved, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
            { label: "Rejetés", value: stats.rejected, color: "text-red-400", bg: "bg-red-400/10", border: "border-red-400/20" },
            { label: "Volume validé", value: fmtXOF(stats.total_volume), color: "text-[#CBF27A]", bg: "bg-[#CBF27A]/10", border: "border-[#CBF27A]/20" },
          ].map(({ label, value, color, bg, border, alert }) => (
            <div key={label} className={`${bg} border ${border} rounded-2xl p-5 relative`}>
              {alert && <span className="absolute top-3 right-3 w-2 h-2 bg-orange-400 rounded-full animate-pulse" />}
              <p className="text-white/40 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
              <p className={`text-2xl font-extrabold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher client, référence..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:border-[#CBF27A]/50"
          />
        </div>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                statusFilter === s
                  ? "bg-[#CBF27A] text-[#0F3D3E] border-[#CBF27A]"
                  : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {s === "all" ? "Tous" : s === "pending" ? "En attente" : s === "approved" ? "Approuvés" : "Rejetés"}
            </button>
          ))}
        </div>
      </div>

      {/* Global action result */}
      {actionResult && !deposits.find(d => d.id === actionResult.id && d.status === "pending") && (
        <div className={`px-5 py-4 rounded-xl text-sm font-semibold border ${
          actionResult.type === "success"
            ? "bg-green-500/10 text-green-400 border-green-500/20"
            : "bg-red-500/10 text-red-400 border-red-500/20"
        }`}>
          {actionResult.msg}
        </div>
      )}

      {/* Liste des dépôts */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-16 text-center">
          <CreditCard className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/30 text-sm">
            {search ? "Aucun résultat pour cette recherche" : "Aucun dépôt dans cette catégorie"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((dep) => {
            const method = METHOD_META[dep.method] || METHOD_META.other;
            const status = STATUS_META[dep.status];
            const isPending = dep.status === "pending";

            return (
              <div
                key={dep.id}
                className={`bg-white/3 border rounded-2xl p-6 transition-all ${
                  isPending ? "border-orange-500/25 hover:border-orange-500/40" : "border-white/8"
                }`}
              >
                {/* Feedback action */}
                {actionResult?.id === dep.id && (
                  <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-semibold border ${
                    actionResult.type === "success"
                      ? "bg-green-500/10 text-green-400 border-green-500/20"
                      : "bg-red-500/10 text-red-400 border-red-500/20"
                  }`}>
                    {actionResult.msg}
                  </div>
                )}

                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">

                  {/* Infos client + dépôt */}
                  <div className="flex gap-4 items-start flex-1">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 ${method.color.split(" ").slice(1).join(" ")}`}>
                      {method.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <p className="text-white font-bold text-base">{dep.customer_name}</p>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${status.color}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                      <p className="text-white/40 text-xs mb-3">{dep.customer_email}</p>

                      <div className="flex flex-wrap gap-3 items-center">
                        <span className="text-2xl font-extrabold text-[#CBF27A]">
                          {fmtXOF(dep.amount)}
                        </span>
                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full border ${method.color}`}>
                          {method.label}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1.5 text-xs text-white/40">
                        {dep.payer_phone && (
                          <p className="flex items-center gap-1.5">
                            <Smartphone className="w-3.5 h-3.5" />
                            Expéditeur : {dep.payer_phone}
                          </p>
                        )}
                        {dep.notes && (
                          <p className="flex items-center gap-1.5">
                            <AlertCircle className="w-3.5 h-3.5" />
                            {dep.notes}
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{fmtDate(dep.created_at)}</span>
                          <span className="text-white/20">·</span>
                          <span className="font-mono text-[#CBF27A]/70">Réf : {dep.reference_code}</span>
                          <button
                            onClick={() => copyRef(dep.reference_code)}
                            className="hover:text-white transition-colors"
                            title="Copier la référence"
                          >
                            {copied === dep.reference_code ? (
                              <Check className="w-3 h-3 text-green-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        {dep.processed_at && (
                          <p>Traité le {fmtDate(dep.processed_at)}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions (seulement si pending) */}
                  {isPending && (
                    <div className="flex gap-3 shrink-0 self-start">
                      <button
                        onClick={() => handleAction(dep, "approve")}
                        disabled={processing === dep.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 font-bold text-sm rounded-xl border border-green-500/20 transition-all disabled:opacity-50"
                      >
                        {processing === dep.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-4 h-4" />
                        )}
                        Approuver
                      </button>
                      <button
                        onClick={() => setRejectModal({ deposit: dep })}
                        disabled={processing === dep.id}
                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold text-sm rounded-xl border border-red-500/20 transition-all disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal de rejet */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#0D1B2E] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h3 className="text-white font-bold text-lg mb-2">Rejeter ce dépôt ?</h3>
            <p className="text-white/50 text-sm mb-6">
              Dépôt de <strong className="text-orange-400">{fmtXOF(rejectModal.deposit.amount)}</strong> de{" "}
              <strong className="text-white">{rejectModal.deposit.customer_name}</strong>
            </p>
            <div className="mb-5">
              <label className="block text-xs font-bold text-white/40 uppercase tracking-wider mb-2">
                Motif du rejet (optionnel)
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ex: Référence non trouvée dans notre historique de paiements"
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm placeholder-white/20 focus:outline-none focus:border-red-400/50 resize-none"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => { setRejectModal(null); setRejectReason(""); }}
                className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white/60 font-bold text-sm rounded-xl border border-white/10 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => handleAction(rejectModal.deposit, "reject", rejectReason)}
                disabled={processing === rejectModal.deposit.id}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-sm rounded-xl border border-red-500/30 transition-all disabled:opacity-50"
              >
                {processing === rejectModal.deposit.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <XCircle className="w-4 h-4" />
                )}
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
