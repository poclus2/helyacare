import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import { useTranslations } from "next-intl";
import "./boutique2.css";

export const metadata: Metadata = {
  title: "Shop - Helyacare",
  description: "Shop Helyacare's molecular-grade supplements.",
};

const products = [
  {
    id: 1,
    badge: "New",
    sku: "DS-02™",
    title: "Daily Multivitamin",
    desc: "Helps cover daily nutrient gaps for your body and microbiome with 100% daily value of 21 essential vitamins and minerals.*",
    price: "$39.99",
    image: "/crave-control.png",
    cta: "Add To Cart",
  },
  {
    id: 2,
    badge: null,
    sku: null,
    title: "Daily Essentials Duo",
    desc: "Clinically validated probiotic and advanced multivitamin duo for daily health.*",
    saveBadge: "Bundle + Save 25%",
    price: (
      <>
        $67.49 <span className="seed-strikethrough">$89.99</span>
      </>
    ),
    image: "/crave-control.png",
    cta: "Add To Cart",
  },
  {
    id: 3,
    badge: "New",
    sku: "FM-02™",
    title: "Focus + Energy",
    desc: "Delivers steady, caffeine-free energy to enhance focus, sharpen attention, and help fight mental fatigue.*",
    price: "$34.99",
    image: "/crave-control.png",
    cta: "Add To Cart",
  },
  {
    id: 4,
    badge: "New",
    sku: "PM-02™",
    title: "Sleep + Restore",
    desc: "Provides non-habit forming support for deep, restorative sleep and refreshed mornings.*",
    price: "$34.99",
    image: "/crave-control.png",
    cta: "Add To Cart",
  },
  {
    id: 5,
    badge: null,
    sku: "PDS-08®",
    title: "Pediatric Synbiotic",
    desc: "Supports healthy regularity, skin, and respiratory health for kids and teens (ages 3-17) with 9 probiotic strains + a prebiotic.*",
    price: "$39.99",
    image: "/crave-control.png",
    cta: "Add To Cart",
  },
  {
    id: 6,
    badge: null,
    sku: "VS-01™",
    title: "Vaginal Synbiotic",
    desc: "Rapidly establishes a healthy vaginal microbiome dominated by L. crispatus—the vagina's most protective bacteria.*",
    price: "$99.00",
    image: "/crave-control.png",
    cta: "Join the Waitlist",
  },
];

export default function Boutique2Page() {
  const t = useTranslations("Boutique2");

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
                  <p className="seed-featured-price">49,99 €</p>
                  <div className="seed-featured-actions">
                    <button className="seed-btn-primary-white">{t("discoverBtn")}</button>
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
          {products.map((product) => (
            <div key={product.id} className="seed-card">
              {product.badge && <div className="seed-card-badge">{product.badge}</div>}
              
              <div className="seed-card-layout">
                <div className="seed-card-image-col">
                  <img src={product.image} alt={product.title} />
                </div>
                <div className="seed-card-content-col">
                  {product.sku && <span className="seed-sku-light">{product.sku}</span>}
                  <h3 className="seed-card-title">{product.title}</h3>
                  <p className="seed-card-desc">{product.desc}</p>
                  
                  {product.saveBadge && (
                    <div className="seed-save-badge">{product.saveBadge}</div>
                  )}
                  
                  <div className="seed-card-price">{product.price}</div>
                  
                  <div className="seed-card-actions">
                    <button className="seed-btn-primary-dark">Learn More</button>
                    <button className="seed-btn-text-dark">{product.cta}</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
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
