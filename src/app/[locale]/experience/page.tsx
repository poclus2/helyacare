"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { useState } from "react";
import "./experience.css";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function ExperiencePage() {
  const t = useTranslations("Experience");
  const [expandedCard, setExpandedCard] = useState(1);
  const [activeResult, setActiveResult] = useState(0);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className={`flex-grow bg-[#F7F6F2] ${pjs.className}`}>
        {/* ── 1. HERO (STYLE MISSION EXACT) ── */}
        <section className="relative min-h-[40vh] flex flex-col justify-end pt-24 pb-8 px-6 md:px-10 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop" 
              alt="Experience Hero" 
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay gradient similaire à boutique/mission */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />
          </div>

          <div className="relative z-10 w-full max-w-[1300px] mx-auto pb-5">
            <p className="text-[11px] font-bold text-[#CBF27A] uppercase tracking-[0.25em] mb-4">
              {t("hero.eyebrow")}
            </p>
            <h1 className={`text-white text-4xl md:text-5xl lg:text-[46px] font-medium leading-[1.1] mb-6 max-w-[600px] tracking-[-0.5px] ${inter.className}`}>
              {t("hero.title1")}<br />{t("hero.title2")}
            </h1>
            <p className="text-white/90 text-[15px] md:text-base font-light max-w-xl leading-relaxed mb-6">
              {t("hero.subtitle")}
            </p>
          </div>
        </section>

        {/* ── 2. LA MÉTHODE (Animated Accordion) ── */}
        <section className="bg-white py-24 md:py-36">
          <div className="max-w-[1280px] mx-auto px-6">
            
            {/* Header de section */}
            <div className="text-center lg:text-left mb-16 md:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-8 h-px bg-[#CBF27A]" />
                  <span className="text-sm font-bold text-[#CBF27A] uppercase tracking-widest">
                    {t("method.eyebrow")}
                  </span>
                  <div className="w-8 h-px bg-[#CBF27A] lg:hidden" />
                </div>
                <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                  {t("method.title1")}<br className="hidden lg:block" />
                  {t("method.title2")}
                </h2>
              </div>
              <p className="text-[#0F3D3E]/70 text-lg max-w-lg font-light">
                {t("method.subtitle")}
              </p>
            </div>

            {/* Accordion interactif */}
            <div className="flex flex-col lg:flex-row gap-4 w-full h-auto lg:h-[480px]">
              {[
                {
                  id: "01",
                  title: t("method.steps.s1_title"),
                  desc: t("method.steps.s1_desc"),
                  img: "/images/experience/ai_watch_analysis.png",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                },
                {
                  id: "02",
                  title: t("method.steps.s2_title"),
                  desc: t("method.steps.s2_desc"),
                  img: "/images/experience/experience_bento_botanical.png",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22c4.97 0 9-4.03 9-9-4.97 0-9-4.03-9-9s-9 4.03-9 9c0 4.97 4.03 9 9 9z"/></svg>
                },
                {
                  id: "03",
                  title: t("method.steps.s3_title"),
                  desc: t("method.steps.s3_desc"),
                  img: "/images/experience/experience_clinical_lab.png",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/></svg>
                },
                {
                  id: "04",
                  title: t("method.steps.s4_title"),
                  desc: t("method.steps.s4_desc"),
                  img: "/images/experience/experience_doctors_panel_new.png",
                  icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                }
              ].map((step, idx) => {
                const isExpanded = expandedCard === idx;
                return (
                  <div 
                    key={step.id}
                    onMouseEnter={() => setExpandedCard(idx)}
                    onClick={() => setExpandedCard(idx)}
                    className={`relative rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.25,1)] flex flex-col bg-[#F7F6F2] border border-gray-100 shadow-sm hover:shadow-md ${isExpanded ? 'h-[460px] lg:h-auto lg:flex-[2.5]' : 'h-24 lg:h-auto lg:flex-1'}`}
                  >
                    <div className={`w-full h-full flex ${isExpanded ? 'flex-col' : 'flex-row items-center lg:flex-col lg:items-start lg:justify-end'} p-5 md:p-6 lg:p-8 relative`}>
                      
                      {/* Grand Numéro de fond (Desktop) ou Numéro inline (Mobile fermé) */}
                      <div className={`
                        font-bold text-gray-200 transition-opacity duration-300 pointer-events-none shrink-0
                        ${isExpanded ? 'absolute top-4 left-5 lg:top-6 lg:left-6 text-4xl lg:text-5xl opacity-0' : 'text-5xl mr-4 lg:absolute lg:top-6 lg:left-6 lg:opacity-100'}
                      `}>
                        {step.id}
                      </div>

                      {/* Image (visible uniquement si ouvert) */}
                      <div className={`w-full relative rounded-2xl overflow-hidden transition-all duration-700 shrink-0 ${isExpanded ? 'h-48 md:h-56 lg:h-56 mb-4 lg:mb-6 opacity-100 scale-100' : 'h-0 mb-0 opacity-0 scale-95 hidden lg:block'}`}>
                        <img src={step.img} alt={step.title} className="absolute inset-0 w-full h-full object-cover object-center" />
                      </div>

                      {/* Icone et Textes */}
                      <div className={`flex flex-col ${isExpanded ? 'lg:justify-start' : 'justify-center'}`}>
                        {/* Icone : cachée sur mobile fermé si on manque de place, mais visible sur desktop */}
                        <div className={`rounded-full border border-gray-200 flex items-center justify-center text-[#0F3D3E]/60 bg-white shadow-sm transition-all duration-500 shrink-0 ${isExpanded ? 'w-10 h-10 mb-3 scale-100' : 'hidden lg:flex lg:w-10 lg:h-10 lg:mb-4 lg:scale-90'}`}>
                          {step.icon}
                        </div>
                        
                        <h3 className={`font-bold text-[#0F3D3E] transition-all duration-300 ${isExpanded ? 'text-xl lg:text-2xl mb-2' : 'text-lg lg:text-xl'}`}>
                          {step.title}
                        </h3>
                        
                        <div className={`transition-all duration-700 overflow-hidden ${isExpanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
                          <p className="text-gray-500 font-light text-sm lg:text-base leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>

                    </div>
                  </div>
                )
              })}
            </div>

          </div>
        </section>

        {/* ── 3. LES RÉSULTATS (Preuves Cliniques Interactives) ── */}
        <section className="bg-[#0F3D3E] py-24 md:py-36 overflow-hidden">
          <div className="max-w-[1280px] mx-auto px-6">
            
            {/* Header */}
            <div className="text-center lg:text-left mb-16 md:mb-24 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
                  <div className="w-8 h-px bg-[#CBF27A]/30" />
                  <span className="text-sm font-semibold text-[#CBF27A] uppercase tracking-widest">
                    {t("results.eyebrow")}
                  </span>
                  <div className="w-8 h-px bg-[#CBF27A]/30 lg:hidden" />
                </div>
                <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight ${inter.className}`}>
                  {t("results.title1")}<br className="hidden lg:block" />
                  {t("results.title2")}
                </h2>
              </div>
              <p className="text-white/70 text-lg max-w-lg font-light">
                {t("results.subtitle")}
              </p>
            </div>

            {/* Timeline interactif */}
            <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
              
              {/* Left Image Side */}
              <div className="w-full lg:w-1/2 relative">
                 {/* Green glow background */}
                 <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#CBF27A]/10 blur-[100px] rounded-full pointer-events-none"></div>
                 
                 <div className="relative w-full aspect-[4/5] md:aspect-square lg:aspect-[4/5] rounded-[32px] overflow-hidden shadow-2xl border border-white/10">
                    {[
                      "/images/experience/sommeil_profond_v2.png",
                      "/images/experience/controle_envies_v2.png",
                      "/images/experience/energie_durable_v2.png"
                    ].map((imgSrc, idx) => (
                      <img 
                        key={idx}
                        src={imgSrc} 
                        alt="Résultats Cliniques"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeResult === idx ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'}`}
                      />
                    ))}
                 </div>
                 
                 {/* Floating Badge (Animated) */}
                 <div className="absolute -bottom-6 -right-2 md:-right-8 bg-[#F7F6F2] backdrop-blur-md p-5 md:p-6 rounded-3xl shadow-xl border border-white/20 flex flex-col gap-3 z-20 w-[220px] md:w-[260px] transition-transform duration-700 hover:-translate-y-2">
                    <div className="text-xs font-bold text-[#0F3D3E] mb-1 border-b border-gray-200 pb-2 uppercase tracking-wide">{t("results.badge_eyebrow")}</div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-[#CBF27A] flex items-center justify-center text-[#0F3D3E] shrink-0 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>
                      </div>
                      <div>
                        <div className="text-[10px] md:text-xs text-gray-500 uppercase tracking-wider">Métabolisme</div>
                        <div className="text-xl md:text-2xl font-black text-[#0F3D3E]">+ 82%</div>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Right Timeline Side */}
               <div className="w-full lg:w-1/2 flex flex-col pt-8 lg:pt-0">
                 {[
                    {
                      title: t("results.res1_title"),
                      desc: t("results.res1_desc"),
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
                    },
                    {
                      title: t("results.res2_title"),
                      desc: t("results.res2_desc"),
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                    },
                    {
                      title: t("results.res3_title"),
                      desc: t("results.res3_desc"),
                      icon: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
                    }
                 ].map((res, idx) => {
                   const isActive = activeResult === idx;
                   return (
                     <div 
                       key={idx}
                       onClick={() => setActiveResult(idx)}
                       className={`flex items-start gap-4 md:gap-6 relative cursor-pointer group py-6 md:py-8 pl-6 md:pl-8 border-l-[3px] transition-colors duration-500 ${isActive ? 'border-[#CBF27A]' : 'border-white/20 hover:border-white/40'}`}
                     >
                       {/* Icon */}
                       <div className={`w-14 h-14 md:w-16 md:h-16 shrink-0 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border ${isActive ? 'bg-[#CBF27A] border-[#CBF27A] text-[#0F3D3E] scale-110' : 'bg-white/5 border-white/10 text-white/50 group-hover:bg-white/10 group-hover:text-white/80'}`}>
                         {res.icon}
                       </div>
                       
                       {/* Text */}
                       <div className="flex flex-col pt-1">
                         <h3 className={`text-xl md:text-2xl font-bold transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                           {res.title}
                         </h3>
                         <div className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isActive ? 'max-h-40 mt-2 opacity-100' : 'max-h-0 opacity-0'}`}>
                           <p className="text-white/70 font-light leading-relaxed text-sm md:text-base">
                             {res.desc}
                           </p>
                         </div>
                       </div>
                     </div>
                   )
                 })}
              </div>
            </div>

          </div>
        </section>

        {/* ── 4. LE STANDARD D'EXCELLENCE (Panel Médical) ── */}
        <section className="bg-white py-24 md:py-32 relative overflow-hidden">
          
          {/* Forme décorative floue */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#CBF27A]/10 blur-[120px] rounded-full pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="max-w-[1280px] mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            
            {/* Texte */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center justify-center lg:justify-start gap-4 mb-6">
                <div className="w-8 h-px bg-[#CBF27A]" />
                <span className="text-sm font-bold text-[#CBF27A] uppercase tracking-widest">
                  {t("rigor.eyebrow")}
                </span>
                <div className="w-8 h-px bg-[#CBF27A] lg:hidden" />
              </div>
              
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F3D3E] leading-tight mb-8 ${inter.className}`}>
                {t("rigor.title1")}<br />
                {t("rigor.title2")}
              </h2>
              
              <p className="text-gray-500 text-lg font-light leading-relaxed mb-8">
                {t("rigor.p1")}
                <br /><br />
                {t("rigor.p2")}
              </p>

              <button className="bg-[#CBF27A] text-[#0F3D3E] px-8 py-4 rounded-full font-bold text-sm uppercase tracking-wide hover:bg-[#0F3D3E] hover:text-white transition-colors duration-300">
                {t("rigor.btn")}
              </button>
            </div>

            {/* Image */}
            <div className="flex-1 w-full relative">
              <div className="aspect-[4/5] lg:aspect-square rounded-3xl overflow-hidden shadow-2xl relative border border-gray-100">
                <div className="absolute inset-0 bg-[#0F3D3E]/5 z-10 mix-blend-overlay"></div>
                <img 
                  src="/images/experience/notre_rigueur_botanical.png" 
                  alt="Recherche Scientifique HelyaCare" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Badge flottant */}
              <div className="absolute -bottom-6 -left-6 lg:-bottom-10 lg:-left-10 bg-white p-6 rounded-2xl shadow-xl border border-gray-100 z-20 flex items-center gap-4 hidden md:flex">
                <div className="w-12 h-12 rounded-full bg-[#F4F7FB] flex items-center justify-center text-[#0F3D3E]">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-[#0F3D3E]">{t("rigor.badge_title")}</p>
                  <p className="text-xs text-gray-500">{t("rigor.badge_desc")}</p>
                </div>
              </div>
            </div>

          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
