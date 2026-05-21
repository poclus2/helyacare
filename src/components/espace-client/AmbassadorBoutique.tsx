"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useCart } from "@/contexts/CartContext";
import { useState, useEffect } from "react";
import "@/app/[locale]/boutique/boutique.css"; // Reuse shop styles

export default function AmbassadorBoutique() {
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const [addedId, setAddedId] = useState<string | number | null>(null);
  
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        // Ne garder que les produits publiés avec un prix ambassadeur > 0
        const ambassadorProducts = (data.products || []).filter(
          (p: any) => p.status === "published" && p.ambassador_price > 0
        );
        setProducts(ambassadorProducts);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleAddToCart = async (product: any) => {
    const minQty = product.ambassador_min_qty || 5;
    const overridePrice = product.ambassador_price || product.price_normal;
    const variantId = product.variants?.[0]?.id || `${product.handle}-v1`;

    await addItem({
      variantId: variantId,
      quantity: minQty,
      title: product.title,
      subtitle: `Achat Revendeur (Lot de ${minQty})`,
      thumbnail: product.thumbnail || product.images?.[0] || "",
      unit_price: overridePrice,
      currency_code: "XOF",
      bonus_points: product.ambassador_bonus_points || 0,
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

  if (products.length === 0) {
    return (
      <div className="seed-page bg-transparent pt-0 pb-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#0F3D3E] mb-2">Boutique Ambassadeur</h2>
          <p className="text-gray-600">
            Aucun produit n'est actuellement disponible au tarif ambassadeur.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="seed-page bg-transparent pt-0 pb-10">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0F3D3E] mb-2">Boutique Ambassadeur</h2>
        <p className="text-gray-600">
          En tant qu'ambassadeur, vous bénéficiez de tarifs préférentiels avec des quantités minimum par lot définies pour chaque produit.
        </p>
      </div>

      <section className="seed-grid-section pt-0">
        <div className="seed-grid-container px-0 max-w-full">
          {products.map((product) => {
            const overridePrice = product.ambassador_price || product.price_normal;
            const minQty = product.ambassador_min_qty || 5;
            const bonusPoints = product.ambassador_bonus_points || 0;
            const displayPrice = formatPrice(overridePrice);

            return (
              <div key={product.id} className="seed-card border border-[#E8E3DC] shadow-sm hover:shadow-md">
                {product.badge && <div className="seed-card-badge">{product.badge}</div>}

                <div className="seed-card-layout">
                  <div className="seed-card-image-col">
                    <Link href={`/boutique/${product.handle}`}>
                      <img 
                        src={product.thumbnail || product.images?.[0] || "/placeholder.png"} 
                        alt={product.title} 
                        className="cursor-pointer hover:scale-105 transition-transform duration-500 w-full h-auto object-cover" 
                      />
                    </Link>
                  </div>
                  <div className="seed-card-content-col">
                    {product.sku_label && <span className="seed-sku-light">{product.sku_label}</span>}
                    <h3 className="seed-card-title">{product.title}</h3>
                    <p className="seed-card-desc">{product.description}</p>

                    <div className="mt-4 bg-[#0F3D3E]/5 border border-[#0F3D3E]/10 rounded-lg p-3 relative overflow-hidden">
                      {bonusPoints > 0 && (
                        <div className="absolute top-0 right-0 bg-[#CBF27A] text-[#0F3D3E] text-[10px] font-bold px-2 py-1 rounded-bl-lg">
                          +{bonusPoints} PV
                        </div>
                      )}
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Prix Ambassadeur</p>
                      <div className="seed-card-price mb-0 text-[#0F3D3E]">
                        {displayPrice} <span className="text-sm font-normal text-gray-500">/ unité</span>
                      </div>
                      <p className="text-[11px] text-[#E56B2D] font-medium mt-1">
                        Achat par lot de {minQty} min. ({formatPrice(overridePrice * minQty)})
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
