"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";
import {
  Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle,
  ChevronRight, Loader2, Smartphone, CreditCard, Building2, X
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

interface Commission {
  id: string;
  order_id: string;
  buyer_id: string;
  level: number;
  amount: number;
  currency: string;
  rate: number;
  status: "pending" | "paid" | "processing";
  created_at: string;
}

interface WithdrawStats {
  pending: number;
  paid: number;
  total: number;
}

interface Props {
  token?: string;
}

const PAYMENT_METHODS = [
  { id: "wave", label: "Wave", icon: Smartphone, color: "bg-blue-500" },
  { id: "orange_money", label: "Orange Money", icon: Smartphone, color: "bg-orange-500" },
  { id: "mtn_momo", label: "MTN MoMo", icon: Smartphone, color: "bg-yellow-500" },
  { id: "bank", label: "Virement bancaire", icon: Building2, color: "bg-gray-500" },
];

const MIN_WITHDRAWAL = 10_000;

export default function WithdrawPanel({ token }: Props) {
  const [stats, setStats] = useState<WithdrawStats>({ pending: 0, paid: 0, total: 0 });
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [method, setMethod] = useState("wave");
  const [phone, setPhone] = useState("");
  const [accountName, setAccountName] = useState("");
  const [withdrawing, setWithdrawing] = useState(false);
  const [withdrawResult, setWithdrawResult] = useState<{ success?: boolean; message?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const load = async () => {
    if (!token) { setLoading(false); return; }
    try {
      const res = await fetch("/api/ambassador/commissions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data.balance || { pending: 0, paid: 0, total: 0 });
        setCommissions(data.commissions || []);
        setReferralCode(data.referral_code);
      }
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [token]);

  const handleWithdraw = async () => {
    if (!phone && method !== "bank") return;
    setWithdrawing(true);
    setWithdrawResult(null);
    try {
      const res = await fetch("/api/ambassador/withdraw", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          method,
          account_details: {
            phone,
            account_name: accountName,
          },
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setWithdrawResult({ success: true, message: data.message });
        await load();
      } else {
        setWithdrawResult({ success: false, error: data.error });
      }
    } catch {
      setWithdrawResult({ success: false, error: "Erreur réseau. Veuillez réessayer." });
    } finally {
      setWithdrawing(false);
    }
  };

  const copyCode = () => {
    if (!referralCode) return;
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const fmtXOF = (n: number) =>
    `${n.toLocaleString("fr-FR")} XOF`;

  if (!token) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        Connectez-vous pour accéder à votre wallet ambassadeur.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-[#0F3D3E] animate-spin" />
      </div>
    );
  }

  const canWithdraw = stats.pending >= MIN_WITHDRAWAL;

  return (
    <div className={`space-y-6 ${inter.className}`}>

      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-[#0F3D3E]">Wallet Ambassadeur</h2>
        <p className="text-sm text-gray-500 mt-0.5">Vos commissions MLM et demandes de retrait</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Solde disponible", value: fmtXOF(stats.pending), icon: Wallet, color: "text-[#E56B2D]", bg: "bg-orange-50" },
          { label: "Total gagné", value: fmtXOF(stats.total), icon: TrendingUp, color: "text-green-600", bg: "bg-green-50" },
          { label: "Déjà versé", value: fmtXOF(stats.paid), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`${bg} p-5 rounded-2xl border border-opacity-20`}>
            <div className="flex items-center gap-2 mb-2">
              <Icon className={`w-4 h-4 ${color}`} />
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
            </div>
            <p className={`text-2xl font-black ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Bouton Retrait */}
      <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold text-[#0F3D3E] mb-1">Demander un retrait</h3>
            <p className="text-sm text-gray-500">
              Minimum : {fmtXOF(MIN_WITHDRAWAL)} · Via Wave, Orange Money, MTN MoMo ou virement
            </p>
            {!canWithdraw && stats.pending > 0 && (
              <p className="text-xs text-amber-600 mt-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Il vous manque {fmtXOF(MIN_WITHDRAWAL - stats.pending)} pour atteindre le minimum
              </p>
            )}
          </div>
          <button
            onClick={() => { setShowModal(true); setWithdrawResult(null); }}
            disabled={!canWithdraw}
            className={`shrink-0 flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-xl transition-all ${
              canWithdraw
                ? "bg-[#E56B2D] text-white hover:bg-[#cf5c22] shadow-lg"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            <Wallet className="w-4 h-4" /> Retirer
          </button>
        </div>
      </div>

      {/* Code parrainage */}
      {referralCode && (
        <div className="bg-[#0F3D3E] rounded-2xl p-6 text-white">
          <p className="text-xs font-bold text-[#CBF27A] uppercase tracking-widest mb-2">Votre code parrainage</p>
          <div className="flex items-center gap-3">
            <code className="text-xl font-black tracking-widest text-[#CBF27A]">{referralCode}</code>
            <button onClick={copyCode}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-lg transition-colors">
              {copied ? "✓ Copié !" : "Copier"}
            </button>
          </div>
          <p className="text-white/60 text-xs mt-2">Partagez ce code pour gagner 10% sur les ventes de votre filleul et 5% sur le niveau 2.</p>
        </div>
      )}

      {/* Historique commissions */}
      <div>
        <h3 className="font-bold text-[#0F3D3E] mb-4">Historique des commissions</h3>
        {commissions.length === 0 ? (
          <div className="text-center py-12 bg-white border border-dashed border-[#E8E3DC] rounded-2xl">
            <TrendingUp className="w-8 h-8 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Aucune commission pour l'instant.</p>
            <p className="text-gray-400 text-xs mt-1">Partagez votre code pour commencer à gagner.</p>
          </div>
        ) : (
          <div className="bg-white border border-[#E8E3DC] rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-[#F8FAFC] border-b border-[#E8E3DC]">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Commande</th>
                  <th className="text-center px-4 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Niveau</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Commission</th>
                  <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wide">Statut</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E3DC]">
                {commissions.map(c => (
                  <tr key={c.id} className="hover:bg-[#FAFAF9]">
                    <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                      #{c.order_id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-4 py-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        c.level === 1 ? "bg-orange-50 text-orange-600" : "bg-purple-50 text-purple-600"
                      }`}>
                        Niv. {c.level} · {(c.rate * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right font-black text-[#0F3D3E]">
                      +{fmtXOF(c.amount)}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        c.status === "paid" ? "bg-green-50 text-green-700" :
                        c.status === "processing" ? "bg-blue-50 text-blue-700" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {c.status === "paid" && <CheckCircle2 className="w-3 h-3" />}
                        {c.status === "processing" && <Clock className="w-3 h-3" />}
                        {c.status === "pending" && <AlertCircle className="w-3 h-3" />}
                        {c.status === "paid" ? "Versé" : c.status === "processing" ? "En cours" : "En attente"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Retrait */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-[#0F3D3E]">Demande de retrait</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawResult ? (
              <div className={`text-center py-6 ${withdrawResult.success ? "text-green-600" : "text-red-600"}`}>
                {withdrawResult.success
                  ? <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  : <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
                }
                <p className="font-bold text-lg mb-2">
                  {withdrawResult.success ? "Demande envoyée !" : "Erreur"}
                </p>
                <p className="text-sm text-gray-500">
                  {withdrawResult.message || withdrawResult.error}
                </p>
                <button onClick={() => setShowModal(false)}
                  className="mt-6 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-bold text-sm hover:bg-[#1a5556]">
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#F2F0EB] rounded-2xl p-4 mb-6">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Montant à retirer</p>
                  <p className="text-3xl font-black text-[#0F3D3E]">{fmtXOF(stats.pending)}</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      Méthode de paiement
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {PAYMENT_METHODS.map(pm => (
                        <button key={pm.id} onClick={() => setMethod(pm.id)}
                          className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                            method === pm.id
                              ? "border-[#0F3D3E] bg-[#0F3D3E] text-white"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                          <pm.icon className="w-4 h-4" />
                          {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      {method === "bank" ? "IBAN / Compte bancaire" : "Numéro de téléphone"}
                    </label>
                    <input value={phone} onChange={e => setPhone(e.target.value)}
                      placeholder={method === "bank" ? "SNXXXXXX..." : "+221 77 000 00 00"}
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 block">
                      Nom du titulaire du compte
                    </label>
                    <input value={accountName} onChange={e => setAccountName(e.target.value)}
                      placeholder="Aminata Diallo"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                  </div>

                  <p className="text-xs text-gray-400">
                    ⚠️ Traitement sous 24-48h ouvrés. L'équipe HelyaCare vérifie chaque demande avant versement.
                  </p>

                  <button onClick={handleWithdraw} disabled={withdrawing || (!phone && method !== "bank")}
                    className="w-full py-4 bg-[#E56B2D] text-white font-bold text-sm rounded-xl hover:bg-[#cf5c22] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {withdrawing ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement...</> : <><Wallet className="w-4 h-4" /> Confirmer le retrait</>}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
