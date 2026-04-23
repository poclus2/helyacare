import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Leaf, FlaskConical, Recycle, ArrowRight } from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function MissionPage() {
  return (
    <>
      <Header />
      <main className={`text-gray-900 ${pjs.className}`}>

        {/* ── 1. HERO TYPOGRAPHIQUE ───────────────────────────────────── */}
        <section className="bg-[#F2F0EB] pt-24 md:pt-36 pb-32 px-6 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-5xl mx-auto">
            <p className="text-[11px] font-bold text-[#0F3D3E]/40 uppercase tracking-[0.25em] mb-10">
              Notre Mission
            </p>
            <h1 className={`text-5xl md:text-7xl lg:text-[6rem] font-black text-[#0F3D3E] tracking-tight leading-[1.0] mb-8 ${inter.className}`}>
              Redéfinir<br />la longévité.
            </h1>
            <p className={`text-lg md:text-xl text-[#0F3D3E]/55 font-light max-w-2xl mx-auto leading-relaxed`}>
              Helyacare est né d&apos;une conviction&nbsp;: la nature possède les codes,<br className="hidden md:block" /> la science possède les clés.
            </p>
            <div className="w-16 h-px bg-[#0F3D3E]/15 mx-auto mt-16" />
          </div>
        </section>

        {/* ── 2. L'ORIGINE — SPLIT SCREEN NARRATIF ────────────────────── */}
        <section className="bg-white py-24 md:py-36">
          <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center">

            {/* Colonne Gauche — Texte */}
            <div className="flex flex-col gap-8 order-2 md:order-1">
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.25em]">
                L&apos;Origine
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                Le Laboratoire<br />Vivant.
              </h2>
              <div className="w-12 h-px bg-[#E56B2D]" />
              <p className="text-[15px] text-gray-500 leading-[1.9] font-light">
                Depuis des millénaires, la pharmacopée africaine et asiatique a su isoler des actifs d&apos;une puissance remarquable. Chez HelyaCare, nous avons fait le choix de ne pas choisir entre l&apos;héritage et l&apos;innovation.
              </p>
              <p className="text-[15px] text-gray-500 leading-[1.9] font-light">
                Notre plateforme d&apos;Intelligence Artificielle prédictive apprend de chaque utilisateur pour adapter, en temps réel, la composition et le dosage de chaque cure. Ce n&apos;est plus de la supplémentation. C&apos;est de la nutrition de précision.
              </p>
              <Link
                href="/fr/experience"
                className="inline-flex items-center gap-2 text-[#0F3D3E] font-semibold text-sm group w-fit mt-2"
              >
                Découvrir notre science
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Colonne Droite — Image */}
            <div className="relative order-1 md:order-2">
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/mission_lab_interior.png"
                  alt="Laboratoire HelyaCare — Lumière naturelle et botanique"
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
              </div>
              <div className="absolute -bottom-5 -left-5 bg-[#0F3D3E] text-white px-5 py-3 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg">
                Fondé en 2024 · Dakar
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. NOS 3 PILIERS — GLASSMORPHISM SUR FOND SARCELLE ──────── */}
        <section className="bg-[#0F3D3E] py-24 md:py-36 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16 md:mb-20">
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.25em] mb-5">
                Notre Engagement
              </p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight ${inter.className}`}>
                Trois piliers.<br />Une promesse.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Pilier 1 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group">
                <div className="w-14 h-14 rounded-2xl bg-[#CBF27A]/10 border border-[#CBF27A]/20 flex items-center justify-center mb-8">
                  <Leaf className="w-6 h-6 text-[#CBF27A]" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>
                  Sourcing Éthique
                </h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">
                  Chaque actif botanique est sourcé directement auprès de producteurs certifiés. Traçabilité absolue, du champ au laboratoire.
                </p>
                <div className="w-8 h-px bg-[#CBF27A]/30 mt-8" />
              </div>

              {/* Pilier 2 — Légèrement décalé vers le bas pour l'effet éditorial */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group md:translate-y-8">
                <div className="w-14 h-14 rounded-2xl bg-[#E56B2D]/10 border border-[#E56B2D]/20 flex items-center justify-center mb-8">
                  <FlaskConical className="w-6 h-6 text-[#E56B2D]" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>
                  Rigueur Clinique
                </h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">
                  Nos formulations sont le fruit de 18 mois de recherche. Chaque dosage est issu d&apos;essais cliniques indépendants, sans compromis sur l&apos;efficacité.
                </p>
                <div className="w-8 h-px bg-[#E56B2D]/30 mt-8" />
              </div>

              {/* Pilier 3 */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-10 hover:bg-white/10 hover:border-white/20 transition-all duration-500 cursor-default group">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-8">
                  <Recycle className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
                <h3 className={`text-xl font-bold text-white mb-4 ${inter.className}`}>
                  Éco-Conception
                </h3>
                <p className="text-white/55 text-[14px] leading-relaxed font-light">
                  Notre système de recharge Doypack réduit de 70% les déchets plastiques. Prendre soin de soi ne doit pas coûter à la planète.
                </p>
                <div className="w-8 h-px bg-white/15 mt-8" />
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. L'HÉRITAGE — CITATION EN PLEINE LARGEUR ──────────────── */}
        <section className="relative min-h-[560px] md:min-h-[680px] flex items-center justify-center overflow-hidden">
          <Image
            src="/images/mission_botanical_field.png"
            alt="Champs botaniques HelyaCare"
            fill
            className="object-cover"
          />
          {/* Deep editorial overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0F3D3E]/75 via-[#0A192F]/60 to-[#0F3D3E]/85" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
            <p className="text-[10px] font-bold text-[#CBF27A]/70 uppercase tracking-[0.25em] mb-10">
              Notre Vision
            </p>
            <blockquote className={`text-3xl md:text-5xl lg:text-[3.25rem] font-light text-white leading-[1.25] italic ${inter.className}`}>
              &ldquo;Nous construisons le futur<br className="hidden md:block" /> de la santé préventive,<br className="hidden md:block" /> ancré dans l&apos;excellence.&rdquo;
            </blockquote>
            <div className="w-16 h-px bg-[#CBF27A]/40 mx-auto mt-14 mb-10" />
            <p className="text-white/40 text-xs font-light tracking-[0.2em] uppercase">
              Les Fondateurs — HelyaCare, 2024
            </p>
          </div>
        </section>

        {/* ── 5. CTA FINAL ÉDITORIAL ───────────────────────────────────── */}
        <section className="bg-[#F2F0EB] py-24 md:py-32 px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <p className="text-[10px] font-bold text-[#0F3D3E]/35 uppercase tracking-[0.25em] mb-8">
              Rejoindre le mouvement
            </p>
            <h2 className={`text-4xl md:text-6xl font-black text-[#0F3D3E] leading-tight mb-8 tracking-tight ${inter.className}`}>
              La santé n&apos;est pas<br />un luxe.
            </h2>
            <p className="text-[#0F3D3E]/55 text-lg font-light leading-relaxed mb-12 max-w-xl mx-auto">
              Chaque flacon HelyaCare est une déclaration : la précision médicale et l&apos;éthique environnementale ne sont pas opposées. Elles sont inséparables.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/fr/boutique"
                className="px-8 py-4 bg-[#0F3D3E] text-white font-bold rounded-full text-sm tracking-wide hover:bg-[#1a5556] transition-colors"
              >
                Découvrir nos cures
              </Link>
              <Link
                href="/fr/connexion"
                className="px-8 py-4 bg-transparent border border-[#0F3D3E]/25 text-[#0F3D3E] font-semibold rounded-full text-sm tracking-wide hover:bg-[#0F3D3E] hover:text-white transition-colors"
              >
                Créer mon espace santé
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
