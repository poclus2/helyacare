"use client";

import { useState, useEffect } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Activity, Brain, Target, Bot, CheckCircle2, ChevronRight, RotateCcw, Loader2 } from "lucide-react";
import Image from "next/image";
import { useSession } from "next-auth/react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Questions du bilan
const QUIZ = [
  {
    key: "objectif",
    question: "Quel est votre objectif principal avec HelyaCare ?",
    options: ["Perdre du poids durablement", "Réduire mes envies de sucre", "Avoir plus d'énergie", "Mieux dormir"],
  },
  {
    key: "energie",
    question: "Comment décririez-vous votre niveau d'énergie l'après-midi ?",
    options: ["Stable", "Légère fatigue", "Coup de barre sévère", "Très variable"],
  },
  {
    key: "grignotage",
    question: "À quelle fréquence avez-vous des envies de grignoter ?",
    options: ["Rarement", "1 à 2 fois par jour", "Constamment", "Surtout le soir"],
  },
];

interface BilanData {
  objectif?: string;
  energie?: string;
  grignotage?: string;
  completed_at?: string;
}

export default function BilanMetaboliquePage() {
  const { data: session } = useSession();
  const [bilan, setBilan] = useState<BilanData | null>(null);
  const [step, setStep] = useState(0); // 0 = intro ou quiz step
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);

  const token = (session as any)?.medusa_token as string | undefined;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "";

  // Charger le bilan existant depuis Medusa (metadata customer)
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    const load = async () => {
      try {
        const res = await fetch(`${backendUrl}/store/customers/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(publishableKey && { "x-publishable-api-key": publishableKey }),
          },
        });
        if (res.ok) {
          const data = await res.json();
          const meta = data.customer?.metadata || {};
          if (meta.bilan_objectif) {
            setBilan({
              objectif: meta.bilan_objectif,
              energie: meta.bilan_energie,
              grignotage: meta.bilan_grignotage,
              completed_at: meta.bilan_completed_at,
            });
          }
        }
      } catch {}
      setLoading(false);
    };
    load();
  }, [token]);

  // Sauvegarder le bilan dans Medusa customer metadata
  const saveBilan = async (finalAnswers: Record<string, string>) => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${backendUrl}/store/customers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        body: JSON.stringify({
          metadata: {
            bilan_objectif: finalAnswers.objectif || "",
            bilan_energie: finalAnswers.energie || "",
            bilan_grignotage: finalAnswers.grignotage || "",
            bilan_completed_at: new Date().toISOString(),
          },
        }),
      });
      setBilan({
        objectif: finalAnswers.objectif,
        energie: finalAnswers.energie,
        grignotage: finalAnswers.grignotage,
        completed_at: new Date().toISOString(),
      });
    } catch (e) {
      // Fallback: stocker en localStorage si API indispo
      localStorage.setItem("helyacare_bilan", JSON.stringify({ ...finalAnswers, completed_at: new Date().toISOString() }));
      setBilan({ ...finalAnswers, completed_at: new Date().toISOString() });
    } finally {
      setSaving(false);
      setShowQuiz(false);
    }
  };

  const handleAnswer = async (answer: string) => {
    const currentKey = QUIZ[step]?.key;
    if (!currentKey) return;

    const newAnswers = { ...answers, [currentKey]: answer };
    setAnswers(newAnswers);

    if (step < QUIZ.length - 1) {
      setStep(s => s + 1);
    } else {
      // Dernier step → sauvegarder
      await saveBilan(newAnswers);
    }
  };

  const resetBilan = async () => {
    if (!token) return;
    setSaving(true);
    try {
      await fetch(`${backendUrl}/store/customers/me`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          ...(publishableKey && { "x-publishable-api-key": publishableKey }),
        },
        body: JSON.stringify({
          metadata: {
            bilan_objectif: null,
            bilan_energie: null,
            bilan_grignotage: null,
            bilan_completed_at: null,
          },
        }),
      });
    } catch {}
    localStorage.removeItem("helyacare_bilan");
    setBilan(null);
    setAnswers({});
    setStep(0);
    setShowQuiz(true);
    setSaving(false);
  };

  // ── Loading ──────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-20 ${pjs.className}`}>
        <Loader2 className="w-8 h-8 text-[#0F3D3E] animate-spin" />
      </div>
    );
  }

  // ── Bilan complet ────────────────────────────────────────────────────────
  if (bilan && !showQuiz) {
    const completedDate = bilan.completed_at
      ? new Date(bilan.completed_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })
      : null;

    return (
      <div className={`space-y-8 ${pjs.className}`}>
        <div className="bg-white rounded-3xl p-8 border border-[#E8E3DC] shadow-sm">
          <div className="flex items-center gap-4 mb-8 border-b border-[#E8E3DC] pb-6">
            <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className={`text-2xl font-bold text-[#0F3D3E] ${inter.className}`}>Bilan Métabolique Complet</h2>
              {completedDate && (
                <p className="text-gray-400 text-xs mt-0.5">Complété le {completedDate}</p>
              )}
              <p className="text-gray-500 text-sm">L'IA HelyaCare adapte vos recommandations en fonction de votre profil.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {[
              { icon: Target, label: "Objectif Principal", value: bilan.objectif, color: "text-[#E56B2D]", bg: "bg-orange-50" },
              { icon: Activity, label: "Niveau d'Énergie", value: bilan.energie, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: Brain, label: "Grignotage", value: bilan.grignotage, color: "text-purple-600", bg: "bg-purple-50" },
            ].map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className={`${bg} p-5 rounded-2xl border border-opacity-20`}>
                <div className="flex items-center gap-2 mb-3">
                  <Icon className={`w-5 h-5 ${color}`} />
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</p>
                </div>
                <p className={`text-[#0F3D3E] font-bold text-[15px] ${inter.className}`}>{value || "—"}</p>
              </div>
            ))}
          </div>

          {/* IA Recommendations */}
          <div className="bg-[#0F3D3E] rounded-2xl p-6 text-white mb-6">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-5 h-5 text-[#CBF27A]" />
              <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest">Recommandations IA</p>
            </div>
            <p className={`text-white/90 text-[15px] leading-relaxed ${inter.className}`}>
              Sur la base de votre profil <strong className="text-[#CBF27A]">« {bilan.objectif} »</strong>, 
              notre protocole recommande Crave Control en prise matinale. Votre niveau d'énergie 
              <strong className="text-[#CBF27A]"> « {bilan.energie} »</strong> suggère un soutien métabolique prioritaire.
            </p>
          </div>

          <button
            onClick={resetBilan}
            disabled={saving}
            className="flex items-center gap-2 text-sm font-semibold text-[#E56B2D] hover:underline disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            {saving ? "Réinitialisation..." : "Refaire mon bilan"}
          </button>
        </div>
      </div>
    );
  }

  // ── Quiz ─────────────────────────────────────────────────────────────────
  if (showQuiz || !bilan) {
    const currentQuestion = QUIZ[step];
    return (
      <div className={`space-y-8 ${pjs.className}`}>
        <div className="bg-[#0A192F] rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
          <Image src="/images/experience/experience_ai_chip_1776847799863.png" alt="AI Tech" fill className="object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/80 to-transparent" />

          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#CBF27A]/20 text-[#CBF27A] border border-[#CBF27A]/30 text-xs font-bold uppercase tracking-wider rounded-full mb-6">
              <Bot className="w-4 h-4" />
              <span>Diagnostic IA</span>
            </div>
            <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${inter.className}`}>
              {step === 0 ? "Apprenons à vous connaître." : "Une question de plus..."}
            </h2>
            <p className="text-white/70 text-lg mb-8 leading-relaxed">
              {step === 0 && "Pour que l'IA HelyaCare puisse personnaliser vos recommandations, nous avons besoin de comprendre vos habitudes métaboliques actuelles."}
            </p>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 md:p-8 border border-white/10">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-sm font-medium text-[#CBF27A]">Question {step + 1} sur {QUIZ.length}</span>
                <div className="flex gap-1">
                  {QUIZ.map((_, i) => (
                    <div key={i} className={`w-8 h-1.5 rounded-full transition-all ${i <= step ? "bg-[#CBF27A]" : "bg-white/20"}`} />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className={`text-xl font-semibold ${inter.className}`}>{currentQuestion.question}</h3>
                <div className="space-y-3">
                  {currentQuestion.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleAnswer(option)}
                      disabled={saving}
                      className="w-full text-left p-4 rounded-xl border border-white/20 hover:border-[#CBF27A] hover:bg-[#CBF27A]/10 transition-all flex items-center justify-between group disabled:opacity-50"
                    >
                      <span>{option}</span>
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-[#CBF27A] transition-colors" />
                    </button>
                  ))}
                </div>
                {saving && (
                  <div className="flex items-center gap-2 text-[#CBF27A] text-sm">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement de votre bilan...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
