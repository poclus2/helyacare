"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./experience.css";

export default function ExperiencePage() {
  const t = useTranslations("Experience");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const doctors = t.raw("experts.doctors") as { name: string; role: string; quote: string }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <div className="exp-page">
      {/* Promo Banner */}
      <div className="exp-promo-banner">
        <span>Science validée · Formules exclusives · Livraison rapide au Cameroun</span>
      </div>

      {/* Header */}
      <Header />

      {/* ── HERO ────────────────────────────────────────────────── */}
      <section className="exp-hero">
        <div className="exp-hero-bg">
          <img
            src="/images/experience/experience_hero_bg_new.png"
            alt="HelyaCare — L'expérience bien-être"
          />
          <div className="exp-hero-overlay" />
        </div>

        <div className="exp-hero-content">
          <h1 className="exp-hero-title">
            La science<br />au service<br />de votre santé
          </h1>

          <div className="exp-hero-cards">
            {/* Stats Card */}
            <div className="exp-stats-card">
              <p className="exp-stats-card-label">Résultats cliniques prouvés</p>
              <div className="exp-stats-grid">
                <div className="exp-stat-item">
                  <span className="exp-stat-number">95%</span>
                  <span className="exp-stat-label">des clients observent une amélioration du sommeil</span>
                </div>
                <div className="exp-stat-item">
                  <span className="exp-stat-number accent">87%</span>
                  <span className="exp-stat-label">constatent une réduction des envies alimentaires</span>
                </div>
                <div className="exp-stat-item">
                  <span className="exp-stat-number">75%</span>
                  <span className="exp-stat-label">rapportent un gain d'énergie dès les 2 premières semaines</span>
                </div>
              </div>
            </div>

            {/* AI Feature Card */}
            <div className="exp-ai-card">
              <img
                src="/images/experience/experience_ai_phone_new.png"
                alt="IA HelyaCare"
              />
              <div className="exp-ai-text">
                <p>Intelligence Artificielle</p>
                <span>Suivi personnalisé en temps réel</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONNECTING THE DOTS (BENTO) ─────────────────────────── */}
      <section className="exp-bento-section">
        <div className="exp-bento-container">
          <div className="exp-bento-header">
            <h2 className="exp-bento-title">
              Comment ça<br />fonctionne ?
            </h2>
            <p className="exp-bento-desc">
              Un système holistique qui relie la science botanique, vos données personnelles et l'IA pour un résultat sur mesure.
            </p>
          </div>

          <div className="exp-bento-grid">
            {/* Large — Step 1 */}
            <div className="exp-bento-cell tall">
              <img
                src="/images/products/crave-control/macro.png"
                alt="Formules botaniques"
              />
              <div className="exp-bento-cell-overlay" />
              <div className="exp-bento-cell-content">
                <span className="exp-bento-step-num">Étape 01</span>
                <p className="exp-bento-step-label">
                  Des formules botaniques<br />ultra-concentrées
                </p>
              </div>
            </div>

            {/* Top Right — Step 2 */}
            <div className="exp-bento-cell">
              <img
                src="/images/experience/experience_data_scan_1776847840025.png"
                alt="Analyse personnalisée"
              />
              <div className="exp-bento-cell-overlay" />
              <div className="exp-bento-cell-content">
                <span className="exp-bento-step-num">Étape 02</span>
                <p className="exp-bento-step-label">Analyse de votre profil santé</p>
              </div>
            </div>

            {/* Bottom Right — Step 3+4 (green card) */}
            <div className="exp-bento-cell green-card">
              <span className="exp-bento-tag">IA + Dosage</span>
              <span className="exp-bento-step-num">Étapes 03 & 04</span>
              <p className="exp-bento-step-label">
                Protocole dosé avec précision, suivi intelligent par notre IA en temps réel
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EXPERTS ──────────────────────────────────────────────── */}
      <section className="exp-experts-section">
        <div className="exp-experts-container">
          <div className="exp-experts-header">
            <h2 className="exp-experts-title">Notre comité<br />d'experts</h2>
            <p className="exp-experts-sub">
              Médecins, chercheurs en phytothérapie et nutritionnistes. Une équipe au service de votre santé.
            </p>
          </div>

          <div className="exp-experts-feature">
            {/* Main doctor card */}
            <div className="exp-experts-main-img">
              <img
                src="/images/experience/experience_doctors_panel_new.png"
                alt="Comité d'experts HelyaCare"
              />
              <div className="exp-experts-main-overlay" />
              <div className="exp-experts-main-content">
                <h3>{doctors[0]?.name}</h3>
                <p>{doctors[0]?.role}</p>
                <blockquote>&ldquo;{doctors[0]?.quote}&rdquo;</blockquote>
              </div>
            </div>

            {/* Mini cards */}
            <div className="exp-experts-sidebar">
              {doctors.slice(1, 4).map((doc, i) => (
                <div key={i} className="exp-expert-mini-card">
                  <div>
                    <p className="exp-expert-mini-name">{doc.name}</p>
                    <p className="exp-expert-mini-role">{doc.role}</p>
                  </div>
                  <p className="exp-expert-mini-quote">&ldquo;{doc.quote}&rdquo;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SCIENCE JOURNAL + FAQ ─────────────────────────────────── */}
      <section className="exp-science-section">
        <div className="exp-science-container">
          {/* Left — Science Journal Card */}
          <div className="exp-journal-card">
            <div className="exp-journal-overlay" />
            <img
              src="/images/experience/experience_science_journal_new.png"
              alt="Recherche scientifique HelyaCare"
              className="exp-journal-bg"
            />
            <div className="exp-journal-content">
              <span className="exp-journal-label">Recherche & Études</span>
              <h2 className="exp-journal-title">
                Fondé sur la<br />science, pas sur<br />des tendances
              </h2>
              <p className="exp-journal-desc">
                Chaque formule est validée par des études cliniques et développée avec notre comité médical international.
              </p>
              <button className="exp-journal-btn">Lire nos études</button>
            </div>
          </div>

          {/* Right — FAQ Card */}
          <div className="exp-faq-card">
            <h3 className="exp-faq-card-title">Questions fréquentes</h3>
            {faqItems.slice(0, 5).map((faq, i) => (
              <div key={i} className="exp-faq-item" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="exp-faq-question">
                  <span>{faq.q}</span>
                  <span className={`exp-faq-icon ${openFaq === i ? "open" : ""}`}>+</span>
                </div>
                <div className={`exp-faq-answer ${openFaq === i ? "open" : ""}`}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
