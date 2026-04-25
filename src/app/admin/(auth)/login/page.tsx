"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/admin/dashboard");
      } else {
        const data = await res.json();
        setError(data.error || "Identifiants incorrects");
      }
    } catch {
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A1628] flex items-center justify-center px-4 ${pjs.className}`}>
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0F3D3E]/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-[#CBF27A] rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-[#0F3D3E]" />
            </div>
            <span className={`text-white text-2xl font-black tracking-tight uppercase ${inter.className}`}>
              HelyaCare
            </span>
          </div>
          <h1 className={`text-3xl font-extrabold text-white mb-2 ${inter.className}`}>
            Espace Administrateur
          </h1>
          <p className="text-white/40 text-sm">Accès réservé à l'équipe HelyaCare</p>
        </div>

        {/* Form card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">
                Email administrateur
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="admin@helyacare.com"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-white text-[14px] placeholder:text-white/20
                    focus:outline-none focus:border-[#CBF27A]/50 focus:ring-1 focus:ring-[#CBF27A]/30 transition-all ${inter.className}`}
                />
              </div>
            </div>

            <div>
              <label className="text-white/60 text-xs font-bold uppercase tracking-wider mb-2 block">
                Mot de passe
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className={`w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-12 py-3.5 text-white text-[14px] placeholder:text-white/20
                    focus:outline-none focus:border-[#CBF27A]/50 focus:ring-1 focus:ring-[#CBF27A]/30 transition-all ${inter.className}`}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-red-400 text-sm">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 bg-[#CBF27A] text-[#0F3D3E] font-extrabold text-[15px] rounded-xl
                hover:bg-[#b8e060] active:scale-[0.98] transition-all shadow-lg shadow-[#CBF27A]/20
                flex items-center justify-center gap-2 disabled:opacity-60 ${inter.className}`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Connexion...</>
              ) : (
                <><ShieldCheck className="w-5 h-5" /> Accéder au panneau admin</>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          HelyaCare Admin · Accès sécurisé — Ne partagez jamais vos identifiants
        </p>
      </div>
    </div>
  );
}
