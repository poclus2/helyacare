import { Bot, Package, Activity, ArrowRight, Sparkles, PlusCircle, CheckCircle2, ChevronRight, Moon, Droplets, Zap } from "lucide-react";
import Link from "next/link";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function CustomerDashboard() {
  return (
    <div className={`space-y-8 ${pjs.className}`}>
      
      {/* 1. METABOLIC VITALS - Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Energy */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Niveau d’Énergie</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-[#0F3D3E] ${inter.className}`}>85</span>
              <span className="text-sm font-medium text-green-500">+12%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Zap className="w-6 h-6 text-[#E56B2D]" />
          </div>
        </div>
        {/* Sleep */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Qualité Sommeil</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-[#0F3D3E] ${inter.className}`}>92</span>
              <span className="text-sm font-medium text-green-500">+5%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Moon className="w-6 h-6 text-[#0F3D3E]" />
          </div>
        </div>
        {/* Hydration */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Hydratation</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-[#0F3D3E] ${inter.className}`}>68</span>
              <span className="text-sm font-medium text-red-500">-10%</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Droplets className="w-6 h-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID (Active Sub & IA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Subscription */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#E8E3DC] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F2F0EB] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative w-full md:w-1/3 aspect-square bg-[#F6F4F1] rounded-2xl flex items-center justify-center shrink-0">
            <Image src="/images/products/crave-control/macro.png" alt="Crave Control" fill className="object-cover rounded-2xl" />
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between h-full py-2">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold uppercase tracking-wider rounded-full mb-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Cure Active</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
                Crave Control
              </h2>
              <p className="text-gray-500 text-[15px] max-w-md leading-relaxed mb-6">
                Régulation glycémique et contrôle des envies. Prenez 2 gélules par jour avec votre premier repas.
              </p>
              
              <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between border border-gray-100">
                <div>
                  <p className="text-xs text-gray-500 font-semibold uppercase">Prochaine livraison</p>
                  <p className="text-sm font-bold text-[#0F3D3E]">15 Mai 2026</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-semibold uppercase">Statut</p>
                  <p className="text-sm font-bold text-green-600">En préparation</p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              <button className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-semibold hover:bg-[#1a5556] transition-all hover:shadow-lg">
                Gérer l’abonnement
              </button>
            </div>
          </div>
        </div>

        {/* AI Health Companion */}
        <div className="bg-[#0A192F] rounded-3xl p-8 text-white relative overflow-hidden flex flex-col justify-between group cursor-pointer hover:shadow-2xl transition-all">
          <Image src="/images/experience/experience_ai_chip_1776847799863.png" alt="AI Tech" fill className="object-cover opacity-30 group-hover:opacity-40 transition-opacity duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent" />
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-[#CBF27A]/20 rounded-2xl flex items-center justify-center mb-6 border border-[#CBF27A]/30">
              <Bot className="w-6 h-6 text-[#CBF27A]" />
            </div>
            <h3 className={`text-2xl font-bold mb-2 ${inter.className}`}>Coach IA Botpress</h3>
            <p className="text-white/70 text-[15px] mb-6 leading-relaxed">
              Vos données montrent une baisse d’énergie l’après-midi. L’IA a une recommandation pour vous.
            </p>
            
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10 mb-6">
              <p className="text-sm italic text-white/90">"Bonjour ! J’ai analysé votre sommeil cette semaine. Voulons-nous ajuster votre prise de Crave Control ?"</p>
            </div>
          </div>
          
          <button className="relative z-10 w-full py-3.5 bg-[#CBF27A] text-[#0A192F] rounded-xl text-sm font-bold hover:bg-[#b8dd6e] transition-colors flex items-center justify-center gap-2 group-hover:scale-[1.02]">
            Ouvrir la discussion
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. RECENT ORDERS & QUIZ CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[#E8E3DC] shadow-sm overflow-hidden">
          <div className="px-8 py-6 border-b border-[#E8E3DC] flex items-center justify-between">
            <h3 className={`text-xl font-bold text-[#0F3D3E] ${inter.className}`}>Achats Récents</h3>
            <button className="text-[#E56B2D] text-sm font-semibold hover:underline">Voir tout</button>
          </div>
          <div className="divide-y divide-[#E8E3DC]">
            {[
              { id: "#HC-9034", date: "15 Avr 2026", total: "20 000 FCFA", status: "Livré" },
              { id: "#HC-8210", date: "15 Mar 2026", total: "20 000 FCFA", status: "Livré" },
              { id: "#HC-7145", date: "15 Fév 2026", total: "20 000 FCFA", status: "Livré" },
            ].map((order, i) => (
              <div key={i} className="px-8 py-5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F2F0EB] flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#0F3D3E]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F3D3E]">{order.id}</p>
                    <p className="text-xs text-gray-500 font-medium">{order.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-bold text-[#0F3D3E]">{order.total}</p>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold uppercase">{order.status}</span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#E56B2D] transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#F2F0EB] to-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm flex flex-col justify-center">
          <div className="w-16 h-16 bg-[#0F3D3E] rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <Activity className="w-8 h-8 text-[#E56B2D]" />
          </div>
          <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
            Bilan Métabolique Incomplet
          </h3>
          <p className="text-gray-500 text-[15px] mb-8 leading-relaxed">
            Optimisez les résultats de votre cure en complétant votre diagnostic IA de 5 minutes.
          </p>
          <button className="w-full py-3.5 bg-white border-2 border-[#E8E3DC] text-[#0F3D3E] rounded-xl text-sm font-bold shadow-sm hover:border-[#0F3D3E] hover:bg-[#0F3D3E] hover:text-white transition-all flex items-center justify-center gap-2 group">
            <Sparkles className="w-4 h-4 group-hover:text-[#E56B2D]" />
            Remplir mon Quiz
          </button>
        </div>
      </div>

      {/* Ambassador Upsell */}
      <div className="mt-12 text-center pt-8 border-t border-[#E8E3DC]">
        <p className="text-gray-500 mb-3 text-sm font-medium">Vous aimez l’expérience Helyacare ? Partagez-la et soyez récompensé.</p>
        <Link 
          href="/ambassadeur"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-[#E8E3DC] rounded-full text-sm font-bold text-[#0F3D3E] hover:bg-[#F6F4F1] transition-all shadow-sm hover:shadow-md"
        >
          <PlusCircle className="w-4 h-4 text-[#E56B2D]" />
          Découvrir le programme Ambassadeur
        </Link>
      </div>
    </div>
  );
}
