"use client";

import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Package, Calendar, MapPin, CreditCard, Clock, PauseCircle, ArrowRight, ShieldCheck } from "lucide-react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function SubscriptionPage() {
  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-[#E8E3DC] pb-6 mb-8">
          <div>
            <h2 className={`text-2xl font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>
              Abonnement Actif
            </h2>
            <p className="text-gray-500 text-sm">Gérez la fréquence de vos livraisons et vos paramètres de cure.</p>
          </div>
          <div className="px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-full text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Statut : Actif
          </div>
        </div>

        {/* Subscription Info Card */}
        <div className="bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100 flex flex-col lg:flex-row gap-8 items-center mb-8">
          <div className="relative w-full lg:w-48 aspect-square bg-[#F2F0EB] rounded-xl flex items-center justify-center shrink-0">
            <Image src="/images/products/crave-control/macro.png" alt="Crave Control" fill className="object-cover rounded-xl" />
          </div>
          
          <div className="flex-1 w-full">
            <h3 className={`text-xl font-bold text-[#0F3D3E] mb-2 ${inter.className}`}>Cure Crave Control (30 Jours)</h3>
            <p className="text-gray-500 text-[15px] mb-6">Renouvellement automatique chaque mois. Vous avez le contrôle total sur votre cure.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-[#E56B2D]" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Prochaine Livraison</p>
                  <p className="text-[15px] font-bold text-[#0F3D3E]">15 Mai 2026</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-100 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-bold uppercase tracking-wide">Montant Mensuel</p>
                  <p className="text-[15px] font-bold text-[#0F3D3E]">20 000 FCFA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions CRUD (Business Logic placeholders) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-[#E56B2D] hover:bg-orange-50/50 transition-all group">
            <Clock className="w-8 h-8 text-gray-400 group-hover:text-[#E56B2D] transition-colors" />
            <div className="text-center">
              <p className="font-bold text-[#0F3D3E] text-sm mb-1">Décaler d’un mois</p>
              <p className="text-xs text-gray-500">Repousser la livraison</p>
            </div>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-[#0F3D3E] hover:bg-[#F6F4F1] transition-all group">
            <MapPin className="w-8 h-8 text-gray-400 group-hover:text-[#0F3D3E] transition-colors" />
            <div className="text-center">
              <p className="font-bold text-[#0F3D3E] text-sm mb-1">Modifier l’adresse</p>
              <p className="text-xs text-gray-500">Changer le point de relais</p>
            </div>
          </button>
          
          <button className="flex flex-col items-center justify-center gap-3 p-6 bg-white border border-[#E8E3DC] rounded-2xl hover:border-red-500 hover:bg-red-50 transition-all group">
            <PauseCircle className="w-8 h-8 text-gray-400 group-hover:text-red-500 transition-colors" />
            <div className="text-center">
              <p className="font-bold text-[#0F3D3E] text-sm mb-1">Mettre en pause</p>
              <p className="text-xs text-gray-500">Suspendre temporairement</p>
            </div>
          </button>
        </div>

      </div>
      
      {/* Reassurance */}
      <div className="bg-[#0F3D3E] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-[#CBF27A]" />
          <div>
            <h4 className={`text-white font-bold text-lg mb-1 ${inter.className}`}>Garantie HelyaCare</h4>
            <p className="text-white/70 text-sm">Annulation ou modification en 1 clic. Aucun engagement caché.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-[#CBF27A] text-[#0A192F] text-sm font-bold rounded-xl hover:bg-[#b8dd6e] transition-colors flex items-center gap-2">
          Contacter le support <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
