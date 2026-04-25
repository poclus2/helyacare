"use client";

import { useEffect, useRef } from "react";
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight, Sparkles } from "lucide-react";
import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function CartDrawer() {
  const { cart, isOpen, closeCart, removeItem, updateQuantity, itemCount } = useCart();
  const { formatPrice } = useCurrency();
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    if (isOpen) document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, closeCart]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const subtotal = cart.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 h-full w-full sm:w-[420px] bg-white z-[210] flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E3DC] bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0F3D3E] rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className={`text-[15px] font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                Mon Panier
              </h2>
              <p className="text-gray-400 text-xs">
                {itemCount === 0 ? "Vide" : `${itemCount} article${itemCount > 1 ? "s" : ""}`}
              </p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-9 h-9 rounded-xl hover:bg-[#F6F4F1] flex items-center justify-center transition-colors text-gray-500 hover:text-[#0F3D3E]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────────────── */}
        <div className={`flex-1 overflow-y-auto ${pjs.className}`}>
          {cart.items.length === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center h-full px-8 text-center gap-6 py-16">
              <div className="w-24 h-24 bg-[#F6F4F1] rounded-full flex items-center justify-center">
                <ShoppingBag className="w-10 h-10 text-gray-300" />
              </div>
              <div>
                <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
                  Votre panier est vide
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Découvrez nos formules cliniques et démarrez votre protocole santé aujourd'hui.
                </p>
              </div>
              <button
                onClick={closeCart}
                className="flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-bold hover:bg-[#1a5556] transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Voir la boutique
              </button>
            </div>
          ) : (
            <div className="divide-y divide-[#F2F0EB]">
              {cart.items.map((item) => (
                <div key={item.id} className="px-6 py-5 flex gap-4 group hover:bg-[#FAFAF9] transition-colors">
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-xl bg-[#F6F4F1] overflow-hidden shrink-0 relative border border-[#E8E3DC]">
                    {item.thumbnail ? (
                      <Image
                        src={item.thumbnail}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div className="min-w-0">
                        <p className={`text-sm font-bold text-[#0F3D3E] truncate ${inter.className}`}>
                          {item.title}
                        </p>
                        {item.subtitle && (
                          <p className="text-[11px] text-gray-400 font-medium">{item.subtitle}</p>
                        )}
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-gray-300 hover:text-red-500 transition-colors shrink-0 mt-0.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-2 bg-[#F6F4F1] rounded-lg p-1">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0F3D3E]"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className={`w-6 text-center text-sm font-bold text-[#0F3D3E] ${inter.className}`}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-md bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors text-[#0F3D3E]"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Price */}
                      <p className={`text-sm font-black text-[#0F3D3E] ${inter.className}`}>
                        {formatPrice(item.unit_price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        {cart.items.length > 0 && (
          <div className="border-t border-[#E8E3DC] bg-white px-6 py-6 space-y-4 sticky bottom-0">
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-gray-500 text-sm font-medium">Sous-total</span>
              <span className={`text-xl font-black text-[#0F3D3E] ${inter.className}`}>
                {formatPrice(subtotal)}
              </span>
            </div>

            {/* Free shipping badge */}
            <div className="flex items-center gap-2 bg-[#F0FBE4] border border-[#CBF27A]/60 rounded-xl px-4 py-2.5">
              <span className="text-[#1B5E20] text-xs font-bold">🚚</span>
              <p className="text-[12px] text-[#1B5E20] font-semibold">
                Livraison offerte sur votre première commande
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3">
              <Link
                href="/panier"
                onClick={closeCart}
                className={`w-full py-4 bg-[#0F3D3E] text-white text-[15px] font-bold rounded-xl hover:bg-[#1a5556] transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${inter.className}`}
              >
                Commander
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={closeCart}
                className={`w-full py-3 border border-[#E8E3DC] text-[#0F3D3E] text-sm font-semibold rounded-xl hover:bg-[#F6F4F1] transition-colors ${pjs.className}`}
              >
                Continuer mes achats
              </button>
            </div>

            {/* Reassurance */}
            <p className="text-center text-[11px] text-gray-400">
              🔒 Paiement sécurisé · Satisfait ou remboursé 30 jours
            </p>
          </div>
        )}
      </div>
    </>
  );
}
