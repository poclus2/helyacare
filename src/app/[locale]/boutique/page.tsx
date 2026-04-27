"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLivePrices } from "@/contexts/PricesContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
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
  const { addItem } = useCart();
  const { getPrice, getVariantId } = useLivePrices();
  const [addedId, setAddedId] = useState<string | number | null>(null);

  // Crave Control (id=1) est déjà affiché comme carte vedette dans le hero
  // → on l'exclut de la grille pour éviter le doublon
  const allProducts = products.filter(p => p.id !== 1);


  const handleAddToCart = async (product: any) => {
    if (product.id === 6) return; // Helya Perform — liste d'attente

    const normal = getPrice(product.priceKey, "normal");
    const sub = getPrice(product.priceKey, "subscription");
    const price = sub || normal;

    await addItem({
      variantId: getVariantId(product.priceKey) || `${product.priceKey}-v1`,
      quantity: 1,
      title: product.title,
      subtitle: sub ? "Abonnement mensuel" : "Achat unique",
      thumbnail: product.image,
      unit_price: price,
      currency_code: "XOF",
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };


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
                    {formatPrice(getPrice("crave-control", "normal"))}
                  </p>
                  <div className="seed-featured-actions">
                    <Link href="/boutique/crave-control">
                      <button className="seed-btn-primary-white">{t("discoverBtn")}</button>
                    </Link>
                    <button
                      className="seed-btn-text-white"
                      onClick={() => handleAddToCart(products[0])}
                    >
                      {addedId === 1 ? "✓ Ajouté !" : t("addBtn")}
                    </button>
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
          {allProducts.map((product) => {
            const normal = getPrice(product.priceKey, "normal");
            const sub = getPrice(product.priceKey, "subscription");
            const displayPrice = formatPrice(sub || normal);
            const strikePrice = sub && sub !== normal ? formatPrice(normal) : null;


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
                        <button className="seed-btn-primary-dark">{t("discoverBtn")}</button>
                      </Link>
                      <button
                        className="seed-btn-text-dark"
                        onClick={() => handleAddToCart(product)}
                        disabled={product.id === 6}
                        style={product.id === 6 ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                      >
                        {addedId === product.id ? "✓ Ajouté !" : product.cta}
                      </button>
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
              alt={t("journalTitle1") + " " + t("journalTitle2")}
              className="seed-journal-bg"
            />
            <div className="seed-journal-content">
              <span className="seed-journal-label">{t("journalLabel")}</span>
              <h2 className="seed-journal-title">{t("journalTitle1")}<br />{t("journalTitle2")}</h2>
              <p className="seed-journal-desc">
                {t("journalDesc")}
              </p>
              <button className="seed-journal-btn">{t("journalBtn")}</button>
            </div>
          </div>

          {/* Right: Personalized Protocols Card */}
          <div className="seed-protocols-card">
            <div className="seed-protocols-icon">✚</div>
            <h3 className="seed-protocols-title">{t("protocolsTitle1")}<br />{t("protocolsTitle2")}</h3>
            <p className="seed-protocols-desc">
              {t("protocolsDesc")}
            </p>
            <button className="seed-protocols-btn">{t("protocolsBtn")}</button>
          </div>

        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
