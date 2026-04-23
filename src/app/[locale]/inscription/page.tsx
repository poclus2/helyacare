"use client";

import { useState } from "react";
import { useRouter, Link } from "@/navigation";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// ------- Logo mark -------
function HelycaLogo() {
  return (
    <div className="flex flex-col items-center gap-2 select-none">
      <Image 
        src="/logo-white.png" 
        alt="HelyaCare Logo" 
        width={48} 
        height={48} 
        className="object-contain" 
        unoptimized
      />
      <span className={`text-white text-3xl font-bold tracking-tight uppercase ${inter.className}`}>
        Helyacare
      </span>
    </div>
  );
}

// Minimal spinner arrow
function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-[#0F3D3E]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export default function InscriptionPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [error, setError]         = useState<string | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    // Simulate API call for now since we don't have a direct Next-Auth sign-up for credentials yet
    setTimeout(() => {
      setLoading(false);
      // Faking success and redirecting to login
      router.push("/connexion");
    }, 1500);
  };

  return (
    <main className={`h-screen w-full flex flex-row overflow-hidden ${pjs.className}`}>

      {/* ────────────── LEFT PANEL — Glass form ────────────── */}
      <aside
        className="
          relative flex flex-col justify-between
          w-full md:w-[45%] lg:w-[40%] xl:w-[35%]
          px-8 sm:px-12 py-10
          bg-white/5 backdrop-blur-2xl
          border-r border-white/10
          shadow-[2px_0_60px_rgba(0,0,0,0.5)]
          overflow-y-auto
          z-10
        "
        style={{
          background:
            "linear-gradient(160deg, rgba(15,61,62,0.97) 0%, rgba(6,30,24,0.98) 100%)",
        }}
      >
        <div className="flex flex-col items-center pt-2 pb-6">
          <HelycaLogo />
        </div>

        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-white leading-tight ${inter.className}`}>
              Créer un compte <span className="not-italic">✨</span>
            </h1>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">
              Rejoignez le laboratoire vivant et découvrez la nutrition métabolique sur-mesure.
            </p>
          </div>

          {error && (
            <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm leading-snug">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Prénom & Nom (Grid) */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="first_name" className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Prénom
                </label>
                <input
                  id="first_name"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Jean"
                  className="bg-white/5 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="last_name" className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                  Nom
                </label>
                <input
                  id="last_name"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Dupont"
                  className="bg-white/5 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="vous@exemple.com"
                className="bg-white/5 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-white/60 text-xs font-semibold uppercase tracking-widest">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="new-password"
                placeholder="••••••••"
                className="bg-white/5 text-white placeholder:text-white/40 border border-white/20 rounded-xl px-4 py-3.5 text-sm transition-all duration-200 outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 w-full flex items-center justify-center gap-3 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl px-4 py-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? <Spinner /> : null}
              {loading ? "Création en cours…" : "Créer mon compte"}
            </button>
          </form>

          <div className="relative my-7 flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-white/30 text-xs">ou</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          <div className="flex flex-col gap-4 mt-2">
            <p className="text-center text-white/40 text-xs leading-relaxed">
              Vous avez déjà un compte ?{" "}
              <Link href="/connexion" className="text-white font-semibold hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-white/20 text-xs pt-6">
          © {new Date().getFullYear()} Helyacare — Le laboratoire vivant.
        </p>
      </aside>

      {/* ────────────── RIGHT PANEL — Immersive background ────────────── */}
      <div className="hidden md:block relative flex-1 overflow-hidden">
        <Image
          src="/login-bg.png"
          alt="Forêt brumeuse — Living Laboratory"
          fill
          priority
          className="object-cover object-center"
          sizes="(min-width: 768px) 70vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061e18]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-12">
          <div className="max-w-xl text-center">
            <blockquote
              className={`text-white/80 text-xl md:text-2xl font-light leading-relaxed italic ${inter.className}`}
            >
              &ldquo;Rejoignez le mouvement de la santé métabolique prédictive.&rdquo;
            </blockquote>
            <p className="text-white/40 text-sm mt-3 not-italic font-medium">— Helyacare</p>
          </div>
        </div>
      </div>
    </main>
  );
}
