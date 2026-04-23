import { Link } from "@/navigation";
import React from "react";
import { useTranslations } from "next-intl";
import { Dna } from "lucide-react";
import Image from "next/image";

export default function Footer() {
  const t = useTranslations("Footer");
  return (
    <footer className="w-full bg-[#0F3D3E] pt-12 md:pt-16 px-4 md:px-8 text-white pb-12 md:pb-8">
      {/* Newsletter (Top on Mobile, right on Desktop inside grid) */}
      <div className="max-w-[1280px] mx-auto flex flex-col md:hidden gap-4 mb-10 pb-10 border-b border-white/10">
        <h4 className="font-bold tracking-[0.1em] uppercase text-[0.65rem] text-white/40 mb-1">{t("joinMovement")}</h4>
        <p className="text-white/60 text-[0.85rem] leading-relaxed">
          {t("newsletterText")}
        </p>
        <div className="flex w-full mt-2">
          <input 
            type="email" 
            placeholder={t("emailPlaceholder")}
            className="flex-1 w-0 bg-white/5 border border-white/10 rounded-l-md px-4 py-3 text-[0.85rem] outline-none focus:border-[#E56B2D] transition-colors text-white placeholder:text-white/30"
          />
          <button className="bg-[#E56B2D] text-white px-4 md:px-5 py-3 text-[0.85rem] font-bold rounded-r-md hover:bg-[#d45a1e] transition-colors whitespace-nowrap">
            {t("subscribeBtn")}
          </button>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 border-b border-white/10 pb-8 md:pb-12 mb-8">
        
        {/* Brand & Mission */}
        <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left gap-4 md:mb-0 mb-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-2xl font-black tracking-tighter">HELYACARE</div>
            <Image 
              src="/logo-white.png" 
              alt="HelyaCare Logo" 
              width={32} 
              height={32} 
              className="object-contain" 
              unoptimized
            />
          </div>
          <p className="text-white/60 text-[0.85rem] leading-relaxed max-w-[280px] mt-2">
            {t("missionText")}
          </p>
        </div>

        {/* Links: Boutique */}
        <div className="col-span-1 md:col-span-2">
          {/* Mobile Accordion */}
          <details className="group md:hidden border-b border-white/10 pb-4">
            <summary className="font-bold tracking-[0.1em] uppercase text-[0.7rem] text-white/80 cursor-pointer list-none flex justify-between items-center w-full">
              {t("boutiqueTitle")}
              <span className="group-open:hidden text-lg leading-none">+</span>
              <span className="hidden group-open:inline text-lg leading-none">-</span>
            </summary>
            <div className="flex flex-col gap-4 text-[0.9rem] mt-5">
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("allProducts")}</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">Crave Control</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">Helya Vigor</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("subscription")}</Link>
            </div>
          </details>
          
          {/* Desktop Links */}
          <div className="hidden md:flex flex-col gap-3 text-[0.9rem]">
            <h4 className="font-bold tracking-[0.1em] uppercase text-[0.65rem] text-white/40 mb-2">{t("boutiqueTitle")}</h4>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("allProducts")}</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">Crave Control</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">Helya Vigor</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("subscription")}</Link>
          </div>
        </div>

        {/* Links: Marque */}
        <div className="col-span-1 md:col-span-2">
          {/* Mobile Accordion */}
          <details className="group md:hidden border-b border-white/10 pb-4">
            <summary className="font-bold tracking-[0.1em] uppercase text-[0.7rem] text-white/80 cursor-pointer list-none flex justify-between items-center w-full">
              {t("brandTitle")}
              <span className="group-open:hidden text-lg leading-none">+</span>
              <span className="hidden group-open:inline text-lg leading-none">-</span>
            </summary>
            <div className="flex flex-col gap-4 text-[0.9rem] mt-5">
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("ourMission")}</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("science")}</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("journal")}</Link>
              <Link href="#" className="text-white/60 hover:text-[#3CA0A0] transition-colors">{t("faq")}</Link>
            </div>
          </details>
          
          {/* Desktop Links */}
          <div className="hidden md:flex flex-col gap-3 text-[0.9rem]">
            <h4 className="font-bold tracking-[0.1em] uppercase text-[0.65rem] text-white/40 mb-2">{t("brandTitle")}</h4>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("ourMission")}</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("science")}</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("journal")}</Link>
            <Link href="#" className="text-white/80 hover:text-[#3CA0A0] transition-colors">{t("faq")}</Link>
          </div>
        </div>

        {/* Newsletter (Desktop Only) */}
        <div className="col-span-1 md:col-span-4 hidden md:flex flex-col gap-4">
          <h4 className="font-bold tracking-[0.1em] uppercase text-[0.65rem] text-white/40 mb-1">{t("joinMovement")}</h4>
          <p className="text-white/60 text-[0.85rem] leading-relaxed">
            {t("newsletterText")}
          </p>
          <div className="flex w-full mt-3">
            <input 
              type="email" 
              placeholder={t("emailPlaceholder")}
              className="flex-1 bg-white/5 border border-white/10 rounded-l-md px-4 py-2.5 text-[0.85rem] outline-none focus:border-[#E56B2D] transition-colors text-white placeholder:text-white/30"
            />
            <button className="bg-[#E56B2D] text-white px-5 py-2.5 text-[0.85rem] font-bold rounded-r-md hover:bg-[#d45a1e] transition-colors">
              {t("subscribeBtn")}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center text-[0.75rem] text-white/40 gap-4">
        <p>&copy; {new Date().getFullYear()} {t("rights")}</p>
        <div className="flex flex-wrap justify-center gap-6">
          <Link href="#" className="hover:text-white transition-colors">{t("privacy")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("legal")}</Link>
          <Link href="#" className="hover:text-white transition-colors">{t("cgv")}</Link>
        </div>
      </div>
    </footer>
  );
}
