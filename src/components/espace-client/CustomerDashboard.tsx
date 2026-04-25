import { Bot, Package, Activity, ArrowRight, Sparkles, PlusCircle, CheckCircle2, ChevronRight, Moon, Droplets, Zap } from "lucide-react";
import { Link } from "@/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function CustomerDashboard({ orders = [] }: { orders?: any[] }) {
  return (
    <div className={`space-y-8 ${pjs.className}`}>
      
      {/* 1. METABOLIC VITALS - Top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Energy */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between opacity-70">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Niveau d’Énergie</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-gray-300 ${inter.className}`}>--</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Bilan requis</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Zap className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        {/* Sleep */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between opacity-70">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Qualité Sommeil</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-gray-300 ${inter.className}`}>--</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Bilan requis</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Moon className="w-6 h-6 text-gray-400" />
          </div>
        </div>
        {/* Hydration */}
        <div className="bg-white p-6 rounded-2xl border border-[#E8E3DC] shadow-sm flex items-center justify-between opacity-70">
          <div>
            <p className="text-gray-500 text-xs font-semibold uppercase tracking-widest mb-1">Hydratation</p>
            <div className="flex items-baseline gap-2">
              <span className={`text-3xl font-black text-gray-300 ${inter.className}`}>--</span>
            </div>
            <p className="text-[10px] text-gray-400 mt-1">Bilan requis</p>
          </div>
          <div className="w-12 h-12 rounded-full bg-[#F6F4F1] flex items-center justify-center">
            <Droplets className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

      {/* 2. MAIN GRID (Active Sub & IA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Subscription / Recent Order */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-[#E8E3DC] relative overflow-hidden flex flex-col md:flex-row gap-8 items-center">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-[#F2F0EB] rounded-full blur-3xl opacity-50 pointer-events-none"></div>
          
          <div className="relative w-full md:w-1/3 aspect-square bg-[#F6F4F1] rounded-2xl flex items-center justify-center shrink-0">
            {orders.length > 0 && orders[0].items?.[0]?.thumbnail ? (
              <Image src={orders[0].items[0].thumbnail} alt="Produit récent" fill className="object-cover rounded-2xl" />
            ) : (
              <Package className="w-12 h-12 text-gray-300" />
            )}
          </div>

          <div className="relative z-10 flex-1 flex flex-col justify-between h-full py-2">
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 ${orders.length > 0 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'} border text-xs font-bold uppercase tracking-wider rounded-full mb-4`}>
                {orders.length > 0 ? <CheckCircle2 className="w-4 h-4" /> : <Package className="w-4 h-4" />}
                <span>{orders.length > 0 ? "Commande Récente" : "Aucune commande"}</span>
              </div>
              <h2 className={`text-2xl md:text-3xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
                {orders.length > 0 ? (orders[0].items?.[0]?.title || "Produit HelyaCare") : "Découvrez nos Cures"}
              </h2>
              <p className="text-gray-500 text-[15px] max-w-md leading-relaxed mb-6">
                {orders.length > 0 
                  ? "Continuez à suivre votre cure pour des résultats optimaux. N'oubliez pas votre bilan IA." 
                  : "Explorez notre boutique pour trouver la cure métabolique adaptée à vos besoins."}
              </p>
              
              {orders.length > 0 && (
                <div className="bg-[#F8FAFC] rounded-xl p-4 flex items-center justify-between border border-gray-100">
                  <div>
                    <p className="text-xs text-gray-500 font-semibold uppercase">Date de commande</p>
                    <p className="text-sm font-bold text-[#0F3D3E]">
                      {new Date(orders[0].created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Statut</p>
                    <p className="text-sm font-bold text-green-600 capitalize">{orders[0].status || "En cours"}</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mt-6 flex items-center gap-4">
              {orders.length > 0 ? (
                <Link href="/espace-client/commandes" className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-semibold hover:bg-[#1a5556] transition-all hover:shadow-lg">
                  Voir la commande
                </Link>
              ) : (
                <Link href="/boutique" className="px-6 py-3 bg-[#0F3D3E] text-white rounded-xl text-sm font-semibold hover:bg-[#1a5556] transition-all hover:shadow-lg">
                  Visiter la boutique
                </Link>
              )}
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
            {orders.length > 0 ? orders.slice(0, 5).map((order: any) => (
              <div key={order.id} className="px-8 py-5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#F2F0EB] flex items-center justify-center shrink-0">
                    <Package className="w-5 h-5 text-[#0F3D3E]" />
                  </div>
                  <div>
                    <p className="font-bold text-[#0F3D3E]">#{order.display_id || order.id.slice(-6).toUpperCase()}</p>
                    <p className="text-xs text-gray-500 font-medium">
                      {new Date(order.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <p className="font-bold text-[#0F3D3E] hidden sm:block">
                    {new Intl.NumberFormat("fr-FR", { style: "currency", currency: order.currency_code }).format(order.total / 100)}
                  </p>
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-bold uppercase truncate max-w-[100px] text-center">
                    {order.status || order.payment_status || "En cours"}
                  </span>
                  <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#E56B2D] transition-colors shrink-0" />
                </div>
              </div>
            )) : (
              <div className="px-8 py-10 text-center text-gray-500">
                <p>Aucune commande récente.</p>
                <Link href="/boutique" className="text-[#E56B2D] font-bold text-sm mt-2 inline-block hover:underline">Découvrir la boutique</Link>
              </div>
            )}
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
