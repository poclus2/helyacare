"use client";

import { useState } from "react";
import { ShoppingBag, Check } from "lucide-react";
import { Inter } from "next/font/google";
import { useCart } from "@/contexts/CartContext";
import { useLivePrices } from "@/contexts/PricesContext";
import type { ProductKey } from "@/lib/prices";

const inter = Inter({ subsets: ["latin"], weight: ["600", "700"] });

interface AddToCartButtonProps {
  productKey: ProductKey;
  purchaseType: "subscription" | "one-time";
  title: string;
  subtitle?: string;
  thumbnail?: string;
  price: number;
  className?: string;
  label?: string;
  /** Passer un variantId explicite (depuis la boutique listing avec données Medusa live) */
  variantId?: string;
}

export default function AddToCartButton({
  productKey,
  purchaseType,
  title,
  subtitle,
  thumbnail,
  price,
  className = "",
  label = "Commencer Maintenant",
  variantId: propVariantId,
}: AddToCartButtonProps) {
  const { addItem } = useCart();
  const { getVariantId } = useLivePrices();
  const [status, setStatus] = useState<"idle" | "adding" | "added">("idle");

  const handleAdd = async () => {
    if (status !== "idle") return;
    setStatus("adding");

    // Priorité : prop explicite → variant live depuis Medusa → fallback textuel
    const resolvedVariantId =
      propVariantId ||
      getVariantId(productKey) ||
      `${productKey}-${purchaseType}-v1`;

    await addItem({
      variantId: resolvedVariantId,
      quantity: 1,
      title,
      subtitle: subtitle || (purchaseType === "subscription" ? "Abonnement mensuel" : "Achat unique"),
      thumbnail,
      unit_price: price,
      currency_code: "XOF",
    });

    setStatus("added");
    setTimeout(() => setStatus("idle"), 2000);
  };

  const isAdded = status === "added";
  const isAdding = status === "adding";

  return (
    <button
      onClick={handleAdd}
      disabled={isAdding}
      className={`w-full py-4 text-[15px] font-semibold rounded-[6px] transition-all flex items-center justify-center gap-2 ${inter.className} ${
        isAdded
          ? "bg-green-600 text-white"
          : isAdding
          ? "bg-[#E56B2D]/80 text-white cursor-wait"
          : "bg-[#E56B2D] text-white hover:bg-[#cf5c22]"
      } ${className}`}
    >
      {isAdded ? (
        <>
          <Check className="w-5 h-5" />
          Ajouté au panier ✓
        </>
      ) : isAdding ? (
        <>
          <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          Ajout en cours...
        </>
      ) : (
        <>
          <ShoppingBag className="w-5 h-5" />
          {label}
        </>
      )}
    </button>
  );
}
