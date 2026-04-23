"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
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

export default function ConnexionPage() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError("Identifiants incorrects. Veuillez vérifier vos informations.");
      } else {
        router.push("/espace-client");
      }
    } catch {
      setError("Une erreur inattendue est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  return (
    /**
     * SPLIT-SCREEN LAYOUT
     * The page is h-screen, divided into:
     *   - Left panel (glass): w-full on mobile | md:w-[38%] lg:w-[32%]
     *   - Right panel (immersive bg image): hidden on mobile, visible md+
     */
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
          /* Fallback gradient when no backdrop surface is behind the panel on mobile */
          background:
            "linear-gradient(160deg, rgba(15,61,62,0.97) 0%, rgba(6,30,24,0.98) 100%)",
        }}
      >
        {/* Top: logo */}
        <div className="flex flex-col items-center pt-2 pb-6">
          <HelycaLogo />
        </div>

        {/* Middle: form */}
        <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
          <div className="mb-8">
            <h1 className={`text-3xl font-bold text-white leading-tight ${inter.className}`}>
              Welcome back. <span className="not-italic">👋</span>
            </h1>
            <p className="text-white/50 text-sm mt-2 leading-relaxed">
              Connectez-vous pour accéder à votre espace Helyacare.
            </p>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm leading-snug">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-white/60 text-xs font-semibold uppercase tracking-widest"
              >
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
                className="
                  bg-white/5 text-white placeholder:text-white/40
                  border border-white/20 rounded-xl
                  px-4 py-3.5 text-sm
                  transition-all duration-200 outline-none
                  focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10
                "
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-white/60 text-xs font-semibold uppercase tracking-widest"
                >
                  Mot de passe
                </label>
                <button
                  type="button"
                  className="text-white/60 text-xs font-medium hover:text-white transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="
                  bg-white/5 text-white placeholder:text-white/40
                  border border-white/20 rounded-xl
                  px-4 py-3.5 text-sm
                  transition-all duration-200 outline-none
                  focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10
                "
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="btn-signin"
              disabled={loading}
              className="
                mt-3 w-full flex items-center justify-center gap-3
                bg-white text-[#0F3D3E] font-bold text-sm
                rounded-xl px-4 py-4
                transition-all duration-200
                hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-[1.02]
                active:scale-[0.98]
                disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
              "
            >
              {loading ? <Spinner /> : null}
              {loading ? "Connexion en cours…" : "Accéder à mon espace"}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-7 flex items-center">
            <div className="flex-1 border-t border-white/10" />
            <span className="px-4 text-white/30 text-xs">ou</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Sign-up nudge */}
          <div className="flex flex-col gap-4 mt-2">
            <p className="text-center text-white/40 text-xs leading-relaxed">
              Pas encore de compte ?{" "}
              <Link href="/inscription" className="text-white font-semibold hover:underline">
                Créer un compte
              </Link>
            </p>
            <Link 
              href="/ambassadeur" 
              className="
                w-full flex items-center justify-center gap-2
                bg-transparent border border-[#E56B2D] text-[#E56B2D] font-bold text-sm
                rounded-xl px-4 py-3.5
                transition-all duration-200
                hover:bg-[#E56B2D] hover:text-white hover:scale-[1.02] active:scale-[0.98]
              "
            >
              Devenir Ambassadeur
            </Link>
          </div>
        </div>

        {/* Bottom: footnote */}
        <p className="text-center text-white/20 text-xs pt-6">
          © {new Date().getFullYear()} Helyacare — Le laboratoire vivant.
        </p>
      </aside>

      {/* ────────────── RIGHT PANEL — Immersive background ────────────── */}
      <div className="hidden md:block relative flex-1 overflow-hidden">
        {/* The immersive background image */}
        <Image
          src="/login-bg.png"
          alt="Forêt brumeuse — Living Laboratory"
          fill
          priority
          className="object-cover object-center"
          sizes="(min-width: 768px) 70vw"
        />

        {/* Gradient overlay to blend left edge with the glass panel */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#061e18]/80 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        {/* Floating tagline centred on the image */}
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-12">
          <div className="max-w-xl text-center">
            <blockquote
              className={`text-white/80 text-xl md:text-2xl font-light leading-relaxed italic ${inter.className}`}
            >
              &ldquo;La nature est notre premier laboratoire. La science, notre boussole.&rdquo;
            </blockquote>
            <p className="text-white/40 text-sm mt-3 not-italic font-medium">— Helyacare</p>
          </div>
        </div>
      </div>
    </main>
  );
}
