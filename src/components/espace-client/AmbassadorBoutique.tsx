"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useLivePrices } from "@/contexts/PricesContext";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import "@/app/[locale]/boutique/boutique.css"; // Reuse shop styles

const products = [
  {
    id: 1,
    priceKey: "crave-control" as const,
    badge: "Populaire",
    sku: "CC-01™",
    title: "Crave Control",
    desc: "Un bouclier neuro-métabolique qui régule l'appétit, aide à limiter les fringales et soutient le métabolisme au quotidien.",
    image: "/crave-control.png",
    cta: "Acheter le lot",
    href: "/boutique/crave-control",
  },
  {
    id: 2,
    priceKey: "pack-bien-etre" as const,
    title: "Pack Bien-Être Essentiel",
    desc: "Duo quotidien validé cliniquement associant Crave Control et Helya Hydrate pour une santé optimale au quotidien.",
    image: "/crave-control.png",
    cta: "Acheter le lot",
    href: "/boutique/pack-bien-etre",
  },
  {
    id: 3,
    priceKey: "apple-satiety-shot" as const,
    sku: "AS-02™",
    title: "Apple Satiety Shot",
    desc: "Shot de satiété formulé avec des extraits de pomme et de plantes adaptogènes pour couper les envies entre les repas.",
    image: "/crave-control.png",
    cta: "Acheter le lot",
    href: "/boutique/apple-satiety-shot",
  },
  {
    id: 4,
    priceKey: "helya-hydrate" as const,
    sku: "HH-03™",
    title: "Helya Hydrate",
    desc: "Électrolytes premium enrichis en minéraux essentiels pour une hydratation cellulaire optimale et une récupération accélérée.",
    image: "/crave-control.png",
    cta: "Acheter le lot",
    href: "/boutique/helya-hydrate",
  },
  {
    id: 5,
    priceKey: "helya-vigor" as const,
    sku: "HV-04™",
    title: "Helya Vigor",
    desc: "Formule vitalité et énergie à base de plantes et de vitamines B pour soutenir l'endurance physique et mentale.",
    image: "/crave-control.png",
    cta: "Acheter le lot",
    href: "/boutique/helya-vigor",
  },
];

export default function AmbassadorBoutique() {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const { getPrice, getVariantId } = useLivePrices();
  const [addedId, setAddedId] = useState<string | number | null>(null);
  const [minQty, setMinQty] = useState(5);
  const [customPrices, setCustomPrices] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings/ambassador")
      .then(res => res.json())
      .then(data => {
        if (data.ambassador_settings) {
          setMinQty(data.ambassador_settings.min_qty || 5);
          setCustomPrices(data.ambassador_settings.prices || {});
        }
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product: any) => {
    const overridePrice = customPrices[product.priceKey];
    const originalPrice = getPrice(product.priceKey, "normal");
    const price = overridePrice > 0 ? overridePrice : originalPrice;

    await addItem({
      variantId: getVariantId(product.priceKey) || `${product.priceKey}-v1`,
      quantity: minQty,
      title: product.title,
      subtitle: `Achat Revendeur (Lot de ${minQty})`,
      thumbnail: product.image,
      unit_price: price,
      currency_code: "XOF",
    });
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#CBF27A] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="seed-page bg-transparent pt-0 pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0F3D3E] mb-2">Boutique Ambassadeur</h2>
        <p className="text-gray-600">
          En tant qu'ambassadeur, vous bénéficiez de tarifs préférentiels. Un minimum de <strong>{minQty} unités</strong> par produit est requis pour valider votre commande de réassort.
        </p>
      </div>

      <section className="seed-grid-section pt-0">
        <div className="seed-grid-container px-0 max-w-full">
          {products.map((product) => {
            const overridePrice = customPrices[product.priceKey];
            const originalPrice = getPrice(product.priceKey, "normal");
            const price = overridePrice > 0 ? overridePrice : originalPrice;
            const displayPrice = formatPrice(price);

            return (
              <div key={product.id} className="seed-card border border-[#E8E3DC] shadow-sm hover:shadow-md">
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

                    <div className="mt-4 bg-[#0F3D3E]/5 border border-[#0F3D3E]/10 rounded-lg p-3">
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Prix Ambassadeur</p>
                      <div className="seed-card-price mb-0 text-[#0F3D3E]">
                        {displayPrice} <span className="text-sm font-normal text-gray-500">/ unité</span>
                      </div>
                      <p className="text-[11px] text-[#E56B2D] font-medium mt-1">
                        Achat par lot de {minQty} min. ({formatPrice(price * minQty)})
                      </p>
                    </div>

                    <div className="seed-card-actions mt-5">
                      <button
                        className="seed-btn-text-dark w-full text-center flex justify-center bg-[#0F3D3E] text-white hover:bg-[#1a5556]"
                        onClick={() => handleAddToCart(product)}
                      >
                        {addedId === product.id ? "✓ Ajouté au panier !" : `Ajouter un lot de ${minQty}`}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
