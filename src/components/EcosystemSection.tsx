"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

const cards = [
  {
    id: 1,
    image: "/eco-lab.png",
    overlay: "rgba(15, 61, 62, 0.72)",
    title: "L'Excellence\nScientifique",
    description:
      "Chaque formule est le résultat de mois de recherche clinique et de tests rigoureux.",
    tall: false,
  },
  {
    id: 2,
    image: "/eco-ai.png",
    overlay: "rgba(15, 61, 62, 0.60)",
    title: "L'Intelligence\nArtificielle",
    description:
      "Notre algorithme analyse vos données pour adapter vos doses en temps réel.",
    tall: true,
  },
  {
    id: 3,
    image: "/eco-community.png",
    overlay: "rgba(101, 54, 22, 0.72)",
    title: "La Force\nCommunautaire",
    description:
      "Rejoignez des milliers de membres partageant les mêmes objectifs de longévité.",
    tall: false,
  },
];

export default function EcosystemSection() {
  const t = useTranslations("Ecosystem");

  return (
    <section className="w-full bg-[#F6F4F1] py-16 md:py-20 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        {/* Title */}
        <h2 className="text-center text-3xl md:text-[2.8rem] font-extrabold text-[#0F3D3E] tracking-tight leading-tight mb-4">
          {t("title")}
        </h2>

        <p className="text-center text-gray-500 text-[15px] md:text-[0.95rem] leading-relaxed mb-8 md:mb-12 max-w-[650px] mx-auto">
          {t("desc")}
        </p>

        {/* Cards */}
        <div className="flex flex-row overflow-x-auto snap-x snap-mandatory gap-4 pb-6 md:pb-0 hide-scrollbar md:items-center">
          {cards.map((card) => (
            <div
              key={card.id}
              className={`relative shrink-0 snap-center w-[280px] sm:w-[320px] md:w-auto md:flex-1 rounded-2xl overflow-hidden cursor-pointer group transition-transform duration-300 hover:scale-[1.02] ${
                card.tall ? "h-[400px] md:h-[460px]" : "h-[400px]"
              }`}
            >
              {/* Background image */}
              <Image
                src={card.image}
                alt={card.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />

              {/* Color overlay */}
              <div
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-80"
                style={{ backgroundColor: card.overlay }}
              />

              {/* Text content — bottom left */}
              <div className="absolute bottom-0 left-0 p-6 md:p-7 z-10">
                <h3 className="text-white text-xl md:text-[1.35rem] font-bold leading-snug whitespace-pre-line mb-2">
                  {t(`cards.c${card.id}_title`)}
                </h3>
                <p className="text-white/75 text-[13px] md:text-[0.78rem] leading-relaxed max-w-[220px]">
                  {t(`cards.c${card.id}_desc`)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
