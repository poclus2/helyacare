"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { Inter } from "next/font/google";
import {
  Loader2, Search, ShoppingBag, RefreshCcw, CreditCard, Smartphone,
  CheckCircle2, Clock, XCircle, Package, Truck, MapPin, AlertCircle,
  X, ChevronRight, Bell, BellOff, FileText, TrendingUp, PackageCheck,
  ClipboardList, Banknote, Tag, User, Calendar, Hash, ExternalLink,
  ChevronDown, ChevronUp
} from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const fmtXOF = (n: number) => `${n.toLocaleString("fr-FR")} XOF`;
const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const METHOD_META: Record<string, { label: string; icon: string; color: string }> = {
  tara_card:    { label: "Carte bancaire",  icon: "💳", color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
  tara:         { label: "Mobile Money", icon: "📱", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  wave:         { label: "Wave",         icon: "🌊", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  orange_money: { label: "Orange Money", icon: "🍊", color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  mtn_momo:    { label: "MTN MoMo",     icon: "📱", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  bank:         { label: "Virement",     icon: "🏦", color: "text-indigo-400 bg-indigo-400/10 border-indigo-400/20" },
  other:        { label: "Autre",        icon: "💸", color: "text-white/50 bg-white/5 border-white/10" },
};

const FULFILL_META: Record<string, { label: string; color: string; icon: React.ReactNode; step: number }> = {
  not_fulfilled: { label: "À préparer",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20", icon: <Package className="w-3 h-3" />, step: 1 },
  shipped:       { label: "Expédié",     color: "text-blue-400 bg-blue-400/10 border-blue-400/20",   icon: <Truck className="w-3 h-3" />, step: 2 },
  delivered:     { label: "Livré",       color: "text-green-400 bg-green-400/10 border-green-400/20", icon: <CheckCircle2 className="w-3 h-3" />, step: 3 },
};

const PAY_META: Record<string, { label: string; color: string }> = {
  captured:          { label: "Payé",        color: "text-green-400 bg-green-400/10 border-green-400/20" },
  approved:          { label: "Approuvé",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
  pending:           { label: "En attente",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  awaiting_payment:  { label: "En attente",  color: "text-orange-400 bg-orange-400/10 border-orange-400/20" },
  rejected:          { label: "Rejeté",      color: "text-red-400 bg-red-400/10 border-red-400/20" },
  cancelled:         { label: "Annulé",      color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

interface UnifiedOrder {
  id: string;
  display_id?: string | number;
  email: string;
  customer_name?: string;
  customer_phone?: string;
  items: { title: string; quantity: number; unit_price: number }[];
  items_label: string;
  amount: number;
  payment_method: string;
  payment_status: string;
  fulfillment_status?: string;
  tracking_number?: string;
  carrier?: string;
  admin_note?: string;
  shipped_at?: string;
  delivered_at?: string;
  created_at: string;
  reference_code?: string;
  source: "medusa" | "manual";
  customer_id?: string;
}

// ── Timeline Step ─────────────────────────────────────────────────────────────
function TimelineStep({ label, date, done, active }: { label: string; date?: string; done: boolean; active: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
        done ? "bg-green-500 border-green-500" : active ? "bg-[#CBF27A] border-[#CBF27A]" : "bg-white/5 border-white/10"
      }`}>
        {done ? <CheckCircle2 className="w-3.5 h-3.5 text-white" /> : active ? <div className="w-2 h-2 bg-[#0F3D3E] rounded-full" /> : <div className="w-2 h-2 bg-white/20 rounded-full" />}
      </div>
      <div className="pb-5 border-l border-white/5 pl-4 flex-1 -mt-1">
        <p className={`text-sm font-bold ${done || active ? "text-white" : "text-white/30"}`}>{label}</p>
        {date && <p className="text-xs text-white/30 mt-0.5">{fmtDate(date)}</p>}
      </div>
    </div>
  );
}

// ── Order Card ────────────────────────────────────────────────────────────────
function OrderCard({
  order,
  onOpenDetail,
  onQuickAction,
  actionLoading,
}: {
  order: UnifiedOrder;
  onOpenDetail: (o: UnifiedOrder) => void;
  onQuickAction: (o: UnifiedOrder, status: string) => void;
  actionLoading: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const method = METHOD_META[order.payment_method] || METHOD_META.other;
  const fulfill = FULFILL_META[order.fulfillment_status || "not_fulfilled"];
  const pay = PAY_META[order.payment_status] || { label: order.payment_status, color: "text-white/40 bg-white/5 border-white/10" };
  const isPaid = ["captured", "approved"].includes(order.payment_status);
  const isLoading = actionLoading === order.id;

  const ref = order.reference_code || (order.display_id ? `#HC-${order.display_id}` : `#${order.id.slice(-6).toUpperCase()}`);

  return (
    <div className={`bg-white/[0.03] border rounded-2xl overflow-hidden transition-all ${
      isPaid && order.fulfillment_status === "not_fulfilled"
        ? "border-orange-500/25 hover:border-orange-500/40"
        : order.fulfillment_status === "shipped"
        ? "border-blue-500/20 hover:border-blue-500/35"
        : order.fulfillment_status === "delivered"
        ? "border-green-500/15 hover:border-green-500/30"
        : "border-white/8 hover:border-white/15"
    }`}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base shrink-0 ${method.color.split(" ").slice(1).join(" ")}`}>
            {method.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-white/60 text-xs">{ref}</span>
              {order.source === "manual" && (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-400/10 text-blue-400 border border-blue-400/20 uppercase tracking-wide">Manuel</span>
              )}
            </div>
            <p className="text-white/30 text-[11px] mt-0.5">{fmtDateShort(order.created_at)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold border ${fulfill.color}`}>
            {fulfill.icon}
            {fulfill.label}
          </span>
          <button
            onClick={() => onOpenDetail(order)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
            title="Voir le détail"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main body */}
      <div className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-start gap-4 justify-between">

          {/* Left: Client + items */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                <User className="w-3.5 h-3.5 text-white/40" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">{order.customer_name || "—"}</p>
                <p className="text-white/40 text-[11px] mt-0.5">{order.email}</p>
              </div>
            </div>

            {/* Articles */}
            {order.items && order.items.length > 0 ? (
              <div className="bg-white/[0.03] rounded-xl overflow-hidden border border-white/5">
                <button
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors"
                  onClick={() => setExpanded(!expanded)}
                >
                  <span className="text-white/50 text-xs font-semibold">
                    {order.items.length} article{order.items.length > 1 ? "s" : ""} · {order.items_label}
                  </span>
                  {expanded ? <ChevronUp className="w-3.5 h-3.5 text-white/30" /> : <ChevronDown className="w-3.5 h-3.5 text-white/30" />}
                </button>
                {expanded && (
                  <div className="border-t border-white/5 divide-y divide-white/5">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center justify-between px-4 py-2.5 text-xs">
                        <span className="text-white/70">{item.title} <span className="text-white/30">× {item.quantity}</span></span>
                        <span className="text-[#CBF27A] font-bold">{fmtXOF(item.unit_price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-white/30 text-xs italic">{order.items_label}</p>
            )}

            {/* Tracking info */}
            {order.tracking_number && (
              <div className="mt-3 flex items-center gap-2 text-xs text-blue-400">
                <Truck className="w-3.5 h-3.5" />
                <span>{order.carrier ? `${order.carrier} · ` : ""}{order.tracking_number}</span>
              </div>
            )}
          </div>

          {/* Right: Amount + actions */}
          <div className="flex flex-col items-end gap-3 shrink-0">
            <div className="text-right">
              <p className="text-2xl font-extrabold text-[#CBF27A]">{fmtXOF(order.amount)}</p>
              <div className="flex items-center gap-1.5 justify-end mt-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${pay.color}`}>
                  {pay.label}
                </span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${method.color}`}>
                  {method.label}
                </span>
              </div>
            </div>

            {/* Quick actions */}
            {isPaid && (
              <div className="flex flex-col gap-2 items-end">
                {order.fulfillment_status === "not_fulfilled" && (
                  <button
                    onClick={() => onOpenDetail(order)}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 text-xs font-bold rounded-xl border border-blue-500/25 transition-all"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Truck className="w-3.5 h-3.5" />}
                    Marquer expédié
                  </button>
                )}
                {order.fulfillment_status === "shipped" && (
                  <button
                    onClick={() => onQuickAction(order, "delivered")}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500/15 hover:bg-green-500/25 text-green-400 text-xs font-bold rounded-xl border border-green-500/25 transition-all"
                  >
                    {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <PackageCheck className="w-3.5 h-3.5" />}
                    Confirmer livraison
                  </button>
                )}
                {order.fulfillment_status === "delivered" && (
                  <div className="flex items-center gap-1.5 text-green-400 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Livraison confirmée
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Slide-Over Detail Panel ───────────────────────────────────────────────────
function DetailPanel({
  order,
  onClose,
  onUpdate,
}: {
  order: UnifiedOrder;
  onClose: () => void;
  onUpdate: () => void;
}) {
  const [status, setStatus] = useState(order.fulfillment_status || "not_fulfilled");
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  const [carrier, setCarrier] = useState(order.carrier || "");
  const [adminNote, setAdminNote] = useState(order.admin_note || "");
  const [notifyCustomer, setNotifyCustomer] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const ref = order.reference_code || (order.display_id ? `#HC-${order.display_id}` : `#${order.id.slice(-6).toUpperCase()}`);
  const fulfill = FULFILL_META[order.fulfillment_status || "not_fulfilled"];
  const pay = PAY_META[order.payment_status] || { label: order.payment_status, color: "text-white/40 bg-white/5 border-white/10" };
  const isPaid = ["captured", "approved"].includes(order.payment_status);

  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/commandes/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: order.source,
          status,
          customer_id: order.customer_id,
          tracking_number: trackingNumber || undefined,
          carrier: carrier || undefined,
          admin_note: adminNote,
          notify_customer: notifyCustomer && status === "shipped",
          customer_email: order.email,
          customer_name: order.customer_name,
          order_ref: ref,
          amount: order.amount,
        }),
      });
      if (res.ok) {
        setFeedback({ type: "success", msg: "Commande mise à jour avec succès !" });
        onUpdate();
      } else {
        const d = await res.json();
        setFeedback({ type: "error", msg: d.error || "Erreur lors de la mise à jour" });
      }
    } catch {
      setFeedback({ type: "error", msg: "Erreur réseau" });
    }
    setSaving(false);
  };

  // Timeline steps
  const isPending = order.payment_status === "pending" || order.payment_status === "awaiting_payment";
  const steps = [
    { label: "Commande passée", date: order.created_at, done: true, active: false },
    { label: "Paiement confirmé", date: isPaid ? order.created_at : undefined, done: isPaid, active: !isPaid && !isPending },
    { label: "En cours de préparation", date: isPaid ? order.created_at : undefined, done: isPaid && order.fulfillment_status !== "not_fulfilled", active: isPaid && order.fulfillment_status === "not_fulfilled" },
    { label: "Expédiée", date: order.shipped_at, done: !!order.shipped_at, active: order.fulfillment_status === "shipped" && !order.delivered_at },
    { label: "Livrée", date: order.delivered_at, done: !!order.delivered_at, active: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className={`w-full max-w-lg bg-[#0D1B2E] border-l border-white/10 flex flex-col h-full overflow-hidden shadow-2xl ${inter.className}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-white">Détail commande</h2>
            <p className="text-white/40 text-sm mt-0.5 font-mono">{ref}</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* Feedback */}
          {feedback && (
            <div className={`px-4 py-3 rounded-xl text-sm font-semibold border ${
              feedback.type === "success"
                ? "bg-green-500/10 text-green-400 border-green-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20"
            }`}>
              {feedback.msg}
            </div>
          )}

          {/* Client Info */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-3">Client</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-white/30 shrink-0" />
                <span className="text-white text-sm font-semibold">{order.customer_name || "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-white/30 shrink-0" />
                <span className="text-white/60 text-sm">{order.email}</span>
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-white/30 shrink-0" />
                  <span className="text-white/60 text-sm">{order.customer_phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Articles */}
          {order.items && order.items.length > 0 && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-3">Articles commandés</p>
              <div className="space-y-2.5">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-white/80">{item.title}</span>
                      <span className="text-white/30 ml-1">× {item.quantity}</span>
                    </div>
                    <span className="text-[#CBF27A] font-bold">{fmtXOF(item.unit_price * item.quantity)}</span>
                  </div>
                ))}
                <div className="border-t border-white/5 pt-2.5 flex items-center justify-between">
                  <span className="text-white/50 text-sm font-semibold">Total</span>
                  <span className="text-[#CBF27A] text-lg font-extrabold">{fmtXOF(order.amount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
            <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider mb-4">Suivi de la commande</p>
            <div className="relative">
              {steps.map((step, i) => (
                <TimelineStep key={i} {...step} />
              ))}
            </div>
          </div>

          {/* Update form — only if paid */}
          {isPaid && (
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-4">
              <p className="text-white/30 text-[10px] font-bold uppercase tracking-wider">Traitement logistique</p>

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/50">Statut d'expédition</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["not_fulfilled", "shipped", "delivered"] as const).map((s) => {
                    const m = FULFILL_META[s];
                    return (
                      <button
                        key={s}
                        onClick={() => setStatus(s)}
                        className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-bold transition-all ${
                          status === s
                            ? m.color + " shadow-sm"
                            : "bg-white/[0.03] border-white/8 text-white/40 hover:border-white/20 hover:text-white/60"
                        }`}
                      >
                        {m.icon}
                        {m.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tracking */}
              {(status === "shipped" || status === "delivered") && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/50">Transporteur</label>
                    <input
                      value={carrier}
                      onChange={e => setCarrier(e.target.value)}
                      placeholder="DHL, Chronopost..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#CBF27A]/40"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-white/50">N° de suivi</label>
                    <input
                      value={trackingNumber}
                      onChange={e => setTrackingNumber(e.target.value)}
                      placeholder="1Z999AA10123456784"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#CBF27A]/40"
                    />
                  </div>
                </div>
              )}

              {/* Admin note */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-white/50">Note interne (admin seulement)</label>
                <textarea
                  value={adminNote}
                  onChange={e => setAdminNote(e.target.value)}
                  placeholder="Note visible uniquement par l'équipe..."
                  rows={2}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-[#CBF27A]/40 resize-none"
                />
              </div>

              {/* Notify customer toggle */}
              {status === "shipped" && (
                <button
                  onClick={() => setNotifyCustomer(!notifyCustomer)}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl border text-sm font-semibold transition-all ${
                    notifyCustomer
                      ? "bg-[#CBF27A]/10 border-[#CBF27A]/30 text-[#CBF27A]"
                      : "bg-white/[0.03] border-white/8 text-white/40"
                  }`}
                >
                  {notifyCustomer ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
                  {notifyCustomer ? "Email de notification au client activé" : "Email de notification désactivé"}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-semibold text-white/50 hover:text-white transition-colors"
          >
            Fermer
          </button>
          {isPaid && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#CBF27A] text-[#0F3D3E] text-sm font-bold rounded-xl hover:bg-[#b8e068] transition-colors disabled:opacity-60"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              Enregistrer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function AdminCommandesPage() {
  const [orders, setOrders] = useState<UnifiedOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [payFilter, setPayFilter] = useState<"all" | "paid" | "pending">("all");
  const [fulfillFilter, setFulfillFilter] = useState<"all" | "not_fulfilled" | "shipped" | "delivered">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "medusa" | "manual">("all");
  const [selectedOrder, setSelectedOrder] = useState<UnifiedOrder | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const unified: UnifiedOrder[] = [];

      // 1. Commandes Medusa
      const medusaRes = await fetch("/api/admin/commandes?limit=250");
      if (medusaRes.ok) {
        const data = await medusaRes.json();
        (data.orders || []).forEach((o: any) => {
          const items = o.items || [];
          unified.push({
            id: o.id,
            display_id: o.display_id,
            email: o.email || "—",
            customer_name: o.billing_address
              ? `${o.billing_address.first_name || ""} ${o.billing_address.last_name || ""}`.trim()
              : undefined,
            customer_phone: o.billing_address?.phone,
            items: items.map((i: any) => ({ title: i.title, quantity: i.quantity, unit_price: i.unit_price })),
            items_label: items.length > 0 ? (items.length > 1 ? `${items[0].title} +${items.length - 1}` : items[0].title) : "Produit HelyaCare",
            amount: Math.round(o.total || 0),
            payment_method: "tara_card",
            payment_status: o.payment_status || o.status || "—",
            fulfillment_status: o.metadata?.helya_fulfillment_status || (o.payment_status === "captured" ? "not_fulfilled" : undefined),
            tracking_number: o.metadata?.helya_tracking_number,
            carrier: o.metadata?.helya_carrier,
            admin_note: o.metadata?.helya_admin_note,
            shipped_at: o.metadata?.helya_shipped_at,
            delivered_at: o.metadata?.helya_delivered_at,
            created_at: o.created_at,
            source: "medusa",
            customer_id: o.customer_id,
          });
        });
      }

      // 2. Dépôts manuels
      const depositsRes = await fetch("/api/admin/deposits");
      if (depositsRes.ok) {
        const data = await depositsRes.json();
        (data.deposits || []).forEach((dep: any) => {
          const cartItems: any[] = dep.cart_items || [];
          unified.push({
            id: dep.id,
            reference_code: dep.reference_code,
            email: dep.customer_email || "—",
            customer_name: dep.customer_name,
            customer_phone: dep.customer_phone,
            items: cartItems.map((i: any) => ({ title: i.title, quantity: i.quantity, unit_price: i.unit_price })),
            items_label: cartItems.length > 0 ? (cartItems.length > 1 ? `${cartItems[0].title} +${cartItems.length - 1}` : cartItems[0].title) : "Rechargement portefeuille",
            amount: dep.amount,
            payment_method: dep.method,
            payment_status: dep.status,
            fulfillment_status: dep.fulfillment_status || (dep.status === "approved" ? "not_fulfilled" : undefined),
            tracking_number: dep.tracking_number,
            carrier: dep.carrier,
            admin_note: dep.admin_note,
            shipped_at: dep.shipped_at,
            delivered_at: dep.delivered_at,
            created_at: dep.created_at,
            source: "manual",
            customer_id: dep.customer_id,
          });
        });
      }

      unified.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      setOrders(unified);
    } catch (e) {
      console.error("[admin/commandes]", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Quick action (e.g., confirm delivery directly from card)
  const handleQuickAction = async (order: UnifiedOrder, newStatus: string) => {
    setActionLoading(order.id);
    try {
      const res = await fetch(`/api/admin/commandes/${order.id}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: order.source,
          status: newStatus,
          customer_id: order.customer_id,
        }),
      });
      if (res.ok) {
        showToast(`✅ Commande ${order.reference_code || order.id.slice(-6)} marquée comme ${FULFILL_META[newStatus]?.label}`);
        await load();
      } else {
        showToast("❌ Erreur lors de la mise à jour");
      }
    } catch {
      showToast("❌ Erreur réseau");
    }
    setActionLoading(null);
  };

  // Filtered orders
  const filtered = orders.filter(o => {
    if (sourceFilter !== "all" && o.source !== sourceFilter) return false;
    if (payFilter === "paid" && !["captured", "approved"].includes(o.payment_status)) return false;
    if (payFilter === "pending" && !["pending", "awaiting_payment"].includes(o.payment_status)) return false;
    if (fulfillFilter !== "all" && o.fulfillment_status !== fulfillFilter) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (o.email || "").toLowerCase().includes(q) ||
      (o.customer_name || "").toLowerCase().includes(q) ||
      String(o.display_id || "").includes(q) ||
      (o.reference_code || "").toLowerCase().includes(q)
    );
  });

  // Stats
  const paid = orders.filter(o => ["captured", "approved"].includes(o.payment_status));
  const toShip = paid.filter(o => o.fulfillment_status === "not_fulfilled");
  const stats = {
    total: orders.length,
    paid: paid.length,
    pending: orders.filter(o => ["pending", "awaiting_payment"].includes(o.payment_status)).length,
    toShip: toShip.length,
    revenue: paid.reduce((s, o) => s + o.amount, 0),
  };

  return (
    <div className={`space-y-6 ${inter.className}`}>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-[100] px-5 py-3.5 bg-[#0F3D3E] border border-[#CBF27A]/30 text-white text-sm font-semibold rounded-2xl shadow-2xl animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Commandes</h1>
          <p className="text-white/40 text-sm mt-0.5">
            {stats.total} total · {stats.paid} payées · {stats.pending} en attente
            {stats.toShip > 0 && (
              <span className="ml-2 px-2 py-0.5 bg-orange-400/15 text-orange-400 text-[11px] font-bold rounded-full border border-orange-400/25">
                {stats.toShip} à expédier
              </span>
            )}
          </p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/60 hover:text-white text-sm font-semibold rounded-xl transition-all border border-white/10"
        >
          <RefreshCcw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Chiffre d'affaires", value: fmtXOF(stats.revenue), color: "text-[#CBF27A]", bg: "bg-[#CBF27A]/8 border-[#CBF27A]/20", icon: <TrendingUp className="w-4 h-4" /> },
          { label: "Payées", value: stats.paid, color: "text-green-400", bg: "bg-green-400/8 border-green-400/20", icon: <CheckCircle2 className="w-4 h-4" /> },
          { label: "À expédier", value: stats.toShip, color: stats.toShip > 0 ? "text-orange-400" : "text-white/40", bg: stats.toShip > 0 ? "bg-orange-400/8 border-orange-400/20" : "bg-white/3 border-white/8", icon: <Package className="w-4 h-4" /> },
          { label: "En attente paiement", value: stats.pending, color: "text-yellow-400", bg: "bg-yellow-400/8 border-yellow-400/20", icon: <Clock className="w-4 h-4" /> },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className={`${bg} border rounded-2xl p-4`}>
            <div className={`flex items-center gap-1.5 mb-2 ${color} opacity-60`}>{icon}<p className="text-[10px] font-bold uppercase tracking-wider">{label}</p></div>
            <p className={`text-xl font-extrabold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Email, référence, nom..."
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#CBF27A]/40"
          />
        </div>
        {/* Paiement */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "paid", "pending"] as const).map(f => (
            <button key={f} onClick={() => setPayFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                payFilter === f ? "bg-[#CBF27A] text-[#0F3D3E] border-[#CBF27A]" : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}>
              {f === "all" ? "Tous" : f === "paid" ? "✅ Payées" : "⏳ En attente"}
            </button>
          ))}
        </div>
        {/* Livraison */}
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "not_fulfilled", "shipped", "delivered"] as const).map(f => (
            <button key={f} onClick={() => setFulfillFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                fulfillFilter === f ? "bg-[#CBF27A] text-[#0F3D3E] border-[#CBF27A]" : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}>
              {f === "all" ? "Toutes" : f === "not_fulfilled" ? "📦 À préparer" : f === "shipped" ? "🚚 Expédiées" : "✅ Livrées"}
            </button>
          ))}
        </div>
        {/* Source */}
        <div className="flex gap-1.5">
          {(["all", "medusa", "manual"] as const).map(f => (
            <button key={f} onClick={() => setSourceFilter(f)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                sourceFilter === f ? "bg-[#CBF27A] text-[#0F3D3E] border-[#CBF27A]" : "bg-white/5 text-white/50 border-white/10 hover:border-white/20 hover:text-white"
              }`}>
              {f === "all" ? "Toutes sources" : f === "medusa" ? "💳 Carte" : "📱 Manuel"}
            </button>
          ))}
        </div>
      </div>

      {/* Orders list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 text-[#CBF27A] animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white/3 border border-white/8 rounded-2xl p-16 text-center">
          <ShoppingBag className="w-10 h-10 text-white/20 mx-auto mb-3" />
          <p className="text-white/30 text-sm">
            {search ? "Aucun résultat pour cette recherche" : "Aucune commande dans cette catégorie"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(order => (
            <OrderCard
              key={order.id}
              order={order}
              onOpenDetail={setSelectedOrder}
              onQuickAction={handleQuickAction}
              actionLoading={actionLoading}
            />
          ))}
        </div>
      )}

      {/* Slide-over detail panel */}
      {selectedOrder && (
        <DetailPanel
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdate={async () => {
            await load();
            // Re-find updated order in list
            setSelectedOrder(prev => orders.find(o => o.id === prev?.id) || null);
          }}
        />
      )}
    </div>
  );
}
