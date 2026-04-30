"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TrendingUp, Users, BarChart3, Wallet, Award,
  Share2, Zap, CheckCircle, ArrowRight, Lock,
  AtSign, Smartphone
} from "lucide-react";
import { Link } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function AmbassadeurPage() {
  const t = useTranslations("Ambassadeur");
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "", confirmPassword: "", referralCode: "" });
  const [submitted, setSubmitted] = useState(false);
  const [pwError, setPwError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setForm(prev => ({ ...prev, referralCode: ref }));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);
    if (form.password !== form.confirmPassword) {
      setPwError(true);
      return;
    }
    setPwError(false);
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          first_name: form.firstName,
          last_name: form.lastName,
          phone: form.phone,
          role: "ambassadeur",
          referral_code: form.referralCode
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.error || "Une erreur est survenue lors de la création de votre compte ambassadeur.");
        setLoading(false);
        return;
      }

      setSubmitted(true);
    } catch (err) {
      setApiError("Erreur de connexion au serveur. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={`text-gray-900 ${pjs.className}`}>

        {/* ── 1. HERO "ASPIRATION & LIBERTÉ" ──────────────────────────── */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#0A192F]">
          {/* Background image */}
          <Image
            src="/images/ambassador_hero.png"
            alt="Ambassadeur HelyaCare — Liberté et Succès"
            fill
            className="object-cover opacity-40"
            priority
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F3D3E]/90 via-[#0F3D3E]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-transparent to-transparent" />



          <div className="relative z-10 max-w-[1200px] mx-auto px-6 py-24 md:py-0 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
            <div>
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 bg-[#E56B2D]/15 border border-[#E56B2D]/30 rounded-full px-4 py-1.5 mb-8">
                <Award className="w-4 h-4 text-[#E56B2D]" />
                <span className="text-[#E56B2D] text-xs font-bold uppercase tracking-widest">{t("badge")}</span>
              </div>

              <h1 className={`text-4xl md:text-5xl lg:text-[3.8rem] font-black text-white leading-[1.05] tracking-tight mb-6 ${inter.className}`}>
                {t("hero.title1")}<br />{t("hero.title2")}<br />
                <span className="text-[#CBF27A]">{t("hero.title3")}<br />{t("hero.title4")}</span>
              </h1>

              <p className="text-white/65 text-lg font-light leading-relaxed mb-10 max-w-lg">
                {t("hero.desc")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#inscription"
                  className={`px-8 py-4 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl text-center hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${pjs.className}`}
                >
                  {t("hero.btn1")}
                </a>
                <a
                  href="#processus"
                  className={`px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm rounded-xl text-center hover:bg-white/20 transition-colors ${pjs.className}`}
                >
                  {t("hero.btn2")}
                </a>
              </div>

              {/* Social proof row */}
              <div className="flex items-center gap-8 mt-12 pt-10 border-t border-white/10">
                <div>
                  <div className={`text-3xl font-black text-white ${inter.className}`}>4.8★</div>
                  <div className="text-white/50 text-xs mt-1">{t("hero.social1_label")}</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className={`text-3xl font-black text-[#CBF27A] ${inter.className}`}>150K+</div>
                  <div className="text-white/50 text-xs mt-1">{t("hero.social2_label")}</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className={`text-3xl font-black text-white ${inter.className}`}>3 niv.</div>
                  <div className="text-white/50 text-xs mt-1">{t("hero.social3_label")}</div>
                </div>
              </div>
            </div>

            {/* Hero right — floating dashboard preview card */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative w-full max-w-md">
                {/* Glow effect */}
                <div className="absolute -inset-4 bg-[#CBF27A]/10 rounded-3xl blur-2xl" />
                <div className="relative bg-[#0F3D3E]/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl">
                  <div className="flex items-center justify-between mb-5">
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest">{t("hero.dashboard_label")}</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">{t("hero.dashboard_active")}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-[#E56B2D]" />
                    <span className="text-white/60 text-xs">{t("hero.dashboard_wallet")}</span>
                  </div>
                  <div className={`text-4xl font-black text-white mb-1 ${inter.className}`}>
                    150 000 <span className="text-lg text-white/40">FCFA</span>
                  </div>
                  <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 text-sm font-semibold">+12%</span>
                    <span className="text-white/50 text-xs">ce mois</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <Users className="w-5 h-5 text-[#CBF27A] mb-2" />
                      <div className={`text-2xl font-bold text-white ${inter.className}`}>24</div>
                      <div className="text-white/50 text-xs mt-1">{t("hero.dashboard_affiliates")}</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <BarChart3 className="w-5 h-5 text-[#E56B2D] mb-2" />
                      <div className={`text-2xl font-bold text-white ${inter.className}`}>89%</div>
                      <div className="text-white/50 text-xs mt-1">{t("hero.dashboard_retention")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. PREUVE FINANCIÈRE ──────────────────────────────────────── */}
        <section className="bg-[#F2F0EB] py-24 md:py-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.2em] mb-4">{t("proof.eyebrow")}</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                {t("proof.title1")}<br />{t("proof.title2")}
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

              {/* Central dashboard mockup */}
              <div className="lg:col-span-2 relative bg-[#0F3D3E] rounded-3xl overflow-hidden shadow-2xl min-h-[420px] flex flex-col justify-between p-8 md:p-10">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#CBF27A]/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-[#E56B2D]/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-400" />
                    <span className="text-white/50 text-xs uppercase tracking-widest font-bold">{t("proof.dashboard_label")}</span>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-white/50 text-sm mb-2">{t("proof.dashboard_available")}</p>
                    <p className={`text-5xl md:text-6xl font-black text-white ${inter.className}`}>
                      150 000 <span className="text-2xl text-white/40">FCFA</span>
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <TrendingUp className="w-4 h-4 text-[#CBF27A]" />
                      <span className="text-[#CBF27A] text-sm font-semibold">+12% ce mois</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: t("proof.tier1"), val: "10%", sub: t("proof.tier1_sub") },
                      { label: t("proof.tier2"), val: "5%", sub: t("proof.tier2_sub") },
                      { label: t("proof.tier3"), val: "2%", sub: t("proof.tier3_sub") },
                    ].map((tier, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                        <p className="text-[#CBF27A] text-xs font-bold uppercase mb-2">{tier.label}</p>
                        <p className={`text-2xl font-black text-white ${inter.className}`}>{tier.val}</p>
                        <p className="text-white/40 text-[11px] mt-1">{tier.sub}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 3 avantages */}
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: <Users className="w-6 h-6 text-[#0F3D3E]" />,
                    title: t("proof.c1_title"),
                    desc: t("proof.c1_desc")
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6 text-[#E56B2D]" />,
                    title: t("proof.c2_title"),
                    desc: t("proof.c2_desc")
                  },
                  {
                    icon: <BarChart3 className="w-6 h-6 text-[#0F3D3E]" />,
                    title: t("proof.c3_title"),
                    desc: t("proof.c3_desc")
                  },
                ].map((card, i) => (
                  <div key={i} className="bg-white border border-[#E8E3DC] rounded-2xl p-6 flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="w-12 h-12 rounded-xl bg-[#F6F4F1] flex items-center justify-center shrink-0">
                      {card.icon}
                    </div>
                    <div>
                      <h4 className={`font-bold text-[#0F3D3E] mb-1 ${inter.className}`}>{card.title}</h4>
                      <p className="text-gray-500 text-[13px] leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. LE PROCESSUS 1-2-3 ────────────────────────────────────── */}
        <section id="processus" className="bg-[#0F3D3E] py-24 md:py-32 px-6">
          <div className="max-w-[1000px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.2em] mb-4">{t("process.eyebrow")}</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight ${inter.className}`}>
                {t("process.title")}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-14 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-[#CBF27A]/20 via-[#CBF27A]/60 to-[#CBF27A]/20" />

              {[
                {
                  step: "01",
                  icon: <Lock className="w-7 h-7 text-[#CBF27A]" />,
                  title: t("process.s1_title"),
                  desc: t("process.s1_desc")
                },
                {
                  step: "02",
                  icon: <Share2 className="w-7 h-7 text-[#E56B2D]" />,
                  title: t("process.s2_title"),
                  desc: t("process.s2_desc")
                },
                {
                  step: "03",
                  icon: <Smartphone className="w-7 h-7 text-[#CBF27A]" />,
                  title: t("process.s3_title"),
                  desc: t("process.s3_desc")
                },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-4 relative">
                  <div className="relative w-28 h-28 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#CBF27A] flex items-center justify-center">
                      <span className={`text-[#0F3D3E] text-xs font-black ${inter.className}`}>{step.step}</span>
                    </div>
                    {step.icon}
                  </div>
                  <h3 className={`text-xl font-bold text-white ${inter.className}`}>{step.title}</h3>
                  <p className="text-white/55 text-[14px] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. LE PRODUIT STAR ───────────────────────────────────────── */}
        <section className="bg-[#F2F0EB] py-24 md:py-32 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.2em] mb-4">{t("product.eyebrow")}</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                {t("product.title1")}<br />{t("product.title2")}
              </h2>
              <p className="text-gray-500 text-lg font-light mt-4 max-w-xl mx-auto">
                {t("product.desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product card */}
              <div className="relative rounded-3xl overflow-hidden min-h-[400px] group">
                <Image
                  src="/images/products/crave-control/macro.png"
                  alt="Crave Control"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F3D3E]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-2">{t("product.product_badge")}</p>
                  <h3 className={`text-2xl font-bold text-white ${inter.className}`}>{t("product.product_name")}</h3>
                  <p className="text-white/70 text-sm mt-1">{t("product.product_sub")}</p>
                </div>
              </div>

              {/* AI card */}
              <div className="relative rounded-3xl overflow-hidden min-h-[400px] bg-[#0A192F] group">
                <Image
                  src="/images/experience/experience_ai_chip_1776847799863.png"
                  alt="IA Botpress HelyaCare"
                  fill
                  className="object-cover opacity-40 group-hover:opacity-55 transition-opacity duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="w-10 h-10 rounded-xl bg-[#CBF27A]/20 border border-[#CBF27A]/30 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-[#CBF27A]" />
                  </div>
                  <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-2">{t("product.ai_badge")}</p>
                  <h3 className={`text-2xl font-bold text-white ${inter.className}`}>{t("product.ai_title")}</h3>
                  <p className="text-white/60 text-sm mt-1">{t("product.ai_sub")}</p>
                </div>

                {/* 3 selling points */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  {[t("product.tag1"), t("product.tag2"), t("product.tag3")].map((tag, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-white/10 border border-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                      <CheckCircle className="w-3 h-3 text-[#CBF27A]" />
                      <span className="text-white text-[11px] font-medium">{tag}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Commission rate callout */}
            <div className="mt-6 bg-white border border-[#E8E3DC] rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="text-gray-500 text-sm mb-1">{t("product.commission_label")}</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-black text-[#0F3D3E] ${inter.className}`}>10%</span>
                  <span className="text-gray-400 text-sm">{t("product.commission_desc")}</span>
                </div>
              </div>
              <a
                href="#inscription"
                className={`px-8 py-4 bg-[#0F3D3E] text-white font-bold text-sm rounded-xl hover:bg-[#1a5556] transition-colors whitespace-nowrap ${pjs.className}`}
              >
                {t("product.commission_cta")}
              </a>
            </div>
          </div>
        </section>

        {/* ── 5. FORMULAIRE D'INSCRIPTION DIRECTE ─────────────────────── */}
        <section id="inscription" className="bg-[#0F3D3E] py-24 md:py-32 px-6">
          <div className="max-w-[640px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.2em] mb-4">{t("form.eyebrow")}</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight mb-4 ${inter.className}`}>
                {t("form.title1")}<br />{t("form.title2")}
              </h2>
              <p className={`text-white/50 font-light leading-relaxed ${pjs.className}`}>
                {t("form.subtitle")}
              </p>
            </div>

            {submitted ? (
              <div className="bg-white/5 backdrop-blur-md border border-[#CBF27A]/30 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#CBF27A]/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#CBF27A]" />
                </div>
                <h3 className={`text-2xl font-bold text-white mb-3 ${inter.className}`}>{t("form.success_title")}</h3>
                <p className={`text-white/60 mb-6 ${pjs.className}`}>{t("form.success_desc")}</p>
                <Link
                  href="/connexion"
                  className={`inline-flex items-center justify-center gap-2 w-full py-4 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200 ${pjs.className}`}
                >
                  {t("form.success_cta")}
                </Link>
              </div>
            ) : (
              <div className="relative">
                {/* Glow border */}
                <div className="absolute -inset-[1px] bg-gradient-to-br from-white/15 via-white/5 to-[#CBF27A]/10 rounded-3xl" />
                <form
                  onSubmit={handleSubmit}
                  className={`relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 space-y-5 ${pjs.className}`}
                >
                  {apiError && (
                    <div className="mb-5 bg-red-500/20 border border-red-400/30 text-red-200 px-4 py-3 rounded-xl text-sm leading-snug">
                      {apiError}
                    </div>
                  )}

                  {/* Prénom + Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">{t("form.firstName")} *</label>
                      <input
                        type="text" required
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        placeholder="Aminata"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">{t("form.lastName")} *</label>
                      <input
                        type="text" required
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Diallo"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Email & Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Adresse Email *</label>
                      <input
                        type="email" required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        placeholder="vous@exemple.com"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">{t("form.phone")} *</label>
                      <input
                        type="tel" required
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        placeholder="+221 XX XXX XX XX"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Mot de passe + Confirmer */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Mot de passe *</label>
                      <input
                        type="password" required minLength={8}
                        value={form.password}
                        onChange={e => { setForm({ ...form, password: e.target.value }); setPwError(false); }}
                        placeholder="••••••••"
                        className={`bg-white/5 text-white placeholder:text-white/30 border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-1 transition-all duration-200 ${
                          pwError ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/30' : 'border-white/20 focus:border-white/60 focus:ring-white/60 focus:bg-white/10'
                        }`}
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Confirmer *</label>
                      <input
                        type="password" required
                        value={form.confirmPassword}
                        onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setPwError(false); }}
                        placeholder="••••••••"
                        className={`bg-white/5 text-white placeholder:text-white/30 border rounded-xl px-4 py-3.5 text-sm outline-none focus:ring-1 transition-all duration-200 ${
                          pwError ? 'border-red-400/60 focus:border-red-400 focus:ring-red-400/30' : 'border-white/20 focus:border-white/60 focus:ring-white/60 focus:bg-white/10'
                        }`}
                      />
                    </div>
                  </div>
                  {pwError && (
                    <p className="text-red-400 text-xs -mt-2">Les mots de passe ne correspondent pas.</p>
                  )}

                  {/* Code de parrainage */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-white/60 text-xs font-semibold uppercase tracking-widest flex items-center gap-2">
                      Code de parrainage *
                    </label>
                    <input
                      type="text" required
                      value={form.referralCode}
                      onChange={e => setForm({ ...form, referralCode: e.target.value })}
                      placeholder="Ex : HL-XXXXXX"
                      className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#CBF27A]/50 focus:ring-1 focus:ring-[#CBF27A]/30 focus:bg-white/10 transition-all duration-200 font-mono"
                    />
                  </div>

                  {/* Submit CTA */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="group w-full flex items-center justify-center gap-3 bg-[#CBF27A] text-[#0A192F] font-black text-sm uppercase tracking-wide rounded-xl px-4 py-4 transition-all duration-300 hover:bg-[#d6f592] hover:shadow-[0_0_40px_rgba(203,242,122,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {loading ? "Création en cours..." : t("form.cta")}
                      {!loading && <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>}
                    </button>
                    <p className="text-white/25 text-xs text-center mt-4">
                      En créant un compte, vous acceptez nos 
                      <span className="text-white/50 hover:text-white cursor-pointer">Conditions Générales</span>.
                      Vos données ne seront jamais revendues.
                    </p>
                  </div>
                </form>
              </div>
            )}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
