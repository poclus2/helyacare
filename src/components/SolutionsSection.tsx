"use client";

import Image from "next/image";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

const products = [
  {
    id: 1,
    badge: "Best seller",
    badgeColor: "#E56B2D",
    name: "Crave Control",
    subtitle: "Bouclier Neuro-Métabolique",
    image: "/crave-control.png",
  },
  {
    id: 2,
    badge: "New",
    badgeColor: "#3CA0A0",
    name: "Helya Vigor",
    subtitle: "Énergie & Endurance",
    image: "/crave-control.png",
  },
  {
    id: 3,
    badge: "New",
    badgeColor: "#3CA0A0",
    name: "Helya Hydrate",
    subtitle: "Électrolytes & Hydratation",
    image: "/crave-control.png",
  },
  {
    id: 4,
    badge: "New",
    badgeColor: "#3CA0A0",
    name: "Satiety Shot",
    subtitle: "Régulateur Gastrique",
    image: "/crave-control.png",
  },
];

export default function SolutionsSection() {
  const t = useTranslations("Solutions");

  return (
    <section className="w-full bg-[#0F3D3E] py-16 md:py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-start justify-between mb-4 md:mb-3">
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold text-white leading-tight tracking-tight">
            {t("title")}
          </h2>
          <Link
            href="/boutique"
            className="text-white font-semibold text-sm underline underline-offset-4 decoration-2 hover:opacity-70 transition-opacity mt-2 md:mt-3 flex-shrink-0 self-start md:self-auto"
          >
            {t("seeAll")}
          </Link>
        </div>

        {/* Subtitle */}
        <p className="text-white/60 text-sm leading-relaxed mb-8 md:mb-10 max-w-[420px]">
          {t("desc")}
        </p>

        {/* Cards container: horizontal scroll on mobile, grid on desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:gap-6 pb-6 md:pb-0 hide-scrollbar md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative rounded-[24px] p-6 flex flex-col items-center text-center cursor-pointer transition-transform duration-300 ease-out hover:scale-[1.04] hover:shadow-2xl overflow-hidden shrink-0 snap-center w-[280px] md:w-auto"
              style={{ backgroundColor: "rgba(217,217,217,0.26)" }}
            >
              {/* Spotlight Glow */}
              <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${product.badgeColor}25 0%, transparent 70%)`
                }}
              />

              {/* Badge */}
              <div className="self-start mb-4 relative z-10">
                <span
                  className="text-white text-[0.65rem] font-bold px-3 py-1.5 rounded-full"
                  style={{ backgroundColor: product.badgeColor }}
                >
                  {product.badge}
                </span>
              </div>

              {/* Name & subtitle */}
              <div className="w-full text-center mb-4 relative z-10">
                <h3 className="text-white text-[1.3rem] font-bold leading-snug tracking-tight">
                  {product.name}
                </h3>
                <p className="text-white/60 text-[0.7rem] uppercase tracking-wide mt-1 font-semibold">
                  {t(`products.p${product.id}_subtitle`)}
                </p>
              </div>

              {/* Product image */}
              <div className="w-full flex items-center justify-center my-3 relative z-10" style={{ height: "230px" }}>
                <Image
                  src={product.image}
                  alt={product.name}
                  width={230}
                  height={230}
                  className="h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-110"
                />
              </div>

              {/* CTA button */}
              <button className="mt-auto w-full bg-[#0F3D3E] text-white text-[0.85rem] font-semibold py-3.5 rounded-[8px] transition-all duration-300 group-hover:bg-white group-hover:text-[#0F3D3E] relative z-10">
                {t("discoverBtn")}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
