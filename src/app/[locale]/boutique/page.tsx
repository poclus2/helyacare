"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { BOUTIQUE_PRICES } from "@/lib/prices";
import "./boutique.css";

const products = [
  {
    id: 1,
    priceKey: "crave-control" as const,
    badge: "Nouveau",
    sku: "CC-01™",
    title: "Crave Control",
    desc: "Un bouclier neuro-métabolique qui régule l'appétit, aide à limiter les fringales et soutient le métabolisme au quotidien.",
    image: "/crave-control.png",
    cta: "Ajouter au panier",
    href: "/boutique/crave-control",
    saveBadge: null as string | null,
  },
  {
    id: 2,
    priceKey: "pack-bien-etre" as const,
    badge: null as string | null,
    sku: null as string | null,
    title: "Pack Bien-Être Essentiel",
    desc: "Duo quotidien validé cliniquement associant Crave Control et Helya Hydrate pour une santé optimale au quotidien.",
    saveBadge: "Pack — Économisez 20%",
    image: "/crave-control.png",
    cta: "Ajouter au panier",
    href: "/boutique/pack-bien-etre",
  },
  {
    id: 3,
    priceKey: "apple-satiety-shot" as const,
    badge: "Nouveau",
    sku: "AS-02™",
    title: "Apple Satiety Shot",
    desc: "Shot de satiété formulé avec des extraits de pomme et de plantes adaptogènes pour couper les envies entre les repas.",
    image: "/crave-control.png",
    cta: "Ajouter au panier",
    href: "/boutique/apple-satiety-shot",
    saveBadge: null as string | null,
  },
  {
    id: 4,
    priceKey: "helya-hydrate" as const,
    badge: "Nouveau",
    sku: "HH-03™",
    title: "Helya Hydrate",
    desc: "Électrolytes premium enrichis en minéraux essentiels pour une hydratation cellulaire optimale et une récupération accélérée.",
    image: "/crave-control.png",
    cta: "Ajouter au panier",
    href: "/boutique/helya-hydrate",
    saveBadge: null as string | null,
  },
  {
    id: 5,
    priceKey: "helya-vigor" as const,
    badge: null as string | null,
    sku: "HV-04™",
    title: "Helya Vigor",
    desc: "Formule vitalité et énergie à base de plantes et de vitamines B pour soutenir l'endurance physique et mentale.",
    image: "/crave-control.png",
    cta: "Ajouter au panier",
    href: "/boutique/helya-vigor",
    saveBadge: null as string | null,
  },
  {
    id: 6,
    priceKey: "helya-perform" as const,
    badge: "Bientôt",
    sku: "HP-05™",
    title: "Helya Perform",
    desc: "Protocole performance avancé, formulé pour les sportifs souhaitant optimiser leur récupération musculaire et leur clarté mentale.",
    image: "/crave-control.png",
    cta: "Rejoindre la liste d'attente",
    href: "/boutique/helya-perform",
    saveBadge: null as string | null,
  },
];

export default function BoutiquePage() {
  const t = useTranslations("Boutique2");
  const { formatPrice } = useCurrency();

  return (
    <div className="seed-page">
      {/* Promo Banner */}
      <div className="seed-promo-banner">
        <span>{t("promoBanner")}</span>
      </div>

      {/* Global Header */}
      <Header />

      {/* Hero Section */}
      <section className="seed-hero">
        <div className="seed-hero-bg">
          <img src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop" alt="Hero background" />
          <div className="seed-hero-overlay"></div>
        </div>

        <div className="seed-hero-content">
          <h1 className="seed-hero-title">
            {t("heroTitle1")}<br />{t("heroTitle2")}
          </h1>

          <div className="seed-hero-cards">
            {/* Featured Product Card */}
            <div className="seed-featured-card">
              <div className="seed-badge-featured">{t("featuredBadge")}</div>
              <div className="seed-featured-layout">
                <div className="seed-featured-img-wrap">
                  <img src="/crave-control.png" alt="Crave Control" />
                </div>
                <div className="seed-featured-details">
                  <span className="seed-sku-pill">{t("featuredCategory")}</span>
                  <h2 className="seed-featured-title">{t("featuredTitle")}</h2>
                  <p className="seed-featured-desc">
                    {t("featuredDesc")}
                  </p>
                  <p className="seed-featured-price">
                    {formatPrice(BOUTIQUE_PRICES["crave-control"].normal)}
                  </p>
                  <div className="seed-featured-actions">
                    <Link href="/boutique/crave-control">
                      <button className="seed-btn-primary-white">{t("discoverBtn")}</button>
                    </Link>
                    <button className="seed-btn-text-white">{t("addBtn")}</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Card */}
            <div className="seed-quiz-card">
              <img src="/hand-capsule-quiz.png" alt="Main avec gélule" className="seed-quiz-img"/>
              <div className="seed-quiz-text">
                <p>{t("quizText")}</p>
                <a href="#" className="seed-quiz-link">{t("quizBtn")}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="seed-grid-section">
        <div className="seed-grid-container">
          {products.map((product) => {
            const prices = BOUTIQUE_PRICES[product.priceKey];
            const displayPrice = formatPrice(prices.subscription ?? prices.normal);
            const strikePrice = prices.subscription ? formatPrice(prices.normal) : null;

            return (
              <div key={product.id} className="seed-card">
                {product.badge && <div className="seed-card-badge">{product.badge}</div>}

                <div className="seed-card-layout">
                  <div className="seed-card-image-col">
                    <Link href={product.href}>
                      <img src={product.image} alt={product.title} className="cursor-pointer hover:scale-105 transition-transform duration-500" />
                    </Link>
                  </div>
                  <div className="seed-card-content-col">
                    {product.sku && <span className="seed-sku-light">{product.sku}</span>}
                    <h3 className="seed-card-title">{product.title}</h3>
                    <p className="seed-card-desc">{product.desc}</p>

                    {product.saveBadge && (
                      <div className="seed-save-badge">{product.saveBadge}</div>
                    )}

                    <div className="seed-card-price">
                      {displayPrice}
                      {strikePrice && (
                        <span className="seed-strikethrough ml-2 text-[0.8em] opacity-60">
                          {strikePrice}
                        </span>
                      )}
                    </div>

                    <div className="seed-card-actions">
                      <Link href={product.href}>
                        <button className="seed-btn-primary-dark">Découvrir</button>
                      </Link>
                      <button className="seed-btn-text-dark">{product.cta}</button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Science Journal + Protocols Section */}
      <section className="seed-science-section">
        <div className="seed-science-container">

          {/* Left: Science Journal Card */}
          <div className="seed-journal-card">
            <div className="seed-journal-overlay" />
            <img
              src="https://images.unsplash.com/photo-1582719471384-894fbb16e074?q=80&w=1500&auto=format&fit=crop"
              alt="Scientifique HelyaCare"
              className="seed-journal-bg"
            />
            <div className="seed-journal-content">
              <span className="seed-journal-label">Recherche approfondie</span>
              <h2 className="seed-journal-title">Le Journal Scientifique<br />HelyaCare</h2>
              <p className="seed-journal-desc">
                Explorez notre bibliothèque d&apos;études validées et la méthodologie IA qui propulse chaque formule.
              </p>
              <button className="seed-journal-btn">Lire l&apos;édition actuelle</button>
            </div>
          </div>

          {/* Right: Personalized Protocols Card */}
          <div className="seed-protocols-card">
            <div className="seed-protocols-icon">✚</div>
            <h3 className="seed-protocols-title">Protocoles<br />Personnalisés</h3>
            <p className="seed-protocols-desc">
              Connectez vos données de santé pour recevoir une pile de suppléments générée par l&apos;IA, adaptée à votre biologie unique.
            </p>
            <button className="seed-protocols-btn">Faire l&apos;évaluation</button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
