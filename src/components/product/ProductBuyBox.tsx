"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { useCurrency } from "@/contexts/CurrencyContext";
import AddToCartButton from "@/components/AddToCartButton";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface ProductBuyBoxProps {
  productKey: string;
  title: string;
  thumbnail: string;
  priceNormal: number;
  priceSubscription: number;
}

export default function ProductBuyBox({
  productKey,
  title,
  thumbnail,
  priceNormal,
  priceSubscription
}: ProductBuyBoxProps) {
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">("subscription");
  const { formatPrice } = useCurrency();

  return (
    <>
      {/* Price Display */}
      <div className="flex items-end gap-3 mb-6">
        <span className={`text-3xl md:text-4xl font-medium text-gray-900 leading-none ${inter.className}`}>
          {purchaseType === "subscription" ? formatPrice(priceSubscription) : formatPrice(priceNormal)}
        </span>
        
        {purchaseType === "subscription" && priceSubscription < priceNormal && (
          <>
            <span className={`text-lg text-gray-400 line-through mb-0.5 ${inter.className}`}>
              {formatPrice(priceNormal)}
            </span>
            <span className={`px-2.5 py-1 bg-[#DCF5CA] text-[#1B3624] text-[11px] font-bold uppercase rounded-full mb-1 tracking-wider ${inter.className}`}>
              Économisez 15%
            </span>
          </>
        )}
      </div>

      {/* Purchase Options Toggle */}
      <div className="flex flex-col gap-3 mb-6">
        {/* Subscription Option */}
        <label 
          className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
            purchaseType === "subscription" 
            ? "border-[#1B3624] bg-[#F6F4F1] shadow-sm" 
            : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
          onClick={() => setPurchaseType("subscription")}
        >
          <div className="mt-1 relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white">
            {purchaseType === "subscription" && <div className="w-3 h-3 rounded-full bg-[#1B3624]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-gray-900 text-[15px] ${inter.className}`}>Abonnement Mensuel</span>
              <div className="flex items-center gap-2">
                <span className={`text-[13px] text-gray-400 line-through ${inter.className}`}>{formatPrice(priceNormal)}</span>
                <span className={`font-bold text-gray-900 text-[15px] ${inter.className}`}>{formatPrice(priceSubscription)}</span>
              </div>
            </div>
            <p className={`text-[13px] text-gray-500 mt-1.5 leading-snug ${inter.className}`}>
              Cure de 30 jours livrée mensuellement.<br/>Mettez en pause ou annulez à tout moment.
            </p>
          </div>
        </label>

        {/* One-time Option */}
        <label 
          className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
            purchaseType === "one-time" 
            ? "border-[#1B3624] bg-[#F6F4F1] shadow-sm" 
            : "border-gray-200 hover:border-gray-300 bg-white"
          }`}
          onClick={() => setPurchaseType("one-time")}
        >
          <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white">
            {purchaseType === "one-time" && <div className="w-3 h-3 rounded-full bg-[#1B3624]" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <span className={`font-semibold text-gray-900 text-[15px] ${inter.className}`}>Achat Unique</span>
              <span className={`font-bold text-gray-900 text-[15px] ${inter.className}`}>{formatPrice(priceNormal)}</span>
            </div>
          </div>
        </label>
      </div>

      {/* CTA */}
      <div className="mb-4">
        <AddToCartButton
          productKey={productKey}
          purchaseType={purchaseType}
          title={title}
          thumbnail={thumbnail}
          price={purchaseType === "subscription" ? priceSubscription : priceNormal}
        />
      </div>
    </>
  );
}
