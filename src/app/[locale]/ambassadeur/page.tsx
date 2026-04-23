"use client";

import Image from "next/image";
import { useState } from "react";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  TrendingUp, Users, BarChart3, Wallet, Award,
  Share2, Zap, CheckCircle, ArrowRight, Lock,
  AtSign, Smartphone
} from "lucide-react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700", "800", "900"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["300", "400", "500", "600", "700"] });

export default function AmbassadeurPage() {
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "", referralCode: "" });
  const [submitted, setSubmitted] = useState(false);
  const [pwError, setPwError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setPwError(true);
      return;
    }
    setPwError(false);
    setSubmitted(true);
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
                <span className="text-[#E56B2D] text-xs font-bold uppercase tracking-widest">Programme Ambassadeur</span>
              </div>

              <h1 className={`text-4xl md:text-5xl lg:text-[3.8rem] font-black text-white leading-[1.05] tracking-tight mb-6 ${inter.className}`}>
                Monétisez<br />votre influence.<br />
                <span className="text-[#CBF27A]">Devenez pionnier<br />HelyaCare.</span>
              </h1>

              <p className="text-white/65 text-lg font-light leading-relaxed mb-10 max-w-lg">
                Rejoignez l&apos;élite de la Health Tech. Partagez l&apos;innovation, générez des revenus récurrents et construisez votre indépendance financière.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="#inscription"
                  className={`px-8 py-4 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl text-center hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${pjs.className}`}
                >
                  Rejoindre le réseau →
                </a>
                <a
                  href="#processus"
                  className={`px-8 py-4 bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold text-sm rounded-xl text-center hover:bg-white/20 transition-colors ${pjs.className}`}
                >
                  Comment ça marche ?
                </a>
              </div>

              {/* Social proof row */}
              <div className="flex items-center gap-8 mt-12 pt-10 border-t border-white/10">
                <div>
                  <div className={`text-3xl font-black text-white ${inter.className}`}>4.8★</div>
                  <div className="text-white/50 text-xs mt-1">Satisfaction ambassadeurs</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className={`text-3xl font-black text-[#CBF27A] ${inter.className}`}>150K+</div>
                  <div className="text-white/50 text-xs mt-1">FCFA/mois en moyenne</div>
                </div>
                <div className="w-px h-12 bg-white/10" />
                <div>
                  <div className={`text-3xl font-black text-white ${inter.className}`}>3 niv.</div>
                  <div className="text-white/50 text-xs mt-1">Commissions MLM</div>
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
                    <div className="text-xs font-bold text-white/50 uppercase tracking-widest">Dashboard Live</div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">Actif</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Wallet className="w-4 h-4 text-[#E56B2D]" />
                    <span className="text-white/60 text-xs">Trésorerie Disponible</span>
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
                      <div className="text-white/50 text-xs mt-1">Filleuls actifs</div>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                      <BarChart3 className="w-5 h-5 text-[#E56B2D] mb-2" />
                      <div className={`text-2xl font-bold text-white ${inter.className}`}>89%</div>
                      <div className="text-white/50 text-xs mt-1">Taux rétention</div>
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
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.2em] mb-4">Vos avantages</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                Un revenu passif,<br />sans plafond.
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
                    <span className="text-white/50 text-xs uppercase tracking-widest font-bold">Helya Business Hub</span>
                  </div>
                  
                  <div className="mb-8">
                    <p className="text-white/50 text-sm mb-2">Trésorerie Disponible</p>
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
                      { label: "Niveau 1", val: "10%", sub: "Ventes directes" },
                      { label: "Niveau 2", val: "5%", sub: "Filleuls filleuls" },
                      { label: "Niveau 3", val: "2%", sub: "Réseau étendu" },
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
                    title: "Commissions multi-niveaux",
                    desc: "Gagnez sur 3 niveaux de votre réseau. Plus vous recrutez, plus vos revenus passifs augmentent exponentiellement."
                  },
                  {
                    icon: <TrendingUp className="w-6 h-6 text-[#E56B2D]" />,
                    title: "Revenus récurrents",
                    desc: "Chaque abonnement de votre réseau vous génère une commission mensuelle automatique, mois après mois."
                  },
                  {
                    icon: <BarChart3 className="w-6 h-6 text-[#0F3D3E]" />,
                    title: "Dashboard temps réel",
                    desc: "Suivez vos performances, votre réseau et vos gains au centime près depuis votre espace Ambassadeur."
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
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.2em] mb-4">La Méthode</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight ${inter.className}`}>
                Simple. Puissant. Récurrent.
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              {/* Connector line on desktop */}
              <div className="hidden md:block absolute top-14 left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px bg-gradient-to-r from-[#CBF27A]/20 via-[#CBF27A]/60 to-[#CBF27A]/20" />

              {[
                {
                  step: "01",
                  icon: <Lock className="w-7 h-7 text-[#CBF27A]" />,
                  title: "Rejoignez",
                  desc: "Postulez en 2 minutes. Recevez votre lien affilié unique, votre kit de démarrage digital et accédez à votre dashboard instantanément."
                },
                {
                  step: "02",
                  icon: <Share2 className="w-7 h-7 text-[#E56B2D]" />,
                  title: "Partagez",
                  desc: "Diffusez l'expérience Crave Control et le coach IA Botpress à votre communauté. Votre lien trackera chaque vente automatiquement."
                },
                {
                  step: "03",
                  icon: <Smartphone className="w-7 h-7 text-[#CBF27A]" />,
                  title: "Encaissez",
                  desc: "Recevez vos commissions directement sur votre Mobile Money (Orange, MTN) ou votre compte bancaire, chaque fin de mois."
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
              <p className="text-[10px] font-bold text-[#E56B2D] uppercase tracking-[0.2em] mb-4">L'outil de vente</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-[#0F3D3E] leading-tight ${inter.className}`}>
                Un produit qui<br />se vend tout seul.
              </h2>
              <p className="text-gray-500 text-lg font-light mt-4 max-w-xl mx-auto">
                Crave Control n&apos;est pas juste un complément. C&apos;est un système de santé avec une IA embarquée — une expérience inédite en Afrique.
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
                  <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-2">Produit phare</p>
                  <h3 className={`text-2xl font-bold text-white ${inter.className}`}>Crave Control</h3>
                  <p className="text-white/70 text-sm mt-1">Régulation glycémique · 30 jours</p>
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
                  <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-2">IA embarquée</p>
                  <h3 className={`text-2xl font-bold text-white ${inter.className}`}>Coach Botpress</h3>
                  <p className="text-white/60 text-sm mt-1">Recommandations IA · WhatsApp</p>
                </div>

                {/* 3 selling points */}
                <div className="absolute top-6 right-6 flex flex-col gap-2">
                  {["WhatsApp natif", "Données privées", "Temps réel"].map((tag, i) => (
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
                <p className="text-gray-500 text-sm mb-1">Commission sur chaque vente directe</p>
                <div className="flex items-baseline gap-3">
                  <span className={`text-5xl font-black text-[#0F3D3E] ${inter.className}`}>10%</span>
                  <span className="text-gray-400 text-sm">= <strong className="text-[#E56B2D]">2 000 FCFA</strong> par cure vendue</span>
                </div>
              </div>
              <a
                href="#inscription"
                className={`px-8 py-4 bg-[#0F3D3E] text-white font-bold text-sm rounded-xl hover:bg-[#1a5556] transition-colors whitespace-nowrap ${pjs.className}`}
              >
                Créer mon compte →
              </a>
            </div>
          </div>
        </section>

        {/* ── 5. FORMULAIRE D'INSCRIPTION DIRECTE ─────────────────────── */}
        <section id="inscription" className="bg-[#0F3D3E] py-24 md:py-32 px-6">
          <div className="max-w-[640px] mx-auto">
            <div className="text-center mb-12">
              <p className="text-[10px] font-bold text-[#CBF27A]/60 uppercase tracking-[0.2em] mb-4">Inscription</p>
              <h2 className={`text-4xl md:text-5xl font-bold text-white leading-tight mb-4 ${inter.className}`}>
                Créez votre compte.<br />Obtenez votre lien.
              </h2>
              <p className={`text-white/50 font-light leading-relaxed ${pjs.className}`}>
                En 60 secondes, vous aurez votre lien d&apos;affiliation unique et accès à votre dashboard Ambassadeur.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white/5 backdrop-blur-md border border-[#CBF27A]/30 rounded-3xl p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-[#CBF27A]/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-8 h-8 text-[#CBF27A]" />
                </div>
                <h3 className={`text-2xl font-bold text-white mb-3 ${inter.className}`}>Compte créé !</h3>
                <p className={`text-white/60 mb-6 ${pjs.className}`}>Bienvenue dans le réseau HelyaCare. Vérifiez votre email pour activer votre compte et accéder à votre lien d&apos;affiliation.</p>
                <Link
                  href="/fr/connexion"
                  className={`inline-flex items-center justify-center gap-2 w-full py-4 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl hover:bg-gray-100 hover:scale-[1.02] transition-all duration-200 ${pjs.className}`}
                >
                  Se connecter à mon espace
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
                  {/* Prénom + Nom */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Prénom *</label>
                      <input
                        type="text" required
                        value={form.firstName}
                        onChange={e => setForm({ ...form, firstName: e.target.value })}
                        placeholder="Aminata"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-white/60 text-xs font-semibold uppercase tracking-widest">Nom *</label>
                      <input
                        type="text" required
                        value={form.lastName}
                        onChange={e => setForm({ ...form, lastName: e.target.value })}
                        placeholder="Diallo"
                        className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-white/60 focus:ring-1 focus:ring-white/60 focus:bg-white/10 transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                      Code de parrainage
                      <span className="text-white/30 normal-case font-normal tracking-normal">— si vous avez été invité</span>
                    </label>
                    <input
                      type="text"
                      value={form.referralCode}
                      onChange={e => setForm({ ...form, referralCode: e.target.value })}
                      placeholder="Ex : HC-AMINATA2024"
                      className="bg-white/5 text-white placeholder:text-white/30 border border-white/20 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-[#CBF27A]/50 focus:ring-1 focus:ring-[#CBF27A]/30 focus:bg-white/10 transition-all duration-200 font-mono"
                    />
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="mt-1 w-full flex items-center justify-center gap-3 bg-white text-[#0F3D3E] font-bold text-sm rounded-xl px-4 py-4 transition-all duration-200 hover:bg-gray-100 hover:shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-[0.98]"
                    >
                      Créer mon compte Ambassadeur
                      <ArrowRight className="w-4 h-4" />
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
