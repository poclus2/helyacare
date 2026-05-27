"use client";

import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, Moon, Activity, Zap } from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ExperiencePage() {
  const t = useTranslations("Experience");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const reduce = useReducedMotion();

  const doctors = t.raw("experts.doctors") as { name: string; role: string; quote: string }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  const doctorImages = [
    "/images/experience/experience_dr_1_1776847915055.png",
    "/images/experience/experience_dr_4_1776847975915.png",
    "/images/experience/experience_dr_3_1776847948772.png",
    "/images/experience/experience_dr_2_1776847933658.png",
  ];

  return (
    <>
      <Header />
      <main className={`min-h-[100dvh] bg-white text-gray-900 ${pjs.className}`}>

        {/* HERO - Asymétrique, image réelle, padding limité */}
        <section className="relative pt-24 pb-20 md:pb-32 overflow-hidden bg-[#F6F4F1]">
           <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
             <div className="lg:col-span-5 z-10">
               <motion.h1 
                 initial={reduce ? false : { opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`text-5xl md:text-6xl lg:text-[4rem] font-bold tracking-tighter text-[#0F3D3E] mb-6 leading-[1.05] ${inter.className}`}
               >
                 {t("hero.title")}
               </motion.h1>
               <motion.p 
                 initial={reduce ? false : { opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.1 }}
                 className="text-base text-gray-600 max-w-[25ch] md:max-w-[35ch] mb-8 leading-relaxed"
               >
                 {t("hero.subtitle")}
               </motion.p>
               <motion.div
                 initial={reduce ? false : { opacity: 0, y: 20 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: 0.2 }}
               >
                 <button className={`bg-[#E56B2D] text-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-[#cf5c22] transition-colors ${inter.className}`}>
                   Découvrir le programme
                 </button>
               </motion.div>
             </div>
             <div className="lg:col-span-7 relative">
               <motion.div 
                 initial={reduce ? false : { opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                 className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gray-200"
               >
                 <Image src="/images/experience/experience_lifestyle_woman.png" alt="Hero" fill className="object-cover" priority />
               </motion.div>
             </div>
           </div>
        </section>

        {/* STATS - Hiérarchie forte, pas de 3-col classique */}
        <section className="py-24 bg-white border-b border-[#E8E3DC]">
           <div className="max-w-[1400px] mx-auto px-6">
             <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-[#0F3D3E] max-w-[15ch] mb-16 leading-[1.1] ${inter.className}`}>
               {t("stats.title")}
             </h2>
             
             <ul className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4">
               {[
                 { icon: <Moon className="w-6 h-6 text-[#0F3D3E]" strokeWidth={1.5} />, stat: "95%", label: t("stats.s1_label"), col: "md:col-span-4" },
                 { icon: <Activity className="w-6 h-6 text-[#0F3D3E]" strokeWidth={1.5} />, stat: "87%", label: t("stats.s2_label"), col: "md:col-span-3" },
                 { icon: <Zap className="w-6 h-6 text-[#E56B2D]" strokeWidth={1.5} />, stat: "75%", label: t("stats.s3_label"), col: "md:col-span-5" },
               ].map((item, i) => (
                 <motion.li 
                   key={i} 
                   className={`${item.col} flex flex-col justify-between min-h-[240px] p-8 bg-[#F6F4F1] rounded-2xl border border-transparent hover:border-[#E8E3DC] transition-colors`}
                   initial={reduce ? false : { opacity: 0, y: 24 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.3 }}
                   transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                 >
                   <div className="mb-8">{item.icon}</div>
                   <div>
                     <h3 className={`text-5xl md:text-7xl tracking-tighter font-black text-[#0F3D3E] mb-3 ${inter.className}`}>{item.stat}</h3>
                     <p className="text-sm text-gray-600 font-medium leading-relaxed max-w-[20ch]">{item.label}</p>
                   </div>
                 </motion.li>
               ))}
             </ul>
           </div>
        </section>

        {/* CONNECTING THE DOTS (BENTO ASYMETRIQUE) */}
        <section className="py-32 bg-[#0F3D3E] text-white overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6">
            <div className="mb-20">
              <h2 className={`text-4xl md:text-6xl font-bold tracking-tight leading-[1.05] max-w-[20ch] ${inter.className}`}>
                {t("dots.title")}
              </h2>
              <p className="mt-8 text-white/70 max-w-[45ch] text-base leading-relaxed">
                {t("dots.desc")}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 grid-rows-[auto] gap-6">
              <div className="md:col-span-7 relative min-h-[450px] rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-end p-8">
                <Image src="/images/products/crave-control/macro.png" alt="Macro" fill className="object-cover opacity-50 mix-blend-luminosity" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E]/90 to-transparent" />
                <div className="relative z-10 max-w-sm">
                  <span className="text-[#CBF27A] font-bold text-sm tracking-widest mb-4 block">01</span>
                  <h4 className={`text-3xl font-bold leading-tight ${inter.className}`}>{t("dots.step1")}</h4>
                </div>
              </div>
              
              <div className="md:col-span-5 relative min-h-[450px] rounded-2xl bg-white/5 border border-white/10 overflow-hidden flex flex-col justify-end p-8">
                 <Image src="/images/experience/experience_data_scan_1776847840025.png" alt="Data" fill className="object-cover opacity-50" />
                 <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E]/90 to-transparent" />
                 <div className="relative z-10 max-w-sm">
                  <span className="text-[#CBF27A] font-bold text-sm tracking-widest mb-4 block">02</span>
                  <h4 className={`text-3xl font-bold leading-tight ${inter.className}`}>{t("dots.step2")}</h4>
                 </div>
              </div>

              <div className="md:col-span-4 relative min-h-[350px] rounded-2xl bg-white/5 border border-white/10 p-8 flex flex-col">
                 <span className="text-[#CBF27A] font-bold text-sm tracking-widest mb-auto block">03</span>
                 <h4 className={`text-2xl font-bold leading-tight mb-6 ${inter.className}`}>{t("dots.step3")}</h4>
                 <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                   <Image src="/images/experience/experience_capsule_dose_1776847856802.png" alt="Capsules" fill className="object-cover opacity-80" />
                 </div>
              </div>

              <div className="md:col-span-8 relative min-h-[350px] rounded-2xl bg-[#E56B2D] border border-[#E56B2D]/50 p-8 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
                <div className="relative z-10 flex-1">
                  <span className="text-white/80 font-bold text-sm tracking-widest mb-6 block">04</span>
                  <h4 className={`text-4xl font-bold leading-[1.1] mb-6 ${inter.className}`}>{t("dots.step4")}</h4>
                </div>
                <div className="relative w-full md:w-1/2 aspect-[4/3] rounded-xl overflow-hidden shadow-2xl">
                  <Image src="/images/experience/experience_phone_ai_1776847877619.png" alt="Phone" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CLINICAL */}
        <section className="py-32 bg-[#F6F4F1]">
           <div className="max-w-[1400px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
             <div>
               <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-[#0F3D3E] max-w-[12ch] leading-[1.05] mb-8 ${inter.className}`}>{t("clinical.title")}</h2>
               <p className="text-gray-600 max-w-[45ch] leading-relaxed mb-10 text-lg">{t("clinical.desc")}</p>
               <button className="flex items-center gap-3 text-sm font-bold text-[#E56B2D] hover:underline underline-offset-4 tracking-wide uppercase">
                 {t("clinical.cta")} <ArrowRight className="w-4 h-4" />
               </button>
             </div>
             <motion.div 
               initial={reduce ? false : { opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true, amount: 0.3 }}
               className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden"
             >
               <Image src="/images/experience/experience_scan_1776847815539.png" alt="Clinical" fill className="object-cover" />
             </motion.div>
           </div>
        </section>

        {/* EXPERTS - Clean Grid */}
        <section className="py-32 bg-white border-t border-[#E8E3DC]">
           <div className="max-w-[1400px] mx-auto px-6">
             <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] tracking-tight mb-20 max-w-[15ch] leading-[1.05] ${inter.className}`}>{t("experts.title")}</h2>
             
             <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-8">
               {doctors.map((doc, i) => (
                 <motion.li 
                   key={i} 
                   className="flex flex-col"
                   initial={reduce ? false : { opacity: 0, y: 24 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true, amount: 0.3 }}
                   transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                 >
                   <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden mb-8 bg-gray-100">
                     <Image src={doctorImages[i]} alt={doc.name} fill className="object-cover grayscale hover:grayscale-0 transition-all duration-500" sizes="(max-width: 768px) 100vw, 25vw" />
                   </div>
                   <h4 className={`font-bold text-[#0F3D3E] text-xl mb-1 ${inter.className}`}>{doc.name}</h4>
                   <p className="text-[#E56B2D] text-sm font-semibold tracking-wide uppercase mb-6">{doc.role}</p>
                   <p className="text-gray-600 text-base leading-relaxed">&ldquo;{doc.quote}&rdquo;</p>
                 </motion.li>
               ))}
             </ul>
           </div>
        </section>

        {/* FAQ - Minimalist Editorial */}
        <section className="py-32 bg-white border-t border-[#E8E3DC]">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className={`text-4xl md:text-5xl font-bold tracking-tight text-[#0F3D3E] mb-20 ${inter.className}`}>{t("faq.title")}</h2>
            
            <div className="flex flex-col border-t border-[#0F3D3E]/10">
              {faqItems.map((faq, i) => (
                <div key={i} className="border-b border-[#0F3D3E]/10">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)} 
                    className="w-full flex items-start justify-between py-8 text-left group"
                  >
                    <span className={`font-bold text-[#0F3D3E] text-xl pr-8 transition-colors group-hover:text-[#E56B2D] leading-tight ${inter.className}`}>
                      {faq.q}
                    </span>
                    <span className={`text-2xl font-light text-gray-400 shrink-0 transition-transform duration-300 ${openFaq === i ? "rotate-180" : ""}`}>
                      ↓
                    </span>
                  </button>
                  <motion.div 
                    initial={false}
                    animate={{ height: openFaq === i ? "auto" : 0, opacity: openFaq === i ? 1 : 0 }}
                    className="overflow-hidden"
                  >
                    <p className="text-gray-600 leading-relaxed text-lg pb-10 max-w-[60ch]">
                      {faq.a}
                    </p>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
