"use client";

import { useState } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { User, Lock, MapPin, Plus, Trash2 } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function ParametresPage() {
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "adresses">("profil");

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">
        
        {/* Sidebar Settings Navigation */}
        <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-[#E8E3DC] p-6 flex flex-col gap-2">
          <h2 className={`text-lg font-bold text-[#0F3D3E] mb-4 px-3 ${inter.className}`}>
            Paramètres
          </h2>
          <button 
            onClick={() => setActiveTab("profil")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === "profil" ? "bg-white shadow-sm text-[#0F3D3E]" : "text-gray-500 hover:bg-black/5"}`}
          >
            <User className="w-4 h-4" /> Profil personnel
          </button>
          <button 
            onClick={() => setActiveTab("securite")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === "securite" ? "bg-white shadow-sm text-[#0F3D3E]" : "text-gray-500 hover:bg-black/5"}`}
          >
            <Lock className="w-4 h-4" /> Mot de passe
          </button>
          <button 
            onClick={() => setActiveTab("adresses")}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${activeTab === "adresses" ? "bg-white shadow-sm text-[#0F3D3E]" : "text-gray-500 hover:bg-black/5"}`}
          >
            <MapPin className="w-4 h-4" /> Adresses
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8 md:p-12">
          
          {/* TAB: PROFIL */}
          {activeTab === "profil" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className={`text-2xl font-bold text-[#0F3D3E] mb-6 ${inter.className}`}>Informations personnelles</h3>
              <form className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Prénom</label>
                    <input type="text" defaultValue="Client" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Nom</label>
                    <input type="text" defaultValue="Test" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Email</label>
                  <input type="email" defaultValue="client@helyacare.com" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                </div>
                <div className="pt-4">
                  <button type="button" className="px-6 py-3 bg-[#0F3D3E] text-white font-bold rounded-xl text-sm hover:bg-[#1a5556] transition-colors">
                    Sauvegarder les modifications
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: SECURITE */}
          {activeTab === "securite" && (
            <div className="max-w-xl animate-in fade-in duration-300">
              <h3 className={`text-2xl font-bold text-[#0F3D3E] mb-6 ${inter.className}`}>Mot de passe</h3>
              <form className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Mot de passe actuel</label>
                  <input type="password" placeholder="••••••••" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Nouveau mot de passe</label>
                  <input type="password" placeholder="••••••••" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Confirmer le mot de passe</label>
                  <input type="password" placeholder="••••••••" className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E]" />
                </div>
                <div className="pt-4">
                  <button type="button" className="px-6 py-3 bg-[#0F3D3E] text-white font-bold rounded-xl text-sm hover:bg-[#1a5556] transition-colors">
                    Mettre à jour le mot de passe
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: ADRESSES */}
          {activeTab === "adresses" && (
            <div className="max-w-2xl animate-in fade-in duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Carnet d’adresses</h3>
                <button className="flex items-center gap-2 text-sm font-bold text-[#E56B2D] hover:underline">
                  <Plus className="w-4 h-4" /> Ajouter
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Default Address */}
                <div className="border-2 border-[#0F3D3E] rounded-2xl p-5 relative">
                  <span className="absolute top-4 right-4 text-[10px] font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full uppercase">Par défaut</span>
                  <p className="font-bold text-[#0F3D3E] mb-1">Maison</p>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                    14 Avenue de la République<br/>
                    Dakar, Sénégal
                  </p>
                  <div className="flex gap-4">
                    <button className="text-sm font-semibold text-[#0F3D3E] hover:underline">Modifier</button>
                  </div>
                </div>

                {/* Secondary Address */}
                <div className="border border-gray-200 rounded-2xl p-5 relative">
                  <p className="font-bold text-[#0F3D3E] mb-1">Bureau</p>
                  <p className="text-[14px] text-gray-500 leading-relaxed mb-4">
                    Immeuble Plateau, 3ème étage<br/>
                    Dakar, Sénégal
                  </p>
                  <div className="flex gap-4">
                    <button className="text-sm font-semibold text-[#0F3D3E] hover:underline">Modifier</button>
                    <button className="text-sm font-semibold text-red-500 hover:underline">Supprimer</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
