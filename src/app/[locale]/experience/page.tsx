"use client";

import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Moon, Activity, Zap } from "lucide-react";
import { useState } from "react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ExperiencePage() {
  const [activeFaqTab, setActiveFaqTab] = useState("Tous");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "Quelles données sont analysées par l'IA HelyaCare ?", a: "Notre IA Botpress analyse vos retours quotidiens, votre niveau d'énergie, votre qualité de sommeil et vos variations de poids pour adapter ses recommandations nutritionnelles." },
    { q: "Les compléments sont-ils sûrs ?", a: "Absolument. Nos formules sont développées en laboratoire et testées cliniquement pour garantir sécurité et efficacité maximale." },
    { q: "Comment le QR code fonctionne-t-il ?", a: "Chaque produit HelyaCare possède un QR code unique. En le scannant, vous accédez directement à votre coach métabolique sur WhatsApp." },
    { q: "Combien de temps avant de voir des résultats ?", a: "La majorité de nos utilisateurs ressentent les premiers effets sur leur énergie et leur digestion dès les 10 premiers jours." },
    { q: "Puis-je annuler mon abonnement ?", a: "Oui, notre modèle est sans engagement. Vous pouvez suspendre ou annuler vos livraisons à tout moment depuis votre espace client." },
  ];

  return (
    <>
      <Header />
      <main className={`min-h-screen bg-white text-gray-900 ${pjs.className}`}>
        
        {/* 1. HERO SECTION */}
        <section className="relative pt-8 md:pt-16 pb-16 md:pb-24 overflow-hidden bg-[#F6F4F1]">
          {/* Background Sphere/Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-gradient-to-br from-[#0F3D3E]/10 to-[#CBF27A]/20 rounded-full blur-3xl opacity-60 pointer-events-none" />
          
          <div className="relative z-10 max-w-[1440px] mx-auto px-6 text-center">
            <h1 className={`text-4xl md:text-5xl lg:text-[3.5rem] font-bold tracking-tight text-[#0F3D3E] mb-6 leading-[1.1] ${inter.className}`}>
              Science <br className="md:hidden" /> d'avant-garde
            </h1>
            <p className="text-[15px] md:text-base text-[#0F3D3E]/80 max-w-2xl mx-auto font-medium">
              La nutrition métabolique soutenue par des données pures.
            </p>
          </div>

          {/* Scrolling Banner */}
          <div className="absolute bottom-0 left-0 w-full bg-[#0F3D3E]/5 py-3 border-t border-[#0F3D3E]/10 flex overflow-hidden">
            <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] items-center gap-12 text-[#0F3D3E] font-bold text-sm tracking-widest uppercase">
              <span>+2M Données Analysées</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E56B2D]" />
              <span>Essais Cliniques Indépendants</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E56B2D]" />
              <span>Efficacité Prouvée</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E56B2D]" />
              <span>Suivi IA en temps réel</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E56B2D]" />
              <span>+2M Données Analysées</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#E56B2D]" />
              <span>Essais Cliniques Indépendants</span>
            </div>
          </div>
        </section>

        {/* 2. THREE STATS */}
        <section className="py-24 bg-[#0F3D3E]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className={`text-3xl lg:text-[2.5rem] leading-tight font-bold text-white mb-16 max-w-3xl mx-auto ${inter.className}`}>
              Nos ambassadeurs constatent des améliorations tangibles pour leur santé.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
              <div className="flex flex-col items-center">
                <Moon className="w-8 h-8 text-[#CBF27A] mb-4" strokeWidth={1.5} />
                <h3 className={`text-4xl md:text-5xl font-black text-white mb-3 ${inter.className}`}>95%</h3>
                <p className="text-[15px] text-white/80 font-medium max-w-[200px] mx-auto leading-relaxed">signalent un sommeil de meilleure qualité</p>
              </div>
              <div className="flex flex-col items-center">
                <Activity className="w-8 h-8 text-[#CBF27A] mb-4" strokeWidth={1.5} />
                <h3 className={`text-4xl md:text-5xl font-black text-white mb-3 ${inter.className}`}>87%</h3>
                <p className="text-[15px] text-white/80 font-medium max-w-[200px] mx-auto leading-relaxed">remarquent une meilleure régulation glycémique</p>
              </div>
              <div className="flex flex-col items-center">
                <Zap className="w-8 h-8 text-[#E56B2D] mb-4" strokeWidth={1.5} />
                <h3 className={`text-4xl md:text-5xl font-black text-white mb-3 ${inter.className}`}>75%</h3>
                <p className="text-[15px] text-white/80 font-medium max-w-[200px] mx-auto leading-relaxed">ressentent une hausse d'énergie continue</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CONNECTING THE DOTS */}
        <section className="py-24 bg-[#F6F4F1]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-20 mb-16 items-start">
              <h2 className={`text-3xl lg:text-4xl font-bold text-[#E56B2D] leading-[1.2] flex-1 ${inter.className}`}>
                Connecter les points pour vous aider à atteindre vos objectifs
              </h2>
              <p className="text-[15px] text-gray-500 leading-relaxed flex-1 md:pt-2">
                La nutrition de précision n'est plus une promesse abstraite. En combinant des formules cliniquement testées avec l'intelligence artificielle générative de Botpress, HelyaCare crée une boucle de rétroaction continue. Vos données façonnent votre parcours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="flex flex-col text-center">
                <h4 className={`font-bold text-[#0F3D3E] text-[15px] mb-6 min-h-[40px] px-4 ${inter.className}`}>1. Recevez votre cure HelyaCare</h4>
                <div className="relative aspect-[3/4] bg-white border border-[#E8E3DC] shadow-sm rounded-2xl overflow-hidden group">
                  <Image src="/images/products/crave-control/macro.png" alt="Produit HelyaCare" fill className="object-cover p-4 transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-col text-center mt-0 md:mt-12">
                <h4 className={`font-bold text-[#0F3D3E] text-[15px] mb-6 min-h-[40px] px-4 ${inter.className}`}>2. Scannez pour partager vos données</h4>
                <div className="relative aspect-[3/4] bg-white border border-[#E8E3DC] shadow-sm rounded-2xl overflow-hidden group p-6 flex items-center justify-center">
                  <Image src="/images/experience/experience_data_scan_1776847840025.png" alt="Data" fill className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-col text-center">
                <h4 className={`font-bold text-[#0F3D3E] text-[15px] mb-6 min-h-[40px] px-4 ${inter.className}`}>3. Ajustement de la juste dose</h4>
                <div className="relative aspect-[3/4] bg-white border border-[#E8E3DC] shadow-sm rounded-2xl overflow-hidden group p-8">
                  <Image src="/images/experience/experience_capsule_dose_1776847856802.png" alt="Capsules" fill className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105" />
                </div>
              </div>
              <div className="flex flex-col text-center mt-0 md:mt-12">
                <h4 className={`font-bold text-[#0F3D3E] text-[15px] mb-6 min-h-[40px] px-4 ${inter.className}`}>4. Recommandations par l'IA HelyaCare</h4>
                <div className="relative aspect-[3/4] bg-[#0F3D3E] rounded-2xl overflow-hidden group flex items-center justify-center">
                  <Image src="/images/experience/experience_phone_ai_1776847877619.png" alt="Phone" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E] via-transparent to-transparent opacity-80" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 4. SPLIT BANNER */}
        <section className="w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Left Image */}
            <div className="relative min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden">
              <Image src="/images/experience/experience_lifestyle_1776847783684.png" alt="Lifestyle" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40" />
              <div className="relative z-10 text-center px-8 py-12">
                <h3 className={`text-5xl md:text-6xl font-black text-white mb-4 ${inter.className}`}>92%</h3>
                <p className="text-white text-[15px] font-medium max-w-sm mx-auto leading-relaxed">
                  de nos membres voient une différence après 30 jours, lorsqu'ils lient leur cure à l'IA.
                </p>
                <button className="mt-6 px-6 py-3 bg-white text-gray-900 text-sm font-bold rounded-full hover:bg-gray-100 transition-colors">
                  Lire l'étude
                </button>
              </div>
            </div>
            
            {/* Right Tech */}
            <div className="relative min-h-[400px] lg:min-h-[500px] flex items-center justify-center overflow-hidden bg-[#0A192F]">
              <Image src="/images/experience/research_botany_1776849702986.png" alt="Botanical AI" fill className="object-cover opacity-60" />
              <div className="absolute inset-0 bg-black/30" />
              <div className="relative z-10 text-center px-8 py-12">
                <div className="w-16 h-16 bg-[#CBF27A]/20 rounded-2xl mx-auto mb-6 flex items-center justify-center border border-[#CBF27A]/50 shadow-[0_0_40px_rgba(203,242,122,0.2)]">
                  <span className="text-[#CBF27A] font-black text-xl">IA</span>
                </div>
                <h3 className={`text-3xl md:text-4xl font-bold text-white mb-4 ${inter.className}`}>Notre IA Coach</h3>
                <p className="text-white/80 text-[15px] max-w-sm mx-auto leading-relaxed">
                  2.4 millions de points de données analysés pour apprendre des habitudes métaboliques et fournir des recommandations ultra-personnalisées en temps réel.
                </p>
                <button className="mt-6 px-6 py-3 bg-transparent border border-white/30 text-white text-sm font-bold rounded-full hover:bg-white/10 transition-colors">
                  Explorer la technologie
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 5. GRANULES GIVE YOU AN EDGE */}
        <section className="py-24 bg-[#0F3D3E]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className={`text-3xl lg:text-4xl font-bold text-white mb-6 ${inter.className}`}>
                  Notre approche vous donne l'avantage
                </h2>
                <p className="text-[15px] text-white/80 mb-12 leading-relaxed">
                  Contrairement aux compléments classiques qui stagnent dans l'estomac, nos formules sont conçues pour une biodisponibilité maximale et une absorption ciblée.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                  <div>
                    <span className="text-[#CBF27A] font-black text-xl mb-4 block">1.</span>
                    <h4 className="font-bold text-white mb-2">Absorption maximisée</h4>
                    <p className="text-white/70 text-sm">Traverse l'acidité gastrique pour se libérer dans l'intestin grêle.</p>
                  </div>
                  <div>
                    <span className="text-[#CBF27A] font-black text-xl mb-4 block">2.</span>
                    <h4 className="font-bold text-white mb-2">Plus de nutriments</h4>
                    <p className="text-white/70 text-sm">Chaque dose est hyper-concentrée sans agents de remplissage inutiles.</p>
                  </div>
                  <div>
                    <span className="text-[#CBF27A] font-black text-xl mb-4 block">3.</span>
                    <h4 className="font-bold text-white mb-2">Précision clinique</h4>
                    <p className="text-white/70 text-sm">Les dosages sont fondés sur les recommandations de nos experts en nutrition.</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 mt-12 pt-12 border-t border-white/10">
                  {/* Icons row */}
                  {['Vegan', 'Sans OGM', 'Sans Gluten', 'Sans Sucre', 'Certifié'].map((badge) => (
                    <div key={badge} className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                        <div className="w-4 h-4 bg-[#CBF27A] rounded-sm" />
                      </div>
                      <span className="text-xs font-semibold text-white">{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="relative">
                <div className="aspect-square bg-[#0F3D3E] rounded-[3rem] p-12 relative border border-[#CBF27A]/30 shadow-2xl">
                  <Image src="/images/products/crave-control/ecosystem.png" alt="Crave Control Product" fill className="object-contain drop-shadow-2xl scale-90" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. RECOMMENDED BY DOCTORS */}
        <section className="py-24 bg-[#F6F4F1]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h2 className={`text-3xl lg:text-4xl font-bold text-[#0F3D3E] mb-12 ${inter.className}`}>
              Recommandé par nos experts
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: "Dr Akim Njimogna", role: "Endocrinologue", quote: "Une approche révolutionnaire de la gestion glycémique.", img: "/images/experience/experience_dr_1_1776847915055.png" },
                { name: "Dr. Sarah Ndiaye", role: "Nutritionniste Clinique", quote: "L'IA apporte la précision qui manquait à la supplémentation.", img: "/images/experience/experience_dr_2_1776847933658.png" },
                { name: "Prof. Marc Leblanc", role: "Directeur de Recherche", quote: "Les données collectées valident l'efficacité des formules.", img: "/images/experience/experience_dr_3_1776847948772.png" },
                { name: "Dr. Elena Rossi", role: "Experte Longévité", quote: "Une synergie parfaite entre nature et technologie.", img: "/images/experience/experience_dr_4_1776847975915.png" }
              ].map((doc, i) => (
                <div key={i} className="flex flex-col items-center text-center">
                  <div className="relative w-48 h-48 rounded-2xl overflow-hidden mb-6 bg-gray-200">
                    <Image src={doc.img} alt={doc.name} fill className="object-cover" />
                  </div>
                  <h4 className="font-bold text-[#0F3D3E] text-lg">{doc.name}</h4>
                  <p className="text-gray-500 text-sm mb-4">{doc.role}</p>
                  <p className="text-gray-800 text-sm font-medium italic">"{doc.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. CLINICAL TRIALS */}
        <section className="py-24 bg-[#0F3D3E]">
          <div className="max-w-[1200px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden bg-white/5 border border-white/10">
                <Image src="/images/experience/experience_scan_1776847815539.png" alt="Scan QR" fill className="object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl cursor-pointer">
                    <div className="w-0 h-0 border-y-[12px] border-y-transparent border-l-[20px] border-l-white ml-2" />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className={`text-3xl lg:text-4xl font-bold text-white mb-6 leading-tight ${inter.className}`}>
                  Essais cliniques : Rapides, précis et en temps réel.
                </h2>
                <p className="text-[15px] text-white/80 mb-8 leading-relaxed">
                  HelyaCare ne se contente pas de données historiques. En connectant nos utilisateurs via WhatsApp, nous menons la plus grande étude d'observation en continu sur la santé métabolique, ajustant nos produits à l'échelle.
                </p>
                <button className="inline-flex items-center text-[#CBF27A] font-bold hover:underline underline-offset-4">
                  Découvrir notre méthodologie <ArrowRight className="w-5 h-5 ml-2" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 8. FEATURED RESEARCH */}
        <section className="py-24 bg-[#F6F4F1] overflow-hidden">
          <div className="max-w-[1200px] mx-auto px-6 mb-12 flex items-end justify-between">
            <h2 className={`text-3xl lg:text-4xl font-bold text-[#0F3D3E] ${inter.className}`}>
              Recherches et Publications
            </h2>
            <div className="hidden md:flex gap-4">
              <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronLeft className="w-6 h-6 text-[#0F3D3E]" />
              </button>
              <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors">
                <ChevronRight className="w-6 h-6 text-[#0F3D3E]" />
              </button>
            </div>
          </div>

          <div className="flex overflow-x-auto gap-6 px-6 md:px-[calc((100vw-1200px)/2+24px)] snap-x snap-mandatory hide-scrollbar">
            {[
              {
                title: "L'impact des extraits botaniques sur la glycémie.",
                desc: "Une étude menée démontrant une amélioration significative de la gestion glycémique après 60 jours.",
                img: "/images/experience/research_botany_1776849702986.png",
                tag: "Étude Botanique"
              },
              {
                title: "IA et modélisation métabolique prédictive.",
                desc: "Analyse de données pour anticiper les baisses d'énergie et adapter la supplémentation en temps réel.",
                img: "/images/experience/research_data_1776849738631.png",
                tag: "Data Science"
              },
              {
                title: "Biodisponibilité des formulations cliniques.",
                desc: "Tests in vitro prouvant une absorption supérieure des nutriments grâce à notre micro-encapsulation.",
                img: "/images/experience/research_lab_1776849718106.png",
                tag: "Essai Clinique"
              },
              {
                title: "Synergie adaptogène sur la réduction du cortisol.",
                desc: "Revue scientifique sur l'efficacité combinée de nos ingrédients phares pour la gestion du stress.",
                img: "/images/products/crave-control/ingredients.png",
                tag: "Revue Scientifique"
              }
            ].map((item, i) => (
              <div key={i} className="min-w-[280px] md:min-w-[340px] w-[280px] md:w-[340px] bg-white p-6 rounded-2xl border border-[#E8E3DC] snap-start shrink-0 group cursor-pointer hover:shadow-lg hover:border-[#0F3D3E]/20 transition-all duration-300 flex flex-col">
                <div className="relative w-full aspect-[4/3] bg-[#F6F4F1] mb-5 rounded-xl overflow-hidden">
                  <Image src={item.img} alt={item.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-widest mb-2">{item.tag}</p>
                <h4 className="font-bold text-[#0F3D3E] text-[17px] mb-3 leading-snug group-hover:text-[#E56B2D] transition-colors flex-1">{item.title}</h4>
                <p className="text-[13px] text-gray-500 mb-5 line-clamp-3 leading-relaxed">
                  {item.desc}
                </p>
                <span className="inline-flex items-center text-[#0F3D3E] group-hover:text-[#E56B2D] font-bold text-[13px] transition-colors underline-offset-4">
                  Lire le rapport <ArrowRight className="w-4 h-4 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 9. AS SEEN IN */}
        <section className="py-24 bg-[#0F3D3E] border-b border-[#0F3D3E]">
          <div className="max-w-[1200px] mx-auto px-6 text-center">
            <h3 className="text-[#CBF27A]/80 font-semibold mb-12 uppercase tracking-widest text-sm">Ils parlent de nous</h3>
            <div className="flex flex-wrap justify-center items-center gap-12 md:gap-20 opacity-50 grayscale mix-blend-screen text-white">
              <div className="text-2xl font-black">FORBES</div>
              <div className="text-2xl font-black">VOGUE</div>
              <div className="text-2xl font-black">TECHCRUNCH</div>
              <div className="text-2xl font-black">WIRED</div>
              <div className="text-2xl font-black">GQ</div>
            </div>
          </div>
        </section>

        {/* 10. FAQ */}
        <section className="py-24 bg-white">
          <div className="max-w-[800px] mx-auto px-6">
            <h2 className={`text-3xl lg:text-4xl font-bold text-[#0F3D3E] text-center mb-10 ${inter.className}`}>
              Questions Fréquentes
            </h2>

            {/* Tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-12">
              {['Tous', 'Produit', 'Intelligence Artificielle', 'Livraison'].map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveFaqTab(tab)}
                  className={`px-6 py-2 rounded-full text-sm font-semibold transition-colors ${
                    activeFaqTab === tab ? 'bg-[#F6F4F1] text-[#0F3D3E]' : 'bg-transparent text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Accordion */}
            <div className="flex flex-col gap-4">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-gray-200 rounded-xl overflow-hidden transition-colors hover:border-[#0F3D3E]/30">
                  <button 
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <span className="font-bold text-[#0F3D3E] pr-8">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </button>
                  <div className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === i ? 'max-h-[200px] pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <p className="text-gray-600 leading-relaxed text-sm">{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 11. BOTTOM DUAL BANNERS */}
        <section className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="relative h-[400px] md:h-[500px] flex items-end p-12 group overflow-hidden cursor-pointer">
              <Image src="/images/experience/experience_press_1776847992889.png" alt="Press" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="relative z-10 text-center w-full">
                <h3 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${inter.className}`}>HelyaCare dans la presse</h3>
                <p className="text-white/80 mb-6 text-[15px]">"Une approche révolutionnaire de la santé préventive."</p>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full hover:bg-white hover:text-black transition-colors">
                  Lire l'article
                </button>
              </div>
            </div>
            <div className="relative h-[400px] md:h-[500px] flex items-end p-12 group overflow-hidden cursor-pointer bg-[#0F3D3E]">
              <Image src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1200&auto=format&fit=crop" alt="Team" fill className="object-cover opacity-50 mix-blend-overlay transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E] via-[#0F3D3E]/50 to-transparent" />
              <div className="relative z-10 text-center w-full">
                <h3 className={`text-3xl md:text-4xl font-bold text-white mb-2 ${inter.className}`}>Contactez-nous</h3>
                <p className="text-white/80 mb-6 text-[15px]">Demandes de presse et partenariats.</p>
                <button className="px-6 py-3 bg-white/20 backdrop-blur-md text-white text-sm font-semibold rounded-full hover:bg-white hover:text-black transition-colors">
                  Nous écrire
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
