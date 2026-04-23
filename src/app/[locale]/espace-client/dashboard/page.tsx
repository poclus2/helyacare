import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function DashboardOverviewPage() {
  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="flex flex-col gap-2">
        <h1 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Vue d'ensemble</h1>
        <p className="text-gray-500 text-sm">Aperçu de vos performances et de votre réseau DNVB.</p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Gains Totaux</h3>
          <p className="text-3xl font-bold text-[#0F3D3E]">0,00 €</p>
          <div className="mt-4 text-xs font-semibold text-green-600 bg-green-50 w-fit px-2 py-1 rounded">+ 0% ce mois</div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm">
          <h3 className="text-gray-500 text-sm font-medium mb-1">Volume de la Ligne de Front</h3>
          <p className="text-3xl font-bold text-[#0F3D3E]">0 CV</p>
          <div className="mt-4 text-xs font-semibold text-gray-500 bg-gray-50 w-fit px-2 py-1 rounded">Basé sur vos filleuls directs</div>
        </div>

        <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm relative overflow-hidden">
          <div className="relative z-10">
            <h3 className="text-white/80 text-sm font-medium mb-1">Grade Actuel</h3>
            <p className="text-3xl font-bold text-white">Ambassadeur</p>
            <div className="mt-4 text-xs font-semibold text-[#0F3D3E] bg-white w-fit px-2 py-1 rounded">Niveau 1</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D3E] to-[#1a6566]" />
        </div>
      </div>

      {/* Recent Activity / Next Steps */}
      <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6 shadow-sm h-64 flex flex-col items-center justify-center text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
          </svg>
        </div>
        <h3 className={`text-lg font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>En attente de synchronisation MLM</h3>
        <p className="text-gray-500 text-sm max-w-md">
          Votre compte est prêt. Les données en temps réel apparaîtront ici dès que les endpoints MLM seront liés.
        </p>
      </div>
    </div>
  );
}
