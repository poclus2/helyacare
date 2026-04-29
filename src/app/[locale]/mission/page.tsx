import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, FlaskConical, Recycle, ArrowRight } from "lucide-react";
import { Link } from "@/navigation";
import { getTranslations } from "next-intl/server";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default async function MissionPage() {
  const t = await getTranslations("Mission");

  return (
    <>
      <Header />
      <main className={`text-gray-900 ${pjs.className}`}>

        {/* ── 1. HERO (STYLE BOUTIQUE) */}
        <section className="relative min-h-[80vh] flex flex-col justify-end pt-32 pb-12 px-6 md:px-10 overflow-hidden">
          {/* Image de fond */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop" 
              alt="Mission Hero" 
              className="w-full h-full object-cover object-top"
            />
            {/* Overlay gradient similaire à boutique */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/40" />
          </div>

          {/* Contenu */}
          <div className="relative z-10 w-full max-w-[1300px] mx-auto pb-5">
            <p className="text-[11px] font-bold text-[#CBF27A] uppercase tracking-[0.25em] mb-4">
              {t("hero.eyebrow")}
            </p>
            <h1 className={`text-white text-4xl md:text-5xl lg:text-[46px] font-medium leading-[1.1] mb-6 max-w-[600px] tracking-[-0.5px] ${inter.className}`}>
              {t("hero.title1")}<br />{t("hero.title2")}
            </h1>
            <p className="text-white/90 text-[15px] md:text-base font-light max-w-xl leading-relaxed mb-6">
              Helyacare est né d&apos;une conviction&nbsp;: la nature possède les codes, la science possède les clés.
            </p>
          </div>
        </section>

        {/* ── 2. L'ORIGINE */}
        <section className="bg-white py-24 md:py-36">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">
            <div className="flex flex-col gap-8 order-2 md:order-1">
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.25em]">
                {t("origin.eyebrow")}
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                {t("origin.title1")}<br />{t("origin.title2")}
              </h2>
              <div className="w-12 h-px bg-[#E56B2D]" />
              <p className="text-[15px] text-gray-500 leading-[1.9] font-light">{t("origin.p1")}</p>
              <p className="text-[15px] text-gray-500 leading-[1.9] font-light">{t("origin.p2")}</p>
              <Link href="/experience" className="inline-flex items-center gap-2 text-[#0F3D3E] font-semibold text-sm group w-fit mt-2">
                {t("origin.cta")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="relative order-1 md:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image src="/images/mission_lab_interior.png" alt="Laboratoire HelyaCare" fill className="object-cover" priority />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#0F3D3E] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">
                {t("origin.founded")}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. TROIS PILIERS */}
        <section className="bg-[#0F3D3E] py-24 md:py-36 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.25em] mb-5">
                {t("pillars.eyebrow")}
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight ${inter.className}`}>
                {t("pillars.title1")}<br />{t("pillars.title2")}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group">
                <div className="w-14 h-14 rounded-2xl bg-[#CBF27A]/10 border border-[#CBF27A]/20 flex items-center justify-center mb-8">
                  <Leaf className="w-6 h-6 text-[#CBF27A]" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>{t("pillars.p1_title")}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">{t("pillars.p1_desc")}</p>
                <div className="w-8 h-px bg-[#CBF27A]/30 mt-8" />
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group md:translate-y-8">
                <div className="w-14 h-14 rounded-2xl bg-[#E56B2D]/10 border border-[#E56B2D]/20 flex items-center justify-center mb-8">
                  <FlaskConical className="w-6 h-6 text-[#E56B2D]" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>{t("pillars.p2_title")}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">{t("pillars.p2_desc")}</p>
                <div className="w-8 h-px bg-[#E56B2D]/30 mt-8" />
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8">
                  <Recycle className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>{t("pillars.p3_title")}</h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">{t("pillars.p3_desc")}</p>
                <div className="w-8 h-px bg-white/15 mt-8" />
              </div>
            </div>
          </div>
        </section>

        {/* ── 4. CITATION EN PLEINE LARGEUR */}
        <section className="relative min-h-[560px] md:min-h-[680px] flex items-center justify-center overflow-hidden">
          <Image src="/images/mission_botanical_field.png" alt="Champs botaniques HelyaCare" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F3D3E]/75 via-[#0A192F]/60 to-[#0F3D3E]/85" />
          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="text-[10px] font-bold text-[#CBF27A]/70 uppercase tracking-[0.25em] mb-10">
              {t("heritage.eyebrow")}
            </p>
            <blockquote className={`text-3xl md:text-5xl lg:text-[3.25rem] font-light text-white leading-[1.25] italic ${inter.className}`}>
              &ldquo;{t("heritage.quote")}&rdquo;
            </blockquote>
            <div className="w-16 h-px bg-[#CBF27A]/40 mx-auto mt-14 mb-10" />
            <p className="text-white/40 text-xs font-light tracking-[0.2em] uppercase">
              {t("heritage.attribution")}
            </p>
          </div>
        </section>

        {/* ── 5. CTA FINAL */}
        <section className="bg-[#F2F0EB] py-24 md:py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-bold text-[#0F3D3E]/35 uppercase tracking-[0.25em] mb-8">
              {t("cta.eyebrow")}
            </p>
            <h2 className={`text-4xl md:text-6xl font-black text-[#0F3D3E] leading-tight mb-8 tracking-tight ${inter.className}`}>
              {t("cta.title1")}<br />{t("cta.title2")}
            </h2>
            <p className="text-[#0F3D3E]/55 text-lg font-light leading-relaxed mb-12 max-w-xl mx-auto">
              {t("cta.desc")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/boutique" className="px-8 py-4 bg-[#0F3D3E] text-white font-bold rounded-full text-sm tracking-wide hover:bg-[#1a5556] transition-colors">
                {t("cta.btn1")}
              </Link>
              <Link href="/connexion" className="px-8 py-4 bg-transparent border border-[#0F3D3E]/25 text-[#0F3D3E] font-semibold rounded-full text-sm tracking-wide hover:bg-[#0F3D3E] hover:text-white transition-colors">
                {t("cta.btn2")}
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
