"use client";

import { useState, useEffect } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import {
  Wallet, TrendingUp, Clock, CheckCircle2, AlertCircle,
  Loader2, Smartphone, Building2, X, Copy, Check,
  ArrowUpRight, ChevronRight, Gift
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

interface Commission {
  id: string;
  order_id: string;
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
  { id: "wave", label: "Wave", icon: Smartphone },
  { id: "orange_money", label: "Orange Money", icon: Smartphone },
  { id: "mtn_momo", label: "MTN MoMo", icon: Smartphone },
  { id: "bank", label: "Virement bancaire", icon: Building2 },
];

const MIN_WITHDRAWAL = 10_000;

function formatXOF(amount: number) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function StatusBadge({ status }: { status: Commission["status"] }) {
  const map = {
    pending: { label: "En attente", cls: "bg-amber-50 text-amber-600 border-amber-200", Icon: Clock },
    processing: { label: "En cours", cls: "bg-blue-50 text-blue-600 border-blue-200", Icon: Clock },
    paid: { label: "Versé", cls: "bg-green-50 text-green-600 border-green-200", Icon: CheckCircle2 },
  };
  const { label, cls, Icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

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
    setWithdrawing(true);
    setWithdrawResult(null);
    try {
      const res = await fetch("/api/ambassador/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ method, account_details: { phone, account_name: accountName } }),
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

  const canWithdraw = stats.pending >= MIN_WITHDRAWAL;

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

  return (
    <div className={`space-y-8 ${pjs.className}`}>

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Wallet Ambassadeur</h1>
        <p className="text-gray-500 text-sm">Suivez vos gains et demandez vos virements en quelques secondes.</p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Solde disponible — hero card */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#0F3D3E] to-[#1a6566] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-white/60" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Solde Disponible</p>
            </div>
            <p className={`text-3xl font-black text-white mb-1 ${inter.className}`}>{formatXOF(stats.pending)}</p>
            <div className="flex items-center gap-1 text-[#CBF27A] text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Prêt au retrait</span>
            </div>
          </div>
        </div>

        {/* Total gagné */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Total Gagné</p>
          <p className={`text-2xl font-black text-green-600 ${inter.className}`}>{formatXOF(stats.total)}</p>
          <p className="text-gray-400 text-[11px] mt-1">Depuis le début</p>
        </div>

        {/* Déjà versé */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Déjà Versé</p>
          <p className={`text-2xl font-black text-blue-600 ${inter.className}`}>{formatXOF(stats.paid)}</p>
          <p className="text-gray-400 text-[11px] mt-1">Virements traités</p>
        </div>
      </div>

      {/* ── Code parrainage + Retrait ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Code parrainage — même style que le bloc Réseau MLM */}
        {referralCode && (
          <div className="bg-[#0F3D3E] rounded-2xl p-6 shadow-lg relative overflow-hidden">
            <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#CBF27A]/5 rounded-full" />
            <div className="relative z-10 flex flex-col gap-5">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="w-4 h-4 text-[#CBF27A]" />
                  <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Votre Code de Parrainage</p>
                </div>
                <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 mb-3">
                  <p className={`text-3xl font-black text-[#CBF27A] tracking-widest font-mono ${inter.className}`}>
                    {referralCode}
                  </p>
                </div>
                <p className="text-white/40 text-xs">Partagez ce code pour recruter des filleuls et générer 10% + 5% de commissions.</p>
              </div>
              <button
                onClick={copyCode}
                className="flex items-center justify-center gap-2 py-3 bg-[#CBF27A] text-[#0F3D3E] rounded-xl text-sm font-bold hover:bg-[#d6f592] transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copié !" : "Copier le code"}
              </button>
            </div>
          </div>
        )}

        {/* Demande de retrait */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Retrait</p>
            <h3 className={`text-xl font-black text-[#0F3D3E] mb-1 ${inter.className}`}>
              {formatXOF(stats.pending)}
            </h3>
            <p className="text-gray-400 text-xs mb-5">
              {canWithdraw
                ? "Votre solde est suffisant pour un retrait."
                : `Minimum ${formatXOF(MIN_WITHDRAWAL)} requis — il vous manque ${formatXOF(MIN_WITHDRAWAL - stats.pending)}.`}
            </p>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.id}
                  onClick={() => setMethod(pm.id)}
                  className={`p-3 rounded-xl border text-sm font-semibold transition-all flex items-center gap-2 ${
                    method === pm.id
                      ? "border-[#0F3D3E] bg-[#0F3D3E] text-white"
                      : "border-[#E8E3DC] text-gray-600 hover:border-gray-300 bg-[#F8FAFC]"
                  }`}
                >
                  <pm.icon className="w-4 h-4" />
                  <span className="truncate">{pm.label}</span>
                </button>
              ))}
            </div>

            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder={method === "bank" ? "IBAN ou numéro de compte" : "+221 77 000 00 00"}
              className="w-full bg-[#F8FAFC] border border-[#E8E3DC] rounded-xl px-4 py-3 text-sm text-[#0F3D3E] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]/20 mb-3"
            />
            <input
              value={accountName}
              onChange={e => setAccountName(e.target.value)}
              placeholder="Nom du titulaire du compte"
              className="w-full bg-[#F8FAFC] border border-[#E8E3DC] rounded-xl px-4 py-3 text-sm text-[#0F3D3E] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]/20"
            />
          </div>

          <button
            onClick={() => { setShowModal(true); setWithdrawResult(null); }}
            disabled={!canWithdraw || !phone}
            className={`mt-5 flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-bold transition-all ${
              canWithdraw && phone
                ? "bg-[#0F3D3E] text-white hover:bg-[#1a5556]"
                : "bg-[#F2F0EB] text-gray-400 cursor-not-allowed"
            }`}
          >
            Demander un retrait
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ── Historique des commissions ── */}
      <div className="bg-white border border-[#E8E3DC] rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-[#E8E3DC] flex items-center gap-3">
          <Wallet className="w-4 h-4 text-[#0F3D3E]" />
          <h2 className={`text-sm font-semibold text-[#0F3D3E] ${inter.className}`}>
            Historique des Commissions
          </h2>
          {commissions.length > 0 && (
            <span className="px-2 py-0.5 bg-[#F2F0EB] text-[#0F3D3E] text-[10px] font-bold rounded-full">
              {commissions.length}
            </span>
          )}
        </div>

        {commissions.length === 0 ? (
          <div className="py-16 text-center">
            <div className="w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className={`text-base font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>Aucune commission pour l&apos;instant</h4>
            <p className="text-gray-400 text-sm max-w-sm mx-auto">
              Vos commissions apparaîtront ici dès que vos filleuls passeront leurs premières commandes.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#F2F0EB]">
            {commissions.map(c => (
              <div key={c.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    c.status === "paid" ? "bg-green-50" : c.status === "processing" ? "bg-blue-50" : "bg-amber-50"
                  }`}>
                    <ArrowUpRight className={`w-5 h-5 ${
                      c.status === "paid" ? "text-green-500" : c.status === "processing" ? "text-blue-500" : "text-amber-500"
                    }`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0F3D3E]">
                      Commission Niv.{c.level} — Commande #{c.order_id?.slice(-8).toUpperCase() ?? "—"}
                    </p>
                    <p className="text-xs text-gray-400">{formatDate(c.created_at)} · Taux {(c.rate * 100).toFixed(0)}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className={`font-black text-lg ${inter.className} ${
                    c.status === "paid" ? "text-green-600" : c.status === "processing" ? "text-blue-600" : "text-amber-600"
                  }`}>
                    +{formatXOF(c.amount)}
                  </p>
                  <StatusBadge status={c.status} />
                </div>
              </div>
            ))}
          </div>
        )}

        {commissions.length > 0 && (
          <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E8E3DC] flex items-center justify-between">
            <div className="flex items-center gap-6 text-sm">
              <span className="text-gray-500">Total versé : <strong className="text-blue-600">{formatXOF(stats.paid)}</strong></span>
              <span className="text-gray-500">Disponible : <strong className="text-amber-600">{formatXOF(stats.pending)}</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* ── Modal confirmation retrait ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8 border border-[#E8E3DC]">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-bold text-[#0F3D3E] ${inter.className}`}>Confirmer le retrait</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {withdrawResult ? (
              <div className={`text-center py-4 ${withdrawResult.success ? "text-green-600" : "text-red-600"}`}>
                {withdrawResult.success
                  ? <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-green-500" />
                  : <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
                }
                <p className={`font-bold text-lg mb-2 ${inter.className}`}>
                  {withdrawResult.success ? "Demande envoyée !" : "Erreur"}
                </p>
                <p className="text-sm text-gray-500">{withdrawResult.message || withdrawResult.error}</p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-6 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl font-bold text-sm hover:bg-[#1a5556] transition-colors"
                >
                  Fermer
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#F2F0EB] rounded-2xl p-5 mb-6">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Montant à retirer</p>
                  <p className={`text-3xl font-black text-[#0F3D3E] ${inter.className}`}>{formatXOF(stats.pending)}</p>
                  <p className="text-xs text-gray-500 mt-1">via {PAYMENT_METHODS.find(m => m.id === method)?.label} · {phone}</p>
                </div>
                <p className="text-xs text-gray-400 mb-6">
                  ⚠️ Traitement sous 24–48h ouvrés. L&apos;équipe HelyaCare vérifie chaque demande avant versement.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-3 border border-[#E8E3DC] text-gray-600 font-bold text-sm rounded-xl hover:bg-[#F2F0EB] transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleWithdraw}
                    disabled={withdrawing}
                    className="flex-1 py-3 bg-[#0F3D3E] text-white font-bold text-sm rounded-xl hover:bg-[#1a5556] transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {withdrawing ? <><Loader2 className="w-4 h-4 animate-spin" /> Traitement...</> : "Confirmer"}
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
