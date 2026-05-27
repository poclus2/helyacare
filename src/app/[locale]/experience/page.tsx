"use client";

import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Beaker, Brain, Activity } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Link } from "@/navigation";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function ExperiencePage() {
  const t = useTranslations("Experience");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const doctors = t.raw("experts.doctors") as { name: string; role: string; quote: string }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <>
      <Header />
      <main className={`min-h-[100dvh] bg-white text-gray-900 ${pjs.className}`}>

        {/* ── 1. HERO (STYLE MISSION) */}
        <section className="relative min-h-[50vh] md:min-h-[60vh] flex flex-col justify-end pt-32 pb-12 px-6 md:px-10 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0 bg-[#0F3D3E]">
            <Image 
              src="/images/experience/experience_hero_v3.png" 
              alt="HelyaCare Experience" 
              fill
              className="object-cover object-center opacity-90"
              priority
            />
            {/* Overlay gradient similaire à boutique/mission */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70 mix-blend-multiply" />
          </div>

          {/* Contenu */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto pb-5">
            <motion.p 
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-[11px] font-bold text-[#CBF27A] uppercase tracking-[0.25em] mb-4"
            >
              Science & Nature
            </motion.p>
            <motion.h1 
              initial={reduce ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className={`text-white text-4xl md:text-6xl lg:text-[72px] font-medium leading-[1.05] mb-6 max-w-[800px] tracking-[-1px] ${inter.className}`}
            >
              {t("hero.title")}
            </motion.h1>
            <motion.p 
              initial={reduce ? false : { opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/90 text-lg md:text-xl font-light max-w-2xl leading-relaxed mb-8"
            >
              {t("hero.subtitle")}
            </motion.p>
          </div>
        </section>

        {/* ── 2. STATS (ASYMMETRIC, TASTE SKILL) */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-20">
              <h2 className={`text-3xl md:text-5xl font-bold tracking-tight text-[#0F3D3E] max-w-lg leading-[1.1] ${inter.className}`}>
                {t("stats.title")}
              </h2>
              <p className="text-gray-500 max-w-md text-base leading-relaxed">
                Une approche holistique validée par des résultats cliniques probants sur l'ensemble du spectre du bien-être.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
              {/* Stat 1 (Large) */}
              <motion.div 
                initial={reduce ? false : { opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                className="md:col-span-5 bg-[#F4F3EE] rounded-3xl p-10 flex flex-col justify-between min-h-[300px]"
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-12 shadow-sm">
                  <Activity className="w-5 h-5 text-[#0F3D3E]" />
                </div>
                <div>
                  <h3 className={`text-7xl font-black text-[#0F3D3E] tracking-tighter mb-4 ${inter.className}`}>95%</h3>
                  <p className="text-gray-600 font-medium">{t("stats.s1_label")}</p>
                </div>
              </motion.div>

              {/* Stat 2 & 3 (Stacked vertically or side-by-side in a subgrid) */}
              <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                <motion.div 
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.1 }}
                  className="bg-[#0F3D3E] rounded-3xl p-10 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-12">
                    <Brain className="w-5 h-5 text-[#CBF27A]" />
                  </div>
                  <div>
                    <h3 className={`text-6xl font-black text-white tracking-tighter mb-4 ${inter.className}`}>87%</h3>
                    <p className="text-white/80 font-medium">{t("stats.s2_label")}</p>
                  </div>
                </motion.div>

                <motion.div 
                  initial={reduce ? false : { opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white border border-gray-200 rounded-3xl p-10 flex flex-col justify-between min-h-[300px]"
                >
                  <div className="w-12 h-12 bg-[#F4F3EE] rounded-full flex items-center justify-center mb-12">
                    <Beaker className="w-5 h-5 text-[#E56B2D]" />
                  </div>
                  <div>
                    <h3 className={`text-6xl font-black text-[#E56B2D] tracking-tighter mb-4 ${inter.className}`}>75%</h3>
                    <p className="text-gray-600 font-medium">{t("stats.s3_label")}</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. METHODOLOGY BENTO (ASYMMETRIC) */}
        <section className="py-24 md:py-32 bg-[#0F3D3E]">
          <div className="max-w-[1300px] mx-auto px-6">
            <div className="mb-20 text-center md:text-left">
              <p className="text-[11px] font-bold text-[#CBF27A] uppercase tracking-[0.2em] mb-4">La Méthode HelyaCare</p>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.05] max-w-2xl ${inter.className}`}>
                {t("dots.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[250px] md:auto-rows-[300px]">
              
              {/* Large Image Card */}
              <div className="md:col-span-7 row-span-2 relative rounded-3xl overflow-hidden group">
                <Image src="/images/experience/experience_bento_botanical.png" alt="Botanical Ingredients" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-10">
                  <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold tracking-widest mb-4">01</span>
                  <h3 className={`text-3xl font-bold text-white leading-tight ${inter.className}`}>{t("dots.step1")}</h3>
                </div>
              </div>

              {/* Top Right Card */}
              <div className="md:col-span-5 row-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-end">
                <span className="inline-block px-3 py-1 bg-[#CBF27A]/20 text-[#CBF27A] rounded-full text-xs font-bold tracking-widest mb-4 w-fit">02</span>
                <h3 className={`text-2xl font-bold text-white leading-tight mb-2 ${inter.className}`}>{t("dots.step2")}</h3>
                <p className="text-white/60 text-sm">Une analyse profonde de vos biomarqueurs et habitudes.</p>
              </div>

              {/* Bottom Right Card (Data Image) */}
              <div className="md:col-span-5 row-span-1 relative rounded-3xl overflow-hidden group">
                <Image src="/images/experience/experience_bento_data.png" alt="Data Analysis" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="inline-block px-3 py-1 bg-[#E56B2D]/20 backdrop-blur-md text-[#E56B2D] rounded-full text-xs font-bold tracking-widest mb-4">03</span>
                  <h3 className={`text-2xl font-bold text-white leading-tight ${inter.className}`}>{t("dots.step3")}</h3>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. EXPERTS (EDITORIAL STYLE) */}
        <section className="py-24 md:py-32 bg-[#F4F3EE]">
          <div className="max-w-[1300px] mx-auto px-6">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-[#0F3D3E] tracking-tight leading-[1.05] mb-20 max-w-2xl ${inter.className}`}>
              {t("experts.title")}
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
              {/* Main Panel Image */}
              <div className="lg:col-span-7">
                <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl">
                  <Image src="/images/experience/experience_doctors_panel_new.png" alt="Experts Panel" fill className="object-cover" />
                </div>
              </div>

              {/* Experts List */}
              <div className="lg:col-span-5 flex flex-col justify-center gap-12">
                {doctors.slice(1, 4).map((doc, i) => (
                  <div key={i} className="border-l-[3px] border-[#0F3D3E]/10 pl-6 relative">
                    <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.15em] mb-2">{doc.role}</p>
                    <h4 className={`text-2xl font-bold text-[#0F3D3E] mb-3 ${inter.className}`}>{doc.name}</h4>
                    <p className="text-gray-500 font-light italic leading-relaxed text-sm md:text-base max-w-sm">&ldquo;{doc.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 5. SCIENCE & FAQ */}
        <section className="py-24 md:py-32 bg-white">
          <div className="max-w-[1300px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
            
            {/* Science Image */}
            <div className="relative w-full aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-3xl overflow-hidden group">
              <Image src="/images/experience/experience_clinical_lab.png" alt="Clinical Research" fill className="object-cover transition-transform duration-1000 group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-700" />
              <div className="absolute inset-0 flex flex-col justify-end p-12">
                <p className="text-[11px] font-bold text-white uppercase tracking-[0.2em] mb-4">Recherche</p>
                <h2 className={`text-3xl md:text-4xl font-bold text-white leading-tight mb-6 ${inter.className}`}>
                  {t("clinical.title")}
                </h2>
                <Link href="/mission" className="inline-flex items-center gap-2 text-white font-semibold text-sm hover:underline underline-offset-4">
                  {t("clinical.cta")} <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* FAQ */}
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-bold text-[#CBF27A] uppercase tracking-[0.2em] mb-4">Transparence</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] mb-12 ${inter.className}`}>
                {t("faq.title")}
              </h2>
              
              <div className="flex flex-col divide-y divide-[#0F3D3E]/10 border-t border-[#0F3D3E]/10">
                {faqItems.slice(0, 5).map((faq, i) => (
                  <div key={i} className="py-6">
                    <button 
                      onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                      className="w-full flex items-start justify-between text-left group"
                    >
                      <span className={`font-semibold text-[#0F3D3E] text-lg pr-8 transition-colors group-hover:text-[#E56B2D] ${inter.className}`}>
                        {faq.q}
                      </span>
                      <span className={`text-xl font-light text-[#0F3D3E] shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    <motion.div 
                      initial={false}
                      animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-gray-500 font-light leading-relaxed pt-4 pb-2">
                        {faq.a}
                      </p>
                    </motion.div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
