"use client";

import { useState } from "react";
import TransparentHandImage from "./TransparentHandImage";
import { useTranslations } from "next-intl";

const products = [
  { number: "01", name: "Crave Control" },
  { number: "02", name: "Apple Satiety Shot" },
  { number: "03", name: "Helya Hydrate" },
  { number: "04", name: "Helya Vigor" },
];

const statsKeys = [
  { value: "1000+", key: "clients" },
  { value: "25+", key: "formulas" },
  { value: "15+", key: "years" },
];

export default function HeroSection() {
  const [activeProduct, setActiveProduct] = useState(0);
  const t = useTranslations("Hero");

  return (
    <section className="relative w-full bg-[#F6F4F1] overflow-hidden flex items-start">
      {/* Watermark background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
        <span
          className="font-black tracking-tight whitespace-nowrap"
          style={{
            fontSize: "clamp(80px, 16vw, 200px)",
            color: "rgba(0,0,0,0.04)",
            lineHeight: 1,
            userSelect: "none",
          }}
        >
          HelyaCare
        </span>
      </div>

      {/* Main layout: 1 column mobile, 3 columns desktop */}
      <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 md:px-8 grid grid-cols-1 md:grid-cols-[1fr_1fr] lg:grid-cols-[340px_1fr_210px] gap-8 lg:gap-4 items-start pt-12 md:pt-20 pb-0">

        {/* ── LEFT: text content ── */}
        <div className="flex flex-col gap-5 md:gap-4 order-1">
          <h1 className="text-4xl lg:text-[2.75rem] font-extrabold leading-[1.1] text-[#0F3D3E] tracking-tight mt-0">
            {t("title1")}<br />
            {t("title2")}<br />
            {t("title3")}
          </h1>

          <p className="text-[15px] md:text-[0.88rem] leading-[1.6] md:leading-[1.7] text-gray-500">
            {t("subtitle")}
          </p>

          <div className="flex flex-col md:flex-row items-center gap-4 mt-2">
            <button className="w-full md:w-auto bg-[#E56B2D] hover:bg-[#cf5c22] text-white font-semibold text-base md:text-sm px-6 py-4 md:py-3 rounded-xl md:rounded-md transition-colors text-center shadow-lg shadow-[#E56B2D]/20">
              {t("discoverBtn")}
            </button>
            <button className="flex items-center justify-center gap-2.5 text-[#0F3D3E] text-[15px] md:text-sm font-medium hover:opacity-70 transition-opacity w-full md:w-auto py-3 md:py-0">
              <span className="w-8 h-8 rounded-full border-2 border-[#0F3D3E] flex items-center justify-center flex-shrink-0">
                <svg width="10" height="11" viewBox="0 0 10 12" fill="none">
                  <path d="M1 1.5L9 6L1 10.5V1.5Z" fill="#0F3D3E" />
                </svg>
              </span>
              {t("videoBtn")}
            </button>
          </div>

          {/* Stats */}
          <div className="flex items-start justify-between md:justify-start md:gap-8 pt-8 md:pt-5 border-t border-[#D8D2C6] mt-4 md:mt-0">
            {statsKeys.map((s) => (
              <div key={s.value} className="flex flex-col items-center md:items-start">
                <span className="text-[1.7rem] md:text-[1.9rem] font-bold text-[#0F3D3E] leading-none">{s.value}</span>
                <span className="text-[11px] md:text-[0.7rem] text-gray-500 whitespace-pre-line leading-snug mt-1 text-center md:text-left">{t(`stats.${s.key}`)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CENTER: hand image ── */}
        <div className="relative flex items-end justify-center mt-4 md:-mt-10 lg:-mt-20 h-[350px] sm:h-[450px] md:h-[600px] lg:h-[700px] order-2 md:col-span-2 lg:col-span-1">
          <TransparentHandImage
            src="/hero-hand-final.png"
            alt="Main tenant une gélule HelyaCare"
            className="h-full w-auto object-contain object-bottom transition-transform duration-700 ease-out hover:scale-105"
          />
        </div>

        {/* ── RIGHT: product list ── */}
        <div className="flex flex-row lg:flex-col overflow-x-auto snap-x snap-mandatory gap-6 lg:gap-5 pb-6 lg:pb-0 order-3 md:col-span-2 lg:col-span-1 hide-scrollbar">
          {products.map((p, i) => (
            <button
              key={p.number}
              onClick={() => setActiveProduct(i)}
              className="flex flex-col lg:flex-row items-center lg:items-start gap-2 lg:gap-3 text-center lg:text-left group shrink-0 snap-center lg:snap-align-none w-[120px] lg:w-auto"
            >
              {/* Active bar (horizontal on mobile, vertical on desktop) */}
              <div
                className={`h-[3px] lg:w-[2px] lg:h-auto self-stretch rounded-full flex-shrink-0 transition-all duration-300 ${
                  activeProduct === i ? "bg-[#0F3D3E]" : "bg-transparent"
                }`}
              />
              <div className="flex flex-col items-center lg:items-start">
                <span
                  className={`text-[11px] lg:text-[0.65rem] font-semibold mb-0.5 transition-colors ${
                    activeProduct === i ? "text-[#0F3D3E]" : "text-gray-400"
                  }`}
                >
                  {p.number}
                </span>
                <span
                  className={`text-[14px] lg:text-[0.9rem] font-bold transition-colors ${
                    activeProduct === i
                      ? "text-[#0F3D3E]"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {p.name}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
