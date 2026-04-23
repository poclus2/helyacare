'use client';

import { useState } from "react";
import { Copy, Wallet, Users, ArrowUpRight, Award, TrendingUp, Check, ChevronRight } from "lucide-react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface AmbassadorProps {
  ambassador: {
    id: string;
    referral_code: string;
    wallet?: { balance: number };
    downlines?: any[];
  }
}

export default function AmbassadorDashboard({ ambassador }: AmbassadorProps) {
  const [copied, setCopied] = useState(false);
  const balanceXAF = ambassador.wallet?.balance || 0;
  const downlineCount = ambassador.downlines?.length || 0;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://helyacare.com/ref/${ambassador.referral_code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      {/* Welcome Banner - Business Hub */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/40 backdrop-blur-xl border border-white p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0F3D3E] to-[#1a5556] flex items-center justify-center text-white shadow-lg">
            <Award className="w-6 h-6 text-[#E56B2D]" />
          </div>
          <div>
            <h2 className={`text-xl font-bold text-[#0F3D3E] ${inter.className}`}>
              Helya Business Hub
            </h2>
            <p className="text-[#0F3D3E]/70 text-sm">
              Statut: <span className="font-semibold text-[#E56B2D]">Ambassadeur Actif</span>
            </p>
          </div>
        </div>
        <button className="text-sm font-medium text-[#0F3D3E] hover:text-[#E56B2D] transition-colors flex items-center gap-1 group">
          Mes achats personnels
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wallet Card - Glassmorphism */}
        <div className="relative overflow-hidden lg:col-span-2 group rounded-3xl p-[1px] bg-gradient-to-br from-white/60 to-white/10 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0F3D3E] to-[#112a2b] opacity-100 z-0"></div>
          
          <div className="relative z-10 bg-[#0F3D3E]/90 isolate h-full rounded-[23px] p-8 backdrop-blur-2xl border border-white/10 flex flex-col justify-between overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#E56B2D] rounded-full blur-[80px] opacity-20 pointer-events-none transform translate-x-10 -translate-y-20"></div>

            <div className="flex justify-between items-start mb-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-white/90 text-xs font-semibold rounded-full border border-white/5">
                <Wallet className="w-4 h-4 text-[#E56B2D]" />
                <span>Trésorerie Disponible</span>
              </div>
              <button className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors pointer-cursor text-white/50 hover:text-white">
                <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>

            <div>
              <div className={`text-5xl font-bold text-white mb-2 tracking-tight ${inter.className}`}>
                {new Intl.NumberFormat('fr-FR').format(balanceXAF)} <span className="text-2xl text-white/50">FCFA</span>
              </div>
              <p className="text-white/60 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" />
                <span className="text-green-400">+12%</span> depuis le mois dernier
              </p>
            </div>
          </div>
        </div>

        {/* Network Overview Card */}
        <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm flex flex-col justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#F6F4F1] text-[#0F3D3E] text-xs font-semibold rounded-full mb-6">
              <Users className="w-4 h-4 text-[#E56B2D]" />
              <span>Mon Réseau</span>
            </div>
            
            <div className={`text-4xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>
              {downlineCount} <span className="text-xl text-gray-400 font-medium">Actifs</span>
            </div>
            <p className="text-gray-500 text-sm">
              Filleuls générant des commissions ce mois-ci.
            </p>
          </div>

          <button className="w-full mt-6 py-3 bg-[#F6F4F1] text-[#0F3D3E] rounded-xl text-sm font-semibold hover:bg-[#E8E3DC] transition-colors border border-transparent hover:border-[#D0C9BE]">
            Voir l'arbre
          </button>
        </div>
      </div>

      {/* Referral Link & Tools */}
      <div className="bg-white/60 backdrop-blur-md rounded-3xl p-8 border border-white shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h3 className={`text-lg font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
            Mon Lien Affilié
          </h3>
          <p className="text-gray-500 text-sm">
            Partagez ce lien pour inviter vos amis et développer votre réseau.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F4F1] p-2 rounded-2xl border border-[#E8E3DC] w-full md:w-auto">
          <div className="px-4 py-2 text-[#0F3D3E] font-medium font-mono text-sm opacity-80 overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px] md:max-w-xs">
            https://helyacare.com/ref/{ambassador.referral_code}
          </div>
          <button 
            onClick={handleCopy}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              copied ? 'bg-green-100 text-green-600' : 'bg-[#E56B2D] text-white hover:bg-[#D55A1C] shadow-sm shadow-[#E56B2D]/20'
            }`}
          >
            {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>
      </div>

    </div>
  );
}
