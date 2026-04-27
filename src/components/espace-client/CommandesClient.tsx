"use client";

import { useState } from "react";
import {
  Package, Eye, ChevronRight, Clock, CheckCircle2, XCircle, Wallet
} from "lucide-react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Link } from "@/navigation";
import { OrderDetailDrawer, OrderDrawerData } from "@/components/espace-client/OrderDetailDrawer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });

const fmtXOF = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XOF", maximumFractionDigits: 0 }).format(n);

const METHOD_LABEL: Record<string, string> = {
  wave: "Wave", orange_money: "Orange Money", mtn_momo: "MTN MoMo",
  bank: "Virement", other: "Autre", flutterwave: "Carte bancaire",
};

function StatusBadge({ status }: { status: string }) {
  const s = (status || "").toLowerCase();
  if (["completed", "approved", "captured"].includes(s))
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-green-100 text-green-700"><CheckCircle2 className="w-3 h-3" />Confirmé</span>;
  if (["cancelled", "rejected"].includes(s))
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-red-100 text-red-700"><XCircle className="w-3 h-3" />Annulé</span>;
  if (["pending", "awaiting_payment"].includes(s))
    return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700"><Clock className="w-3 h-3" />En attente</span>;
  return <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-gray-100 text-gray-600">{status || "En cours"}</span>;
}

interface Props {
  medusaOrders: any[];
  manualDeposits: any[];
}

export function CommandesClient({ medusaOrders, manualDeposits }: Props) {
  const [selectedOrder, setSelectedOrder] = useState<OrderDrawerData | null>(null);

  // Convertir une commande Medusa en OrderDrawerData
  const toDrawerMedusa = (o: any): OrderDrawerData => ({
    id: o.id,
    display_id: o.display_id,
    email: o.email,
    amount: Math.round((o.total || 0) / 100),
    payment_status: o.payment_status || o.status,
    payment_method: "flutterwave",
    fulfillment_status: o.fulfillment_status,
    created_at: o.created_at,
    updated_at: o.updated_at,
    source: "medusa",
    items: o.items?.map((i: any) => ({
      id: i.id,
      title: i.title || i.variant_title,
      quantity: i.quantity,
      unit_price: Math.round((i.unit_price || 0) / 100),
      thumbnail: i.thumbnail,
    })),
    shipping_address: o.shipping_address,
  });

  // Convertir un dépôt manuel en OrderDrawerData
  const toDrawerManual = (dep: any): OrderDrawerData => ({
    id: dep.id,
    reference_code: dep.reference_code,
    email: dep.customer_email || "",
    amount: dep.amount,
    payment_status: dep.status,
    payment_method: dep.method,
    created_at: dep.created_at,
    processed_at: dep.processed_at,
    source: "manual",
    notes: dep.notes,
    payer_phone: dep.payer_phone,
    cart_items: dep.cart_items || [],
  });

  const hasAny = medusaOrders.length > 0 || manualDeposits.length > 0;

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">

        <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-6 mb-6">
          <div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
              Historique des Commandes
            </h2>
            <p className="text-gray-500 text-sm">
              {hasAny
                ? `${medusaOrders.length + manualDeposits.length} opération(s) — cliquez sur Aperçu pour voir les détails`
                : "Vos achats et dépôts apparaîtront ici."}
            </p>
          </div>
        </div>

        {!hasAny ? (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-[#F2F0EB] rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
              Aucune commande pour l&apos;instant
            </h3>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              Vos commandes apparaîtront ici après votre premier achat sur la boutique HelyaCare.
            </p>
            <Link
              href="/boutique"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-bold hover:bg-[#1a5556] transition-colors"
            >
              Découvrir la boutique
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <>
            {/* ── Mobile : cartes ── */}
            <div className="sm:hidden divide-y divide-[#E8E3DC]/60">
              {[
                ...medusaOrders.map((o: any) => ({
                  key: o.id,
                  icon: <span className="text-lg">💳</span>,
                  iconBg: "bg-purple-50",
                  ref: o.display_id ? `#HC-${o.display_id}` : `#${o.id?.slice(-6).toUpperCase()}`,
                  subLabel: "Flutterwave",
                  product: (o.items?.[0]?.title || "Produit HelyaCare") + (o.items?.length > 1 ? ` +${o.items.length - 1}` : ""),
                  amount: fmtXOF(Math.round((o.total || 0) / 100)),
                  date: o.created_at ? fmtDate(o.created_at) : "—",
                  status: o.payment_status || o.status,
                  onView: () => setSelectedOrder(toDrawerMedusa(o)),
                })),
                ...manualDeposits.map((dep: any) => {
                  const its: any[] = dep.cart_items || [];
                  const isOrder = its.length > 0;
                  return {
                    key: dep.id,
                    icon: isOrder ? <Package className="w-4 h-4 text-[#0F3D3E]" /> : <Wallet className="w-4 h-4 text-[#0F3D3E]" />,
                    iconBg: "bg-[#F6F4F1]",
                    ref: dep.reference_code,
                    subLabel: isOrder ? "Commande" : "Dépôt",
                    product: its[0]?.title || "Rechargement portefeuille",
                    amount: fmtXOF(dep.amount),
                    date: dep.created_at ? fmtDate(dep.created_at) : "—",
                    status: dep.status,
                    onView: () => setSelectedOrder(toDrawerManual(dep)),
                  };
                }),
              ].map(row => (
                <div key={row.key} className="flex items-center gap-3 py-4 px-1">
                  {/* Icône */}
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${row.iconBg}`}>
                    {row.icon}
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`font-bold text-[#0F3D3E] text-sm truncate ${inter.className}`}>{row.ref}</p>
                      <StatusBadge status={row.status} />
                    </div>
                    <p className="text-gray-500 text-xs truncate">{row.product}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{row.date}</p>
                  </div>

                  {/* Montant + bouton */}
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className={`font-extrabold text-[#0F3D3E] text-sm ${inter.className}`}>{row.amount}</p>
                    <button
                      onClick={row.onView}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-[#0F3D3E] hover:bg-[#1a5556]
                        text-white text-[11px] font-bold rounded-lg transition-all active:scale-95"
                    >
                      <Eye className="w-3 h-3" />
                      Voir
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Desktop : table ── */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-[#E8E3DC] text-gray-500 text-xs uppercase tracking-wider">
                    <th className="pb-4 font-semibold">Référence</th>
                    <th className="pb-4 font-semibold">Date</th>
                    <th className="pb-4 font-semibold">Produit</th>
                    <th className="pb-4 font-semibold">Total</th>
                    <th className="pb-4 font-semibold">Méthode</th>
                    <th className="pb-4 font-semibold">Statut</th>
                    <th className="pb-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E3DC]/60">
                  {medusaOrders.map((order: any) => {
                    const items = order.items || [];
                    const firstItem = items[0]?.title || "Produit HelyaCare";
                    const itemLabel = items.length > 1 ? `${firstItem} +${items.length - 1}` : firstItem;
                    const displayId = order.display_id ? `#HC-${order.display_id}` : `#${order.id?.slice(-6).toUpperCase()}`;
                    return (
                      <tr key={order.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center shrink-0"><span className="text-sm">💳</span></div>
                            <span className={`font-bold text-[#0F3D3E] text-sm ${inter.className}`}>{displayId}</span>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600 text-sm">{order.created_at ? fmtDate(order.created_at) : "—"}</td>
                        <td className="py-4 text-gray-600 text-sm max-w-[160px] truncate">{itemLabel}</td>
                        <td className="py-4 font-bold text-[#0F3D3E] text-sm">{fmtXOF(Math.round((order.total || 0) / 100))}</td>
                        <td className="py-4 text-gray-500 text-xs">Carte bancaire</td>
                        <td className="py-4"><StatusBadge status={order.payment_status || order.status} /></td>
                        <td className="py-4 text-right">
                          <button onClick={() => setSelectedOrder(toDrawerMedusa(order))}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3D3E] hover:bg-[#1a5556] text-white text-xs font-bold rounded-lg transition-all">
                            <Eye className="w-3.5 h-3.5" />Aperçu
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {manualDeposits.map((dep: any) => {
                    const its: any[] = dep.cart_items || [];
                    const isOrder = its.length > 0;
                    const itemLabel = its.length > 0 ? its[0]?.title + (its.length > 1 ? ` +${its.length - 1}` : "") : "Rechargement portefeuille";
                    return (
                      <tr key={dep.id} className="hover:bg-[#F8FAFC] transition-colors">
                        <td className="py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-[#F6F4F1] flex items-center justify-center shrink-0">
                              {isOrder ? <Package className="w-4 h-4 text-[#0F3D3E]" /> : <Wallet className="w-4 h-4 text-[#0F3D3E]" />}
                            </div>
                            <div>
                              <p className={`font-bold text-[#0F3D3E] text-sm ${inter.className}`}>{dep.reference_code}</p>
                              <p className="text-[10px] text-gray-400">{isOrder ? "Commande" : "Dépôt"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-gray-600 text-sm">{dep.created_at ? fmtDate(dep.created_at) : "—"}</td>
                        <td className="py-4 text-gray-600 text-sm max-w-[160px] truncate">{itemLabel}</td>
                        <td className="py-4 font-bold text-[#0F3D3E] text-sm">{fmtXOF(dep.amount)}</td>
                        <td className="py-4 text-gray-500 text-xs">{METHOD_LABEL[dep.method] || dep.method}</td>
                        <td className="py-4"><StatusBadge status={dep.status} /></td>
                        <td className="py-4 text-right">
                          <button onClick={() => setSelectedOrder(toDrawerManual(dep))}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0F3D3E] hover:bg-[#1a5556] text-white text-xs font-bold rounded-lg transition-all">
                            <Eye className="w-3.5 h-3.5" />Aperçu
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {/* Drawer */}
      {selectedOrder && (
        <OrderDetailDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
