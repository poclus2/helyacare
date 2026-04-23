"use client";

import { useState } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Activity, Brain, Target, Bot, CheckCircle2, ChevronRight } from "lucide-react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function BilanMetaboliquePage() {
  const [isCompleted, setIsCompleted] = useState(false);
  const [step, setStep] = useState(1);

  if (isCompleted) {
    return (
      <div className={`space-y-8 ${pjs.className}`}>
        <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-[#E8E3DC] pb-6">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Bilan Métabolique Complet</h2>
              <p className="text-gray-500 text-sm">Votre profil est à jour. L’IA adapte actuellement vos recommandations.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-5 h-5 text-[#E56B2D]" />
                <h3 className="font-bold text-[#0F3D3E]">Objectif Principal</h3>
              </div>
              <p className="text-[#0F3D3E] text-lg font-medium">Réduction des envies sucrées à 16h et perte de poids légère.</p>
            </div>
            <div className="bg-[#F8FAFC] p-6 rounded-2xl border border-gray-100">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-5 h-5 text-[#E56B2D]" />
                <h3 className="font-bold text-[#0F3D3E]">Niveau d’énergie initial</h3>
              </div>
              <p className="text-[#0F3D3E] text-lg font-medium">Fluctuant, avec des baisses marquées post-repas.</p>
            </div>
          </div>
          
          <div className="mt-8">
            <button onClick={() => setIsCompleted(false)} className="text-sm font-semibold text-[#E56B2D] hover:underline">
              Mettre à jour mon bilan
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-[#0A192F] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
        <Image src="/images/experience/experience_ai_chip_1776847799863.png" alt="AI Tech" fill className="object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CBF27A]/20 text-[#CBF27A] border border-[#CBF27A]/30 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
            <Bot className="w-4 h-4" />
            <span>Diagnostic IA</span>
          </div>
          <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${inter.className}`}>
            Apprenons à vous connaître.
          </h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            Pour que l’IA HelyaCare puisse personnaliser vos recommandations et votre dosage, nous avons besoin de comprendre vos habitudes métaboliques actuelles.
          </p>

          {/* Stepper Form Simulation */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
            <div className="mb-6 flex items-center justify-between">
              <span className="text-sm font-medium text-[#CBF27A]">Question {step} sur 3</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-8 h-1.5 rounded-full ${i <= step ? "bg-[#CBF27A]" : "bg-white/20"}`} />
                ))}
              </div>
            </div>

            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-semibold">Quel est votre objectif principal avec HelyaCare ?</h3>
                <div className="space-y-3">
                  {["Perdre du poids durablement", "Réduire mes envies de sucre", "Avoir plus d’énergie", "Mieux dormir"].map((option, i) => (
                    <button key={i} onClick={() => setStep(2)} className="w-full text-left p-4 rounded-xl border border-white/20 hover:border-[#CBF27A] hover:bg-[#CBF27A]/10 transition-colors">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-semibold">Comment décririez-vous votre niveau d’énergie l’après-midi ?</h3>
                <div className="space-y-3">
                  {["Stable", "Légère fatigue", "Coup de barre sévère", "Très variable"].map((option, i) => (
                    <button key={i} onClick={() => setStep(3)} className="w-full text-left p-4 rounded-xl border border-white/20 hover:border-[#CBF27A] hover:bg-[#CBF27A]/10 transition-colors">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <h3 className="text-xl font-semibold">À quelle fréquence avez-vous des envies de grignoter ?</h3>
                <div className="space-y-3">
                  {["Rarement", "1 à 2 fois par jour", "Constamment", "Surtout le soir"].map((option, i) => (
                    <button key={i} onClick={() => setIsCompleted(true)} className="w-full text-left p-4 rounded-xl border border-white/20 hover:border-[#CBF27A] hover:bg-[#CBF27A]/10 transition-colors">
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </div>
  );
}
