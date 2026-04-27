"use client";

import { useState, useEffect } from "react";
import {
  X, Package, CheckCircle2, Clock, XCircle, Truck,
  Copy, Check, MapPin, Phone, ShoppingBag, AlertCircle, ExternalLink
} from "lucide-react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
const fmtDateShort = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
const fmtXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(n);

const METHOD_LABEL: Record<string, string> = {
  flutterwave: "Carte bancaire", wave: "Wave", orange_money: "Orange Money",
  mtn_momo: "MTN MoMo", bank: "Virement bancaire", other: "Autre",
};
const METHOD_ICON: Record<string, string> = {
  flutterwave: "💳", wave: "🌊", orange_money: "🍊", mtn_momo: "📱", bank: "🏦", other: "💰",
};

// ─── Timeline ─────────────────────────────────────────────────────────────────

type TimelineStep = { id: string; label: string; desc: string; icon: React.ReactNode; date?: string };

function getTimeline(order: any): TimelineStep[] {
  const isManual = order.source === "manual";
  const status = (order.payment_status || "").toLowerCase();
  const fulfillment = (order.fulfillment_status || "").toLowerCase();
  const isPaid = ["captured", "approved"].includes(status);
  const isRejected = ["rejected", "cancelled"].includes(status);
  const isFulfilled = ["fulfilled", "shipped", "delivered"].includes(fulfillment);
  const isDelivered = fulfillment === "delivered";

  return [
    {
      id: "created", label: "Commande reçue",
      desc: isManual ? "Votre demande de paiement a été enregistrée." : "Commande initiée avec succès.",
      icon: <ShoppingBag className="w-3.5 h-3.5" />, date: order.created_at,
    },
    {
      id: "payment",
      label: isManual ? (isPaid ? "Paiement confirmé" : isRejected ? "Paiement rejeté" : "Paiement en attente") : "Paiement validé",
      desc: isManual
        ? isPaid ? "L'équipe HelyaCare a confirmé la réception."
          : isRejected ? "Le paiement n'a pas pu être validé. Contactez le support."
          : "En attente du virement. Délai : 24–48h."
        : "Paiement capturé et validé.",
      icon: isPaid ? <CheckCircle2 className="w-3.5 h-3.5" /> : isRejected ? <XCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />,
      date: order.processed_at || (isPaid ? order.updated_at : undefined),
    },
    {
      id: "preparation", label: "En préparation",
      desc: "Votre commande est préparée dans notre entrepôt.",
      icon: <Package className="w-3.5 h-3.5" />, date: isFulfilled ? order.updated_at : undefined,
    },
    {
      id: "shipped", label: "Expédié",
      desc: "Votre colis est en route. Suivi par WhatsApp.",
      icon: <Truck className="w-3.5 h-3.5" />,
      date: (fulfillment === "shipped" || isDelivered) ? order.updated_at : undefined,
    },
    {
      id: "delivered", label: "Livré",
      desc: "Votre commande a été livrée. Bonne utilisation !",
      icon: <CheckCircle2 className="w-3.5 h-3.5" />, date: isDelivered ? order.updated_at : undefined,
    },
  ];
}

function getActiveStep(order: any): number {
  const status = (order.payment_status || "").toLowerCase();
  const fulfillment = (order.fulfillment_status || "").toLowerCase();
  const isRejected = ["rejected", "cancelled"].includes(status);
  const isPaid = ["captured", "approved"].includes(status);
  if (isRejected) return 1;
  if (!isPaid) return 0;
  if (fulfillment === "delivered") return 4;
  if (fulfillment === "shipped") return 3;
  if (fulfillment === "fulfilled") return 2;
  return 1;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface OrderDrawerData {
  id: string;
  reference_code?: string;
  display_id?: string | number;
  email?: string;
  amount: number;
  payment_status: string;
  payment_method: string;
  fulfillment_status?: string;
  created_at: string;
  processed_at?: string;
  updated_at?: string;
  source: "medusa" | "manual";
  cart_items?: Array<{ title: string; quantity: number; unit_price: number; variant_id?: string }>;
  items?: Array<{ id: string; title: string; quantity: number; unit_price: number; thumbnail?: string }>;
  notes?: string;
  payer_phone?: string;
  shipping_address?: {
    first_name?: string; last_name?: string;
    address_1?: string; city?: string; country_code?: string;
  };
}

interface Props { order: OrderDrawerData; onClose: () => void }

// ─── Main Drawer ──────────────────────────────────────────────────────────────

export function OrderDetailDrawer({ order, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile on mount
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Lock scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const ref = order.reference_code || (order.display_id ? `HC-${order.display_id}` : order.id.slice(-8).toUpperCase());
  const items = order.cart_items || order.items || [];
  const timeline = getTimeline(order);
  const activeStep = getActiveStep(order);
  const isManual = order.source === "manual";
  const isPaid = ["captured", "approved"].includes((order.payment_status || "").toLowerCase());
  const isRejected = ["rejected", "cancelled"].includes((order.payment_status || "").toLowerCase());

  const copyRef = () => {
    navigator.clipboard.writeText(ref);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mobile → bottom sheet | Desktop → right drawer
  const drawerClass = isMobile
    ? "fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl shadow-2xl max-h-[92dvh] flex flex-col animate-[slideUp_0.28s_cubic-bezier(0.32,0.72,0,1)]"
    : "fixed right-0 top-0 h-full z-50 w-full max-w-lg bg-white shadow-2xl flex flex-col animate-[slideInRight_0.25s_ease-out]";

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer / Bottom Sheet */}
      <div className={`${drawerClass} ${inter.className}`}>

        {/* Mobile drag handle */}
        {isMobile && (
          <div className="flex justify-center pt-3 pb-1 shrink-0">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E3DC] shrink-0">
          <div className="min-w-0 flex-1 mr-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-0.5">
              {isManual ? "Paiement manuel" : "Commande Flutterwave"}
            </p>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#0F3D3E] truncate">{ref}</h2>
              <button
                onClick={copyRef}
                className="text-gray-400 hover:text-[#0F3D3E] transition-colors shrink-0"
                title="Copier la référence"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* ── Statut global ── */}
          <div className={`px-5 py-4 border-b border-[#E8E3DC] ${
            isPaid ? "bg-green-50" : isRejected ? "bg-red-50" : "bg-amber-50"
          }`}>
            {/* Ligne 1 : icône + label statut + montant */}
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isPaid ? "bg-green-100 text-green-600"
                : isRejected ? "bg-red-100 text-red-600"
                : "bg-amber-100 text-amber-600"
              }`}>
                {isPaid ? <CheckCircle2 className="w-5 h-5" />
                : isRejected ? <XCircle className="w-5 h-5" />
                : <Clock className="w-5 h-5" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-bold text-sm ${
                  isPaid ? "text-green-700" : isRejected ? "text-red-700" : "text-amber-700"
                }`}>
                  {isPaid ? "Paiement confirmé" : isRejected ? "Paiement rejeté" : "En attente de paiement"}
                </p>
                <p className="text-gray-500 text-xs truncate">{fmtDate(order.created_at)}</p>
              </div>
            </div>

            {/* Ligne 2 : montant + méthode en card séparée */}
            <div className="mt-3 bg-white/70 rounded-xl px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Montant</p>
                <p className="text-xl font-extrabold text-[#0F3D3E]">{fmtXOF(order.amount)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Méthode</p>
                <p className="text-sm font-semibold text-[#0F3D3E]">
                  {METHOD_ICON[order.payment_method]} {METHOD_LABEL[order.payment_method] || order.payment_method}
                </p>
              </div>
            </div>

            {/* Alerte paiement en attente */}
            {!isPaid && !isRejected && isManual && (
              <div className="mt-3 flex items-start gap-2 bg-amber-100 rounded-xl px-3 py-3">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-amber-800 text-xs leading-relaxed">
                  Envoyez <strong>{fmtXOF(order.amount)}</strong> et mentionnez la référence{" "}
                  <strong className="font-mono break-all">{ref}</strong>. Validation sous 24–48h.
                </p>
              </div>
            )}
          </div>

          {/* ── Timeline ── */}
          <div className="px-5 py-5 border-b border-[#E8E3DC]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-4">Suivi de commande</p>
            <div className="relative">
              {timeline.map((step, idx) => {
                const isDone = idx <= activeStep && !isRejected;
                const isActive = idx === activeStep;
                const isSkipped = isRejected && idx > 1;

                return (
                  <div key={step.id} className="flex gap-3 pb-4 last:pb-0 relative">
                    {/* Ligne verticale */}
                    {idx < timeline.length - 1 && (
                      <div className={`absolute left-[15px] top-7 w-0.5 bottom-0 -translate-x-1/2 ${
                        isDone && idx < activeStep ? "bg-[#0F3D3E]" : "bg-gray-200"
                      }`} />
                    )}

                    {/* Icône */}
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 z-10 ${
                      isSkipped
                        ? "border-gray-200 bg-white text-gray-300"
                        : isRejected && idx === 1
                          ? "border-red-300 bg-red-50 text-red-500"
                          : isDone
                            ? isActive
                              ? "border-[#0F3D3E] bg-[#0F3D3E] text-white shadow-md"
                              : "border-[#0F3D3E] bg-[#0F3D3E] text-white"
                            : "border-gray-200 bg-white text-gray-400"
                    }`}>
                      {step.icon}
                    </div>

                    {/* Texte */}
                    <div className="flex-1 pt-1 min-w-0">
                      <p className={`text-sm font-bold leading-tight ${
                        isSkipped ? "text-gray-300"
                        : isRejected && idx === 1 ? "text-red-600"
                        : isDone ? "text-[#0F3D3E]" : "text-gray-400"
                      }`}>
                        {step.label}
                        {isActive && !isRejected && (
                          <span className="ml-2 inline-flex w-2 h-2 rounded-full bg-[#CBF27A] animate-pulse align-middle" />
                        )}
                      </p>
                      <p className={`text-xs mt-0.5 leading-relaxed ${
                        isSkipped ? "text-gray-300" : "text-gray-500"
                      }`}>
                        {step.desc}
                      </p>
                      {step.date && !isSkipped && (
                        <p className="text-[10px] text-gray-400 mt-1 font-mono">{fmtDateShort(step.date)}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Articles ── */}
          {items.length > 0 && (
            <div className="px-5 py-5 border-b border-[#E8E3DC]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Articles commandés</p>
              <div className="space-y-3">
                {items.map((item: any, idx: number) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#F6F4F1] border border-[#E8E3DC] flex items-center justify-center shrink-0 overflow-hidden">
                      {item.thumbnail
                        ? <img src={item.thumbnail} alt={item.title} className="w-full h-full object-cover" />
                        : <Package className="w-5 h-5 text-gray-400" />
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#0F3D3E] text-sm leading-tight truncate">{item.title}</p>
                      <p className="text-gray-400 text-xs mt-0.5">Qté : {item.quantity}</p>
                    </div>
                    <p className="font-extrabold text-[#0F3D3E] text-sm shrink-0 ml-2">
                      {fmtXOF(item.unit_price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-[#E8E3DC] flex items-center justify-between">
                <span className="text-gray-500 text-sm">Total</span>
                <span className="font-extrabold text-[#0F3D3E] text-lg">{fmtXOF(order.amount)}</span>
              </div>
            </div>
          )}

          {/* ── Informations paiement ── */}
          <div className="px-5 py-5 border-b border-[#E8E3DC]">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Informations de paiement</p>
            <div className="bg-[#F8FAFC] rounded-2xl divide-y divide-[#E8E3DC]">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-gray-500 text-sm flex items-center gap-2">
                  <span>{METHOD_ICON[order.payment_method]}</span>Méthode
                </span>
                <span className="font-semibold text-[#0F3D3E] text-sm text-right ml-4">
                  {METHOD_LABEL[order.payment_method] || order.payment_method}
                </span>
              </div>
              {order.payer_phone && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-gray-500 text-sm flex items-center gap-2"><Phone className="w-3.5 h-3.5" />Expéditeur</span>
                  <span className="font-semibold text-[#0F3D3E] text-sm">{order.payer_phone}</span>
                </div>
              )}
              <div className="flex items-center justify-between px-4 py-3 gap-3">
                <span className="text-gray-500 text-sm shrink-0">Référence</span>
                <span className="font-mono font-bold text-[#0F3D3E] text-xs bg-white px-2 py-1 rounded border border-[#E8E3DC] break-all text-right">
                  {ref}
                </span>
              </div>
              {order.notes && !order.notes.endsWith("— ") && (
                <div className="flex items-start justify-between px-4 py-3 gap-3">
                  <span className="text-gray-500 text-sm shrink-0">Note</span>
                  <span className="text-[#0F3D3E] text-xs text-right">{order.notes}</span>
                </div>
              )}
              {order.processed_at && (
                <div className="flex items-center justify-between px-4 py-3">
                  <span className="text-gray-500 text-sm">Traité le</span>
                  <span className="text-[#0F3D3E] text-xs font-semibold">{fmtDateShort(order.processed_at)}</span>
                </div>
              )}
            </div>
          </div>

          {/* ── Adresse ── */}
          {order.shipping_address?.address_1 && (
            <div className="px-5 py-5 border-b border-[#E8E3DC]">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Adresse de livraison</p>
              <div className="flex items-start gap-3 bg-[#F8FAFC] rounded-2xl px-4 py-3">
                <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                <div className="text-sm text-[#0F3D3E]">
                  <p className="font-bold">{order.shipping_address.first_name} {order.shipping_address.last_name}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{order.shipping_address.address_1}</p>
                  <p className="text-gray-600 text-xs">{order.shipping_address.city} · {order.shipping_address.country_code?.toUpperCase()}</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Support ── */}
          <div className="px-5 py-5 pb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Besoin d&apos;aide ?</p>
            <a
              href={`https://wa.me/+237600000000?text=Bonjour,%20j'ai%20une%20question%20sur%20ma%20commande%20${encodeURIComponent(ref)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-full px-4 py-3.5 bg-[#F6F4F1] hover:bg-[#EEEBE6]
                rounded-2xl transition-colors text-sm font-semibold text-[#0F3D3E] active:scale-[0.98]"
            >
              <span className="text-xl">📲</span>
              <span className="flex-1">Contacter le support WhatsApp</span>
              <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
