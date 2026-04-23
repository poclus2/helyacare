"use client";

import { useState } from "react";
import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Check, Info, ArrowRight, Leaf, Shield, Beaker, Bot, QrCode, Sparkles, Star, Pill, Microscope, Dna, Flower2 } from "lucide-react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function CraveControlPage() {
  const [openFaq, setOpenFaq] = useState<number>(0);
  const [purchaseType, setPurchaseType] = useState<"subscription" | "one-time">("subscription");

  // Placeholder arrays for the image stack
  const images = [
    { id: 1, src: "/images/products/crave-control/lifestyle.png", alt: "Crave Control Lifestyle" },
    { id: 2, src: "/images/products/crave-control/macro.png", alt: "Crave Control Capsule Macro" },
    { id: 3, src: "/images/products/crave-control/ecosystem.png", alt: "HelyaCare Eco-System Recharge" },
    { id: 4, src: "/images/products/crave-control/ingredients.png", alt: "Crave Control Clinical Ingredients" },
  ];

  return (
    <>
      <Header />
      <main className="bg-[#FAF9F7] min-h-screen selection:bg-[#1B3624] selection:text-white">
        
        {/* 1. HERO HEADER (Seed-style) */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
            
            {/* Colonne Gauche : Galerie Grid */}
            <div className="lg:col-span-7">
              {/* Mobile Slider */}
              <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img) => (
                  <div key={`mobile-${img.id}`} className="relative w-[85vw] aspect-[4/3] shrink-0 snap-start bg-[#1B3624] rounded-2xl overflow-hidden shadow-sm">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" priority={img.id === 1} sizes="85vw" />
                  </div>
                ))}
              </div>

              {/* Desktop Masonry/Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                {/* Image 1 : Large */}
                <div className="col-span-2 relative w-full aspect-[16/10] bg-[#1B3624] rounded-[20px] overflow-hidden">
                  <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" priority sizes="60vw" />
                </div>
                {/* Image 2 : Demi */}
                <div className="relative w-full aspect-[4/3] bg-[#1B3624] rounded-[20px] overflow-hidden">
                  <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" sizes="30vw" />
                </div>
                {/* Image 3 : Demi */}
                <div className="relative w-full aspect-[4/3] bg-[#E8E3DC] rounded-[20px] overflow-hidden">
                  <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" sizes="30vw" />
                </div>
                {/* Image 4 : Large */}
                <div className="col-span-2 relative w-full aspect-[16/7] bg-[#1B3624] rounded-[20px] overflow-hidden mt-2">
                  <Image src={images[3].src} alt={images[3].alt} fill className="object-cover" sizes="60vw" />
                </div>
              </div>
            </div>

            {/* Colonne Droite : Sticky Buy Box */}
            <div className="lg:col-span-5">
              <div className="lg:sticky top-24 pt-2 lg:pt-0 max-w-[460px]">
                
                {/* Badge + Title */}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-0.5 border border-gray-300 text-gray-800 text-[11px] font-bold uppercase rounded-full tracking-wide ${inter.className}`}>
                    CC-01™
                  </span>
                  <h1 className={`text-3xl md:text-[34px] font-medium text-gray-900 tracking-tight ${inter.className}`}>
                    Crave Control
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-gray-900">4.8</span>
                  <div className="flex items-center text-gray-900">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <a href="#" className="text-[13px] font-medium text-gray-900 underline underline-offset-4 decoration-1 hover:text-gray-600 transition-colors">
                    12 233 Avis
                  </a>
                </div>
                
                {/* Description */}
                <p className={`text-[15px] text-gray-900 mb-6 leading-relaxed ${inter.className}`}>
                  Bouclier neuro-métabolique validé cliniquement pour réguler l'appétit, stabiliser la glycémie et combattre les grignotages. Propulsé par 3 actifs purs qui favorisent une santé métabolique globale.*
                </p>

                {/* Price Display */}
                <div className="flex items-end gap-3 mb-6">
                  <span className={`text-3xl md:text-4xl font-medium text-gray-900 leading-none ${inter.className}`}>
                    {purchaseType === "subscription" ? "17 000 FCFA" : "20 000 FCFA"}
                  </span>
                  
                  {purchaseType === "subscription" && (
                    <>
                      <span className={`text-lg text-gray-400 line-through mb-0.5 ${inter.className}`}>
                        20 000 FCFA
                      </span>
                      <span className={`px-2.5 py-1 bg-[#DCF5CA] text-[#1B3624] text-[11px] font-bold uppercase rounded-full mb-1 tracking-wider ${inter.className}`}>
                        Économisez 15%
                      </span>
                    </>
                  )}
                </div>

                {/* Purchase Options Toggle */}
                <div className="flex flex-col gap-3 mb-6">
                  {/* Subscription Option */}
                  <label 
                    className={`flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      purchaseType === "subscription" 
                      ? "border-[#1B3624] bg-[#F6F4F1] shadow-sm" 
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() => setPurchaseType("subscription")}
                  >
                    <div className="mt-1 relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white">
                      {purchaseType === "subscription" && <div className="w-3 h-3 rounded-full bg-[#1B3624]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-gray-900 text-[15px] ${inter.className}`}>Abonnement Mensuel</span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[13px] text-gray-400 line-through ${inter.className}`}>20 000 FCFA</span>
                          <span className={`font-bold text-gray-900 text-[15px] ${inter.className}`}>17 000 FCFA</span>
                        </div>
                      </div>
                      <p className={`text-[13px] text-gray-500 mt-1.5 leading-snug ${inter.className}`}>
                        Cure de 30 jours livrée mensuellement.<br/>Mettez en pause ou annulez à tout moment.
                      </p>
                    </div>
                  </label>

                  {/* One-time Option */}
                  <label 
                    className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${
                      purchaseType === "one-time" 
                      ? "border-[#1B3624] bg-[#F6F4F1] shadow-sm" 
                      : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    onClick={() => setPurchaseType("one-time")}
                  >
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 bg-white">
                      {purchaseType === "one-time" && <div className="w-3 h-3 rounded-full bg-[#1B3624]" />}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-semibold text-gray-900 text-[15px] ${inter.className}`}>Achat Unique</span>
                        <span className={`font-bold text-gray-900 text-[15px] ${inter.className}`}>20 000 FCFA</span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* CTA */}
                <div className="mb-4">
                  <button className={`w-full py-4 bg-[#E56B2D] text-white text-[15px] font-semibold rounded-[6px] hover:bg-[#cf5c22] transition-all ${inter.className}`}>
                    Commencer Maintenant
                  </button>
                </div>

                {/* Guarantees */}
                <p className={`text-xs text-gray-500 text-center mb-10 pb-8 border-b border-gray-200 ${inter.className}`}>
                  Garantie sans risque 30 jours. Livraison gratuite.
                </p>

                {/* Accordions */}
                <div className="space-y-0">
                  {/* Benefits Accordion (Open) */}
                  <div className="py-4 border-b border-gray-200">
                    <button className="w-full flex items-center justify-between font-semibold text-[15px] text-gray-900 mb-4">
                      Bienfaits*
                      <span className="text-xl leading-none font-light">-</span>
                    </button>
                    <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-gray-400">
                      <li className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>Réduit l'envie de sucre en 1 semaine</li>
                      <li className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>Évite les pics d'insuline post-repas</li>
                      <li className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>Favorise la satiété nerveuse</li>
                      <li className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>Améliore la concentration et la clarté mentale</li>
                      <li className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>Testé dans de multiples essais cliniques randomisés, contrôlés par placebo</li>
                    </ul>
                    <a href="#" className={`inline-flex items-center text-[13px] font-bold text-[#1B3624] hover:underline underline-offset-4 decoration-1 ${inter.className}`}>
                      Voir les Études Cliniques <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>

                  {/* Ingredients Accordion (Closed) */}
                  <div className="py-5 border-b border-gray-200">
                    <button className="w-full flex items-center justify-between font-semibold text-[15px] text-gray-900">
                      Ingrédients
                      <span className="text-xl leading-none font-light">+</span>
                    </button>
                  </div>
                </div>

                {/* Cross-sell Box */}
                <div className="mt-8 bg-[#F6F5F2] p-4 rounded-[20px] flex gap-4 items-center">
                  <div className="w-16 h-16 bg-[#1B3624] rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                    <Image src="/images/products/crave-control/lifestyle.png" alt="Bundle" fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-[14px] font-semibold text-gray-900 mb-1 ${inter.className}`}>Pack + Économisez 25%</h4>
                    <p className={`text-[12px] text-gray-800 mb-3 leading-snug ${inter.className}`}>
                      Ajoutez le complexe Détox DM-02™ à votre routine et économisez sur votre première commande.
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[14px] font-semibold text-gray-900 ${inter.className}`}>12 750 FCFA</span>
                        <span className={`text-[12px] text-gray-400 line-through ${inter.className}`}>17 000 FCFA</span>
                      </div>
                      <button className={`px-4 py-1.5 bg-transparent border border-gray-900 text-gray-900 text-[13px] font-semibold rounded-[6px] hover:bg-gray-100 transition-colors ${inter.className}`}>
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 2. TRANSPARENCE CLINIQUE (Redesign Full Width) */}
        <section className="w-full relative min-h-[700px] md:min-h-[800px] flex flex-col justify-between overflow-hidden">
          {/* Background Image : Ambiance Feuillage Botanique */}
          <Image 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop"
            alt="Crave Control Clinical Transparency"
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          {/* Gradient Overlay for better readability of the top title */}
          <div className="absolute inset-0 bg-black/10" />

          {/* Title */}
          <div className="relative z-10 pt-20 md:pt-32 px-6 md:px-12 lg:px-24 max-w-5xl">
            <h2 className={`text-4xl md:text-5xl lg:text-[56px] font-medium text-white tracking-tight leading-[1.1] drop-shadow-md ${inter.className}`}>
              Sentez la différence d'un<br className="hidden md:block"/> métabolisme vraiment régulé.
            </h2>
          </div>

          {/* Solid Dark Container */}
          <div className="relative z-10 mt-auto px-4 md:px-8 pb-8 md:pb-12 pt-32">
            <div className="bg-[#434638] rounded-[24px] p-10 md:p-14 w-full max-w-[1440px] mx-auto shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                
                {/* Item 1 */}
                <div className="flex flex-col text-white">
                  <div className="mb-6">
                    <Flower2 className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                  <h3 className={`text-[17px] font-semibold mb-3 ${inter.className}`}>Extrait de Safran</h3>
                  <p className={`text-white/80 text-[13px] leading-[1.6] ${inter.className}`}>
                    Agit sur les neurotransmetteurs. Réduit de 60% l'envie de grignotages sucrés liés au stress émotionnel selon les tests in-vivo.
                  </p>
                </div>

                {/* Item 2 */}
                <div className="flex flex-col text-white">
                  <div className="mb-6">
                    <Pill className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                  <h3 className={`text-[17px] font-semibold mb-3 ${inter.className}`}>Picolinate de Chrome</h3>
                  <p className={`text-white/80 text-[13px] leading-[1.6] ${inter.className}`}>
                    Régule biologiquement la glycémie pour éviter les pics d'insuline, responsables des fringales brutales post-repas.
                  </p>
                </div>

                {/* Item 3 */}
                <div className="flex flex-col text-white">
                  <div className="mb-6">
                    <Dna className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                  <h3 className={`text-[17px] font-semibold mb-3 ${inter.className}`}>L-Tyrosine</h3>
                  <p className={`text-white/80 text-[13px] leading-[1.6] ${inter.className}`}>
                    Précurseur de la dopamine. Favorise la satiété nerveuse et améliore la concentration pendant la perte de masse grasse.
                  </p>
                </div>

                {/* Item 4 */}
                <div className="flex flex-col text-white">
                  <div className="mb-6">
                    <Microscope className="w-8 h-8 text-white stroke-[1.5]" />
                  </div>
                  <h3 className={`text-[17px] font-semibold mb-3 ${inter.className}`}>Formule Clinique</h3>
                  <p className={`text-white/80 text-[13px] leading-[1.6] ${inter.className}`}>
                    100% clean et naturelle, testée cliniquement. Gélules végétales acido-résistantes protégeant les actifs jusqu'à l'intestin.
                  </p>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS (De vraies personnes, de vrais résultats) */}
        <section className="bg-[#FAF9F7] py-20 md:py-32 px-6 md:px-8 max-w-[1440px] mx-auto border-t border-gray-200 mt-16 md:mt-24">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
            <div className="max-w-4xl">
              <h2 className={`text-4xl md:text-[44px] lg:text-[52px] font-medium text-gray-900 tracking-tight leading-[1.1] mb-6 ${inter.className}`}>
                De vraies personnes, de vrais résultats : ce que nos client·e·s en disent*
              </h2>
              <p className={`text-[14px] text-gray-900 font-medium flex items-center gap-1 ${inter.className}`}>
                Résultats issus d'une enquête menée auprès de 527 client·e·s vérifié·e·s ayant pris Crave Control pendant au moins 12 jours. <span className="text-gray-400 font-normal">↓</span>
              </p>
            </div>
            
            {/* Arrows */}
            <div className="hidden md:flex items-center gap-6 text-[#1B3624]">
              <button className="hover:opacity-60 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button className="hover:opacity-60 transition-opacity">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
            
            {/* Card 1 */}
            <div className="flex flex-col gap-5">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1rem] overflow-hidden bg-gray-200">
                <Image src="/images/products/crave-control/lifestyle.png" alt="Harry" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div>
                <p className={`text-[14px] text-gray-500 font-medium mb-3 ${inter.className}`}>— Harry</p>
                <p className={`text-[16px] text-gray-900 leading-relaxed font-medium ${inter.className}`}>
                  « Premiers effets positifs : je ne ressens plus de coups de barre dans la journée, et je reste concentré. » <sup className="text-[10px] text-gray-600 font-normal">2,4</sup>
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="flex flex-col gap-5">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1rem] overflow-hidden bg-gray-200">
                <Image src="/images/products/crave-control/ecosystem.png" alt="Annapurna" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div>
                <p className={`text-[14px] text-gray-500 font-medium mb-3 ${inter.className}`}>— Annapurna</p>
                <p className={`text-[16px] text-gray-900 leading-relaxed font-medium ${inter.className}`}>
                  « J'ai remarqué un vrai changement : davantage d'énergie, un meilleur moral, plus de clarté mentale et moins d'envies de grignoter. » <sup className="text-[10px] text-gray-600 font-normal">2,4,8,7</sup>
                </p>
              </div>
            </div>

            {/* Card 3 */}
            <div className="flex flex-col gap-5">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1rem] overflow-hidden bg-gray-200">
                <Image src="/images/products/crave-control/macro.png" alt="Lucian" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div>
                <p className={`text-[14px] text-gray-500 font-medium mb-3 ${inter.className}`}>— Lucian</p>
                <p className={`text-[16px] text-gray-900 leading-relaxed font-medium ${inter.className}`}>
                  « Ça semble prometteur, mais je viens tout juste de commencer. » <sup className="text-[10px] text-gray-600 font-normal">2</sup>
                </p>
              </div>
            </div>

            {/* Card 4 */}
            <div className="flex flex-col gap-5">
              <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1rem] overflow-hidden bg-gray-200">
                <Image src="/images/products/crave-control/ingredients.png" alt="Mina" fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
              </div>
              <div>
                <p className={`text-[14px] text-gray-500 font-medium mb-3 ${inter.className}`}>— Mina</p>
                <p className={`text-[16px] text-gray-900 leading-relaxed font-medium ${inter.className}`}>
                  « Je me sens bien, et j'ai l'impression de commencer mes journées avec une habitude plus saine. » <sup className="text-[10px] text-gray-600 font-normal">1,2</sup>
                </p>
              </div>
            </div>

          </div>

          {/* Footer Disclaimer */}
          <p className={`text-[11px] text-gray-500 italic ${inter.className}`}>
            Remarque : Les personnes représentées sont des images d'illustration et ne sont pas de véritables client·e·s.*
          </p>
        </section>

        {/* 4. FAQs */}
        <section className="flex flex-col md:flex-row bg-[#0F3D3E] text-white">
          {/* Left Column (FAQ Content) */}
          <div className="w-full md:w-[55%] lg:w-[50%] p-10 md:p-16 lg:p-24 xl:px-32 flex flex-col justify-center">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light mb-12 tracking-wide ${inter.className}`}>
              FAQs
            </h2>

            <div className="flex flex-col">
              {[
                {
                  q: "Quelle est votre politique de garantie satisfait ou remboursé ?",
                  a: "Nous offrons une garantie de satisfaction totale. Pour les abonnements de 3 mois (90 jours), vous avez 90 jours entiers pour essayer Crave Control sans risque. Pour les abonnements mensuels et les achats uniques, vous avez 30 jours. Envoyez un e-mail à care@helyacare.com et nous procéderons à un remboursement intégral. Sans poser de questions."
                },
                { q: "Comment fonctionne l'abonnement ?", a: "Vous recevez votre cure tous les mois. Vous pouvez mettre en pause, décaler ou annuler à tout moment depuis votre espace client." },
                { q: "Que contient la formule Crave Control ?", a: "Notre formule contient 3 actifs purs et cliniquement validés : Extrait de Safran, Picolinate de Chrome et L-Tyrosine, intégrés dans des gélules végétales acido-résistantes." },
                { q: "Crave Control est-il testé par des laboratoires tiers ?", a: "Oui, chaque lot est rigoureusement testé par des laboratoires indépendants pour garantir la pureté, la puissance et l'absence totale de métaux lourds." },
                { q: "Quel goût cela a-t-il ?", a: "Nos gélules végétales n'ont ni goût ni odeur désagréable. Elles sont faciles à avaler avec un simple verre d'eau." }
              ].map((faq, index) => (
                <div key={index} className="border-t border-white/20">
                  <button 
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="w-full flex items-center justify-between py-6 text-left group"
                  >
                    <span className={`text-[15px] md:text-[16px] font-bold tracking-tight pr-8 ${inter.className}`}>
                      {faq.q}
                    </span>
                    <span className="text-2xl font-light leading-none">
                      {openFaq === index ? "−" : "+"}
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
                    <p className={`text-[13px] md:text-[14px] text-white/90 leading-relaxed pr-6 ${inter.className}`}>
                      {faq.a}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/20"></div>
            </div>
          </div>

          {/* Right Column (Image) */}
          <div className="w-full md:w-[45%] lg:w-[50%] relative min-h-[500px] md:min-h-auto bg-[#E8E3DC]">
            <Image 
              src="/images/products/crave-control/ecosystem.png" 
              alt="HelyaCare Crave Control" 
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
