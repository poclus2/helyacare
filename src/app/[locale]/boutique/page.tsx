"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLivePrices } from "@/contexts/PricesContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import "./boutique.css";

export default function BoutiquePage() {
  const t = useTranslations("Boutique2");
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { getPrice, getVariantId } = useLivePrices();
  const [addedId, setAddedId] = useState<string | number | null>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, []);

  const handleAddToCart = async (product: any) => {
    // Si pas de variante, on empêche l'ajout
    if (!product.variant_id && !getVariantId(product.priceKey)) return;

    // Pour l'instant, "Helya Perform" était grisé. S'il n'est pas dispo en stock, on pourrait bloquer.
    // On simule le blocage si cta === "Rejoindre la liste d'attente"
    if (product.cta === "Rejoindre la liste d'attente") return;

    const normal = getPrice(product.priceKey, "normal") || product.price_normal;
    const sub = getPrice(product.priceKey, "subscription") || product.price_subscription;
    const price = sub || normal;

    await addItem({
      variantId: getVariantId(product.priceKey) || product.variant_id || `${product.priceKey}-v1`,
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

  if (loading) {
    return (
      <div className="seed-page">
        <Header />
        <div className="flex flex-col items-center justify-center py-48 text-white">
          <Loader2 className="w-12 h-12 text-[#CBF27A] animate-spin mb-4" />
          <p className="font-bold">Chargement du catalogue...</p>
        </div>
        <Footer />
      </div>
    );
  }

  // S'il n'y a aucun produit
  if (products.length === 0) {
    return (
      <div className="seed-page">
        <Header />
        <div className="flex flex-col items-center justify-center py-48 text-white">
          <p className="font-bold text-xl">Aucun produit disponible pour le moment.</p>
        </div>
        <Footer />
      </div>
    );
  }

  // On trouve le produit vedette (ex: crave-control ou le premier de la liste)
  const featuredProduct = products.find(p => p.priceKey === "crave-control") || products[0];
  const allProducts = products.filter(p => p.id !== featuredProduct.id);

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
              <div className="seed-badge-featured">{featuredProduct.badge || t("featuredBadge")}</div>
              <div className="seed-featured-layout">
                <div className="seed-featured-img-wrap">
                  <img src={featuredProduct.image} alt={featuredProduct.title} />
                </div>
                <div className="seed-featured-details">
                  <span className="seed-sku-pill">{featuredProduct.sku || t("featuredCategory")}</span>
                  <h2 className="seed-featured-title">{featuredProduct.title}</h2>
                  <p className="seed-featured-desc">
                    {featuredProduct.desc}
                  </p>
                  <p className="seed-featured-price">
                    {formatPrice(getPrice(featuredProduct.priceKey, "normal") || featuredProduct.price_normal)}
                  </p>
                  <div className="seed-featured-actions">
                    <Link href={`/boutique/${featuredProduct.priceKey}`}>
                      <button className="seed-btn-primary-white">{t("discoverBtn")}</button>
                    </Link>
                    <button
                      className="seed-btn-text-white"
                      onClick={() => handleAddToCart(featuredProduct)}
                    >
                      {addedId === featuredProduct.id ? "✓ Ajouté !" : t("addBtn")}
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
            const normal = getPrice(product.priceKey, "normal") || product.price_normal;
            const sub = getPrice(product.priceKey, "subscription") || product.price_subscription;
            const displayPrice = formatPrice(normal);
            const subPriceStr = sub && sub !== normal ? formatPrice(sub) : null;
            
            const isWaitlist = product.cta === "Rejoindre la liste d'attente" || product.status === "draft";

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
                      {subPriceStr && (
                        <span className="ml-2 text-[0.8em] text-[#CBF27A]">
                          ou {subPriceStr} en abonnement
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
                        disabled={isWaitlist}
                        style={isWaitlist ? { opacity: 0.5, cursor: "not-allowed" } : {}}
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
