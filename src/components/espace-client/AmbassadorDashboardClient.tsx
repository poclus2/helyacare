"use client";

import { useState } from "react";
import {
  Copy, Check, TrendingUp, Users, Wallet, Award,
  Clock, CheckCircle2, XCircle, ArrowUpRight, Share2,
  ChevronRight, Layers, Gift
} from "lucide-react";
import { Link } from "@/navigation";

// --- Types ---
interface Transaction {
  id: string;
  amount: number;
  status: "pending" | "available" | "paid";
  order_id: string;
  created_at?: string;
}

interface Downline {
  id: string;
  customer_id: string;
  referral_code: string;
  created_at?: string;
}

interface Stats {
  available_balance: number;
  pending_balance: number;
  paid_out: number;
  total_transactions: number;
  downline_count: number;
}

interface Props {
  balance: number;
  referralCode: string;
  downlines: Downline[];
  transactions: Transaction[];
  stats: Stats | null;
  inter: string;
  pjs: string;
}

// --- Helper ---
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

// --- Status Badge ---
function TxStatusBadge({ status }: { status: Transaction["status"] }) {
  const map = {
    pending: { label: "En attente", cls: "bg-amber-50 text-amber-600 border-amber-200", Icon: Clock },
    available: { label: "Disponible", cls: "bg-green-50 text-green-600 border-green-200", Icon: CheckCircle2 },
    paid: { label: "Versé", cls: "bg-blue-50 text-blue-600 border-blue-200", Icon: CheckCircle2 },
  };
  const { label, cls, Icon } = map[status] ?? map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${cls}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

// --- Grade logic ---
function getGrade(count: number) {
  if (count >= 50) return { label: "Diamant", level: 4, next: null, nextAt: null, color: "#60A5FA" };
  if (count >= 20) return { label: "Platine", level: 3, next: "Diamant", nextAt: 50, color: "#A78BFA" };
  if (count >= 5) return { label: "Or", level: 2, next: "Platine", nextAt: 20, color: "#F59E0B" };
  return { label: "Ambassadeur", level: 1, next: "Or", nextAt: 5, color: "#E56B2D" };
}

// --- Main Component ---
export default function AmbassadorDashboardClient({
  balance, referralCode, downlines, transactions, stats, inter, pjs
}: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"transactions" | "reseau">("transactions");

  const downlineCount = downlines.length;
  const grade = getGrade(downlineCount);
  const progressPct = grade.nextAt ? Math.min((downlineCount / grade.nextAt) * 100, 100) : 100;

  const availableBalance = stats?.available_balance ?? 0;
  const pendingBalance = stats?.pending_balance ?? 0;
  const paidOut = stats?.paid_out ?? 0;

  const referralLink =
    typeof window !== "undefined"
      ? `${window.location.origin}/ambassadeur?ref=${referralCode}`
      : `/ambassadeur?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-8 ${pjs}`}>

      {/* ── Header ── */}
      <div className="flex flex-col gap-1">
        <h1 className={`text-2xl font-bold text-[#0F3D3E] ${inter}`}>Réseau Ambassadeur</h1>
        <p className="text-gray-500 text-sm">Pilotez vos commissions et suivez la croissance de votre réseau.</p>
      </div>

      {/* ── KPI Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Solde total */}
        <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-[#0F3D3E] to-[#1a6566] rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 rounded-full" />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Wallet className="w-4 h-4 text-white/60" />
              <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Solde Total</p>
            </div>
            <p className={`text-3xl font-black text-white mb-1 ${inter}`}>{formatXOF(balance)}</p>
            <div className="flex items-center gap-1 text-[#CBF27A] text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              <span>Mise à jour en temps réel</span>
            </div>
          </div>
        </div>

        {/* Disponible */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Disponible</p>
          <p className={`text-2xl font-black text-green-600 ${inter}`}>{formatXOF(availableBalance)}</p>
          <p className="text-gray-400 text-[11px] mt-1">Prêt au retrait</p>
        </div>

        {/* En attente */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">En Attente</p>
          <p className={`text-2xl font-black text-amber-500 ${inter}`}>{formatXOF(pendingBalance)}</p>
          <p className="text-gray-400 text-[11px] mt-1">Fenêtre de vérification</p>
        </div>

        {/* Filleuls */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-5 shadow-sm">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-2">Filleuls</p>
          <p className={`text-2xl font-black text-[#0F3D3E] ${inter}`}>{downlineCount}</p>
          <p className="text-gray-400 text-[11px] mt-1">Ligne de front directe</p>
        </div>
      </div>

      {/* ── Grade + Referral Code ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Grade & Progression */}
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Grade Actuel</p>
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5" style={{ color: grade.color }} />
                <h3 className={`text-xl font-black text-[#0F3D3E] ${inter}`}>{grade.label}</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border" style={{ color: grade.color, borderColor: grade.color + "40", background: grade.color + "10" }}>
                  Niv. {grade.level}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Filleuls</p>
              <p className={`text-2xl font-black text-[#0F3D3E] ${inter}`}>{downlineCount}</p>
            </div>
          </div>

          {grade.next && grade.nextAt && (
            <div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>Progression vers <strong className="text-[#0F3D3E]">{grade.next}</strong></span>
                <span>{downlineCount} / {grade.nextAt} filleuls</span>
              </div>
              <div className="w-full h-2.5 bg-[#F2F0EB] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${progressPct}%`, background: `linear-gradient(to right, ${grade.color}, ${grade.color}99)` }}
                />
              </div>
              <p className="text-[11px] text-gray-400 mt-2">
                {grade.nextAt - downlineCount} filleul{grade.nextAt - downlineCount > 1 ? "s" : ""} supplémentaire{grade.nextAt - downlineCount > 1 ? "s" : ""} pour atteindre {grade.next}
              </p>
            </div>
          )}

          {!grade.next && (
            <div className="flex items-center gap-2 text-blue-600 text-sm font-semibold mt-2">
              <CheckCircle2 className="w-4 h-4" />
              Vous avez atteint le grade maximum — Diamant !
            </div>
          )}

          {/* Barème commissions */}
          <div className="mt-5 grid grid-cols-3 gap-2 pt-4 border-t border-[#E8E3DC]">
            {[
              { label: "Niveau 1", pct: "10%", sub: "Vos filleuls directs" },
              { label: "Niveau 2", pct: "5%", sub: "Filleuls de filleuls" },
              { label: "Niveau 3", pct: "2%", sub: "3ème génération" },
            ].map((tier) => (
              <div key={tier.label} className="text-center bg-[#F8FAFC] rounded-xl p-3">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide mb-1">{tier.label}</p>
                <p className={`text-xl font-black text-[#0F3D3E] ${inter}`}>{tier.pct}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{tier.sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Referral Code & Link */}
        <div className="bg-[#0F3D3E] rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -top-8 -right-8 w-40 h-40 bg-white/5 rounded-full" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#CBF27A]/5 rounded-full" />
          <div className="relative z-10 h-full flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Gift className="w-4 h-4 text-[#CBF27A]" />
                <p className="text-white/60 text-xs font-semibold uppercase tracking-widest">Votre Code de Parrainage</p>
              </div>
              <div className="bg-white/10 border border-white/20 rounded-xl px-5 py-4 mb-3">
                <p className={`text-3xl font-black text-[#CBF27A] tracking-widest font-mono ${inter}`}>{referralCode}</p>
              </div>
              <p className="text-white/40 text-xs">Partagez ce code pour recruter des ambassadeurs dans votre équipe.</p>
            </div>

            <div className="space-y-3">
              {/* Lien complet */}
              <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <p className="text-white/40 text-[10px] font-semibold uppercase mb-1">Lien d&apos;invitation</p>
                <p className="text-white/70 text-xs font-mono truncate">/ambassadeur?ref={referralCode}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleCopy}
                  className="flex items-center justify-center gap-2 py-3 bg-[#CBF27A] text-[#0F3D3E] rounded-xl text-sm font-bold hover:bg-[#d6f592] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copié !" : "Copier"}
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({ title: "HelyaCare Ambassadeur", url: referralLink });
                    }
                  }}
                  className="flex items-center justify-center gap-2 py-3 bg-white/10 text-white border border-white/20 rounded-xl text-sm font-bold hover:bg-white/20 transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  Partager
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Tabs: Transactions / Réseau ── */}
      <div className="bg-white border border-[#E8E3DC] rounded-2xl shadow-sm overflow-hidden">
        {/* Tab Headers */}
        <div className="flex border-b border-[#E8E3DC]">
          <button
            onClick={() => setActiveTab("transactions")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "transactions"
                ? "text-[#0F3D3E] border-b-2 border-[#0F3D3E]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Wallet className="w-4 h-4" />
            Historique des Commissions
            {transactions.length > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-[#F2F0EB] text-[#0F3D3E] text-[10px] font-bold rounded-full">
                {transactions.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("reseau")}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-colors ${
              activeTab === "reseau"
                ? "text-[#0F3D3E] border-b-2 border-[#0F3D3E]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            <Users className="w-4 h-4" />
            Mon Réseau
            {downlineCount > 0 && (
              <span className="ml-1 px-2 py-0.5 bg-[#F2F0EB] text-[#0F3D3E] text-[10px] font-bold rounded-full">
                {downlineCount}
              </span>
            )}
          </button>
        </div>

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            {transactions.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wallet className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className={`text-base font-bold text-[#0F3D3E] mb-2 ${inter}`}>Aucune commission pour l&apos;instant</h4>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  Vos commissions apparaîtront ici dès que vos filleuls passeront leurs premières commandes.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#F2F0EB]">
                {transactions.slice(0, 10).map((tx) => (
                  <div key={tx.id} className="px-6 py-4 flex items-center justify-between hover:bg-[#FAFAF9] transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        tx.status === "available" ? "bg-green-50" : tx.status === "paid" ? "bg-blue-50" : "bg-amber-50"
                      }`}>
                        <ArrowUpRight className={`w-5 h-5 ${
                          tx.status === "available" ? "text-green-500" : tx.status === "paid" ? "text-blue-500" : "text-amber-500"
                        }`} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#0F3D3E]">Commission — Commande #{tx.order_id?.slice(-8).toUpperCase() ?? "—"}</p>
                        <p className="text-xs text-gray-400">{formatDate((tx as any).created_at)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className={`font-black text-lg ${inter} ${
                        tx.status === "available" ? "text-green-600" : tx.status === "paid" ? "text-blue-600" : "text-amber-600"
                      }`}>
                        +{formatXOF(tx.amount)}
                      </p>
                      <TxStatusBadge status={tx.status} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Summary Footer */}
            {transactions.length > 0 && (
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E8E3DC] flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm">
                  <span className="text-gray-500">Total versé : <strong className="text-blue-600">{formatXOF(paidOut)}</strong></span>
                  <span className="text-gray-500">En attente : <strong className="text-amber-600">{formatXOF(pendingBalance)}</strong></span>
                </div>
                {transactions.length > 10 && (
                  <span className="text-[#E56B2D] text-sm font-semibold">{transactions.length - 10} de plus</span>
                )}
              </div>
            )}
          </div>
        )}

        {/* Réseau Tab */}
        {activeTab === "reseau" && (
          <div>
            {downlines.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-12 h-12 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-gray-400" />
                </div>
                <h4 className={`text-base font-bold text-[#0F3D3E] mb-2 ${inter}`}>Votre réseau est vide</h4>
                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">
                  Partagez votre code <strong className="text-[#0F3D3E] font-mono">{referralCode}</strong> pour recruter vos premiers filleuls.
                </p>
                <button
                  onClick={() => { navigator.clipboard.writeText(referralLink); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F3D3E] text-white rounded-xl text-sm font-semibold hover:bg-[#1a5556] transition-colors"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Lien copié !" : "Copier mon lien d'invitation"}
                </button>
              </div>
            ) : (
              <div>
                <div className="px-6 py-3 bg-[#F8FAFC] border-b border-[#E8E3DC] text-xs font-semibold text-gray-500 uppercase tracking-widest grid grid-cols-3">
                  <span>Code Ambassadeur</span>
                  <span className="text-center">Rejoint le</span>
                  <span className="text-right">Statut</span>
                </div>
                <div className="divide-y divide-[#F2F0EB]">
                  {downlines.map((dl) => (
                    <div key={dl.id} className="px-6 py-4 grid grid-cols-3 items-center hover:bg-[#FAFAF9] transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-[#F2F0EB] rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-[#0F3D3E]">
                            {dl.referral_code?.charAt(6) ?? "A"}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#0F3D3E] font-mono">{dl.referral_code}</p>
                          <p className="text-[11px] text-gray-400">Ligne de front</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 text-center">{formatDate((dl as any).created_at)}</p>
                      <div className="flex justify-end">
                        <span className="px-2.5 py-1 bg-green-50 text-green-600 border border-green-200 text-[11px] font-bold rounded-full">
                          Actif
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="px-6 py-4 border-t border-[#E8E3DC] flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    <strong className="text-[#0F3D3E]">{downlineCount}</strong> filleul{downlineCount > 1 ? "s" : ""} dans votre équipe directe
                  </p>
                  <div className="flex items-center gap-1.5 text-xs text-[#E56B2D] font-semibold cursor-pointer hover:underline">
                    <Layers className="w-3.5 h-3.5" />
                    Arbre complet (bientôt)
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="flex items-center justify-between bg-gradient-to-r from-[#F2F0EB] to-white border border-[#E8E3DC] rounded-2xl px-6 py-5">
        <div>
          <p className="text-sm font-semibold text-[#0F3D3E]">Besoin de retirer vos gains ?</p>
          <p className="text-xs text-gray-500 mt-0.5">Le virement est disponible dès 5 000 XOF de solde disponible.</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0F3D3E] text-white rounded-xl text-sm font-bold hover:bg-[#1a5556] transition-colors whitespace-nowrap">
          Demander un retrait
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
