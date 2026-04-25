"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, ArrowLeft, ShieldCheck, RotateCcw, Truck } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "@/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

const REASSURANCES = [
  { icon: Truck, label: "Livraison offerte", sub: "Sur votre 1ère commande" },
  { icon: RotateCcw, label: "Retour 30 jours", sub: "Satisfait ou remboursé" },
  { icon: ShieldCheck, label: "Paiement sécurisé", sub: "Crypté & protégé" },
];

export default function PanierPage() {
  const { cart, removeItem, updateQuantity, itemCount } = useCart();
  const { formatPrice } = useCurrency();

  const subtotal = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const shipping = 0; // Livraison offerte
  const total = subtotal + shipping;

  return (
    <>
      <Header />
      <main className={`min-h-screen bg-[#F6F4F1] ${pjs.className}`}>
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 md:py-16">

          {/* Page Title */}
          <div className="mb-10">
            <Link
              href="/boutique"
              className={`inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#0F3D3E] transition-colors mb-6 ${inter.className}`}
            >
              <ArrowLeft className="w-4 h-4" />
              Continuer mes achats
            </Link>
            <h1 className={`text-4xl md:text-5xl font-extrabold text-[#0F3D3E] ${inter.className}`}>
              Mon Panier
            </h1>
            {itemCount > 0 && (
              <p className="text-gray-500 mt-2">
                {itemCount} article{itemCount > 1 ? "s" : ""} dans votre panier
              </p>
            )}
          </div>

          {cart.items.length === 0 ? (
            /* ── Empty State ─────────────────────────────────────────────── */
            <div className="bg-white rounded-3xl p-16 border border-[#E8E3DC] text-center shadow-sm">
              <div className="w-24 h-24 bg-[#F6F4F1] rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-3 ${inter.className}`}>
                Votre panier est vide
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
                Découvrez nos formules cliniques HelyaCare, développées pour transformer votre métabolisme de l'intérieur.
              </p>
              <Link
                href="/boutique"
                className={`inline-flex items-center gap-2 px-8 py-4 bg-[#0F3D3E] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a5556] transition-all shadow-lg hover:shadow-xl ${inter.className}`}
              >
                Explorer la boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            /* ── Cart Grid ───────────────────────────────────────────────── */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Left: Items */}
              <div className="lg:col-span-2 space-y-4">
                {cart.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 md:p-6 border border-[#E8E3DC] shadow-sm flex gap-5 group hover:border-[#0F3D3E]/20 transition-all"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-[#F6F4F1] shrink-0 border border-[#E8E3DC]">
                      {item.thumbnail ? (
                        <Image
                          src={item.thumbnail}
                          alt={item.title}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <ShoppingBag className="w-8 h-8 text-gray-300" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className={`text-base md:text-lg font-bold text-[#0F3D3E] ${inter.className}`}>
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <span className="inline-block mt-1 px-2.5 py-0.5 bg-[#F2F0EB] text-gray-600 text-[11px] font-semibold rounded-full">
                              {item.subtitle}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-gray-300 hover:text-red-500 transition-colors shrink-0 p-1.5 rounded-lg hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity */}
                        <div className="flex items-center gap-2 bg-[#F6F4F1] rounded-xl p-1.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0F3D3E] font-bold"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className={`w-8 text-center text-sm font-bold text-[#0F3D3E] ${inter.className}`}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0F3D3E] font-bold"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Line total */}
                        <p className={`text-lg font-black text-[#0F3D3E] ${inter.className}`}>
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Reassurances strip */}
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {REASSURANCES.map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="bg-white rounded-2xl p-4 border border-[#E8E3DC] text-center shadow-sm">
                      <Icon className="w-5 h-5 text-[#0F3D3E] mx-auto mb-2" />
                      <p className={`text-[12px] font-bold text-[#0F3D3E] ${inter.className}`}>{label}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm overflow-hidden sticky top-28">
                  {/* Header */}
                  <div className="px-6 py-5 border-b border-[#E8E3DC]">
                    <h2 className={`text-lg font-bold text-[#0F3D3E] ${inter.className}`}>
                      Récapitulatif
                    </h2>
                  </div>

                  {/* Lines */}
                  <div className="px-6 py-5 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Sous-total</span>
                      <span className={`font-bold text-[#0F3D3E] ${inter.className}`}>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 font-medium">Livraison</span>
                      <span className="font-bold text-green-600">Offerte</span>
                    </div>

                    <div className="h-px bg-[#E8E3DC]" />

                    <div className="flex items-center justify-between">
                      <span className={`font-bold text-[#0F3D3E] ${inter.className}`}>Total</span>
                      <span className={`text-2xl font-black text-[#0F3D3E] ${inter.className}`}>
                        {formatPrice(total)}
                      </span>
                    </div>
                  </div>

                  {/* Green badge */}
                  <div className="mx-6 mb-5 bg-[#F0FBE4] border border-[#CBF27A]/60 rounded-xl px-4 py-3 flex items-center gap-2">
                    <span className="text-base">🚚</span>
                    <p className="text-[12px] text-[#1B5E20] font-semibold leading-snug">
                      Livraison offerte sur votre 1ère commande
                    </p>
                  </div>

                  {/* CTA */}
                  <div className="px-6 pb-6 space-y-3">
                    <Link
                      href="/checkout"
                      className={`w-full py-4 bg-[#E56B2D] text-white text-[15px] font-bold rounded-xl hover:bg-[#cf5c22] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${inter.className}`}
                    >
                      Passer la commande
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <p className="text-center text-[11px] text-gray-400">
                      🔒 Paiement 100% sécurisé · SSL
                    </p>
                  </div>

                  {/* Dark bottom band */}
                  <div className="bg-[#0F3D3E] px-6 py-4 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#CBF27A] shrink-0" />
                    <p className="text-[12px] text-white/80 leading-snug">
                      Garantie remboursement 30 jours sans condition
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
