"use client";

import { useState } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { User, Lock, MapPin, Save, Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";
import AddressManager from "@/components/espace-client/AddressManager";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface CustomerData {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
}

interface Props {
  customer: CustomerData;
  token: string;
}

export default function ParametresClient({ customer, token }: Props) {
  const [activeTab, setActiveTab] = useState<"profil" | "securite" | "adresses">("profil");

  // Profil form state
  const [profil, setProfil] = useState({
    first_name: customer.first_name || "",
    last_name: customer.last_name || "",
    email: customer.email || "",
    phone: customer.phone || "",
  });
  const [profilStatus, setProfilStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [profilError, setProfilError] = useState("");

  // Password form state
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [pwdStatus, setPwdStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [pwdError, setPwdError] = useState("");

  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";

  const handleProfilSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfilStatus("saving");
    setProfilError("");
    try {
      const res = await fetch(`${backendUrl}/store/customers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        body: JSON.stringify({
          first_name: profil.first_name,
          last_name: profil.last_name,
          phone: profil.phone,
        }),
      });
      if (res.ok) {
        setProfilStatus("success");
        setTimeout(() => setProfilStatus("idle"), 3000);
      } else {
        const err = await res.json();
        setProfilError(err.message || "Une erreur est survenue.");
        setProfilStatus("error");
      }
    } catch {
      setProfilError("Impossible de contacter le serveur.");
      setProfilStatus("error");
    }
  };

  const handlePwdSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    if (pwd.next !== pwd.confirm) {
      setPwdError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (pwd.next.length < 8) {
      setPwdError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    setPwdStatus("saving");
    try {
      // Medusa v2: update password via PATCH /store/customers/me
      const res = await fetch(`${backendUrl}/store/customers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        body: JSON.stringify({ password: pwd.next }),
      });
      if (res.ok) {
        setPwdStatus("success");
        setPwd({ current: "", next: "", confirm: "" });
        setTimeout(() => setPwdStatus("idle"), 3000);
      } else {
        const err = await res.json();
        setPwdError(err.message || "Erreur lors du changement de mot de passe.");
        setPwdStatus("error");
      }
    } catch {
      setPwdError("Impossible de contacter le serveur.");
      setPwdStatus("error");
    }
  };

  return (
    <div className={`space-y-8 ${pjs.className}`}>
      <div className="bg-white rounded-3xl border border-[#E8E3DC] shadow-sm flex flex-col md:flex-row overflow-hidden min-h-[600px]">

        {/* Sidebar */}
        <div className="w-full md:w-64 bg-[#F8FAFC] border-b md:border-b-0 md:border-r border-[#E8E3DC] p-6 flex flex-col gap-2">
          <h2 className={`text-lg font-bold text-[#0F3D3E] mb-4 px-3 ${inter.className}`}>Paramètres</h2>
          {[
            { id: "profil" as const, label: "Profil personnel", Icon: User },
            { id: "securite" as const, label: "Mot de passe", Icon: Lock },
            { id: "adresses" as const, label: "Adresses", Icon: MapPin },
          ].map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors text-left ${
                activeTab === id ? "bg-white shadow-sm text-[#0F3D3E]" : "text-gray-500 hover:bg-black/5"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-8 md:p-12">

          {/* TAB: PROFIL */}
          {activeTab === "profil" && (
            <div className="max-w-xl">
              <h3 className={`text-2xl font-bold text-[#0F3D3E] mb-6 ${inter.className}`}>Informations personnelles</h3>
              <form onSubmit={handleProfilSave} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Prénom</label>
                    <input
                      type="text"
                      value={profil.first_name}
                      onChange={(e) => setProfil(p => ({ ...p, first_name: e.target.value }))}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Nom</label>
                    <input
                      type="text"
                      value={profil.last_name}
                      onChange={(e) => setProfil(p => ({ ...p, last_name: e.target.value }))}
                      className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Email</label>
                  <input
                    type="email"
                    value={profil.email}
                    disabled
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[15px] text-gray-400 cursor-not-allowed"
                  />
                  <p className="text-[11px] text-gray-400">L'email ne peut pas être modifié depuis cet écran.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Téléphone</label>
                  <input
                    type="tel"
                    value={profil.phone}
                    onChange={(e) => setProfil(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+221 77 000 00 00"
                    className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                  />
                </div>

                {profilStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {profilError}
                  </div>
                )}
                {profilStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Profil mis à jour avec succès.
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={profilStatus === "saving"}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white font-bold rounded-xl text-sm hover:bg-[#1a5556] transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {profilStatus === "saving" ? "Sauvegarde..." : "Sauvegarder"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: SECURITE */}
          {activeTab === "securite" && (
            <div className="max-w-xl">
              <h3 className={`text-2xl font-bold text-[#0F3D3E] mb-6 ${inter.className}`}>Mot de passe</h3>
              <form onSubmit={handlePwdSave} className="space-y-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Mot de passe actuel</label>
                  <input
                    type="password"
                    value={pwd.current}
                    onChange={(e) => setPwd(p => ({ ...p, current: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showPwd ? "text" : "password"}
                      value={pwd.next}
                      onChange={(e) => setPwd(p => ({ ...p, next: e.target.value }))}
                      placeholder="••••••••"
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 pr-12 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400">Minimum 8 caractères.</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-500 text-xs font-bold uppercase tracking-wide">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={pwd.confirm}
                    onChange={(e) => setPwd(p => ({ ...p, confirm: e.target.value }))}
                    placeholder="••••••••"
                    className="bg-[#F8FAFC] border border-gray-200 rounded-xl px-4 py-3 text-[15px] focus:outline-none focus:border-[#0F3D3E] focus:ring-1 focus:ring-[#0F3D3E] transition-colors"
                  />
                </div>

                {pwdStatus === "error" && (
                  <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 shrink-0" /> {pwdError}
                  </div>
                )}
                {pwdStatus === "success" && (
                  <div className="flex items-center gap-2 text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-3">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Mot de passe mis à jour.
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={pwdStatus === "saving"}
                    className="flex items-center gap-2 px-6 py-3 bg-[#0F3D3E] text-white font-bold rounded-xl text-sm hover:bg-[#1a5556] transition-colors disabled:opacity-60"
                  >
                    <Save className="w-4 h-4" />
                    {pwdStatus === "saving" ? "Mise à jour..." : "Mettre à jour le mot de passe"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB: ADRESSES */}
          {activeTab === "adresses" && (
            <div className="max-w-2xl">
              <AddressManager token={token} />
            </div>
          )}


        </div>
      </div>
    </div>
  );
}
