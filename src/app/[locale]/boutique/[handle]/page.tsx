import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import { Star, Flower2, Pill, Dna, Microscope } from "lucide-react";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductBuyBox from "@/components/product/ProductBuyBox";
import ProductAccordions from "@/components/product/ProductAccordions";
import ProductFaq from "@/components/product/ProductFaq";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

// Helper for dynamic icons mapping
const IconMap: Record<string, any> = {
  Flower2: Flower2,
  Pill: Pill,
  Dna: Dna,
  Microscope: Microscope
};

async function getProductByHandle(handle: string) {
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

  if (!backendUrl) return null;

  try {
    const fields = ["id", "handle", "title", "description", "thumbnail", "status", "metadata", "*variants.prices"].join(",");
    const res = await fetch(
      `${backendUrl}/store/products?handle=${handle}&fields=${encodeURIComponent(fields)}`,
      {
        headers: { ...(publishableKey && { "x-publishable-api-key": publishableKey }) },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return null;
    
    const data = await res.json();
    const p = data.products?.[0];
    if (!p) return null;

    const variant = p.variants?.[0];
    const xofPrice = (variant?.prices || []).find((price: any) => price.currency_code === "xof") || variant?.prices?.[0];
    const amount = xofPrice ? Number(xofPrice.amount) : 0;

    return {
      id: p.id,
      priceKey: p.handle,
      badge: p.metadata?.badge || "Nouveau",
      sku: p.metadata?.sku_label || p.metadata?.sku || "Produit",
      title: p.title,
      desc: p.description,
      image: p.thumbnail || "/placeholder.png",
      price_normal: amount,
      price_subscription: p.metadata?.subscription_price ? Number(p.metadata.subscription_price) : Math.round(amount * 0.85),
      
      rating: p.metadata?.rating || 4.8,
      reviews_count: p.metadata?.reviews_count || 120,
      benefits: p.metadata?.benefits || [],
      ingredients: p.metadata?.ingredients || [],
      testimonials: p.metadata?.testimonials || [],
      faqs: p.metadata?.faqs || [],
      cross_sell_handle: p.metadata?.cross_sell_handle || null,
      cross_sell_text: p.metadata?.cross_sell_text || "Ajoutez ce produit à votre routine et économisez.",
    };
  } catch (e) {
    console.error("Error fetching product by handle:", e);
    return null;
  }
}

export async function generateMetadata(
  props: { params: Promise<{ handle: string }> }
): Promise<Metadata> {
  const params = await props.params;
  const product = await getProductByHandle(params.handle);
  if (!product) return { title: "Produit Introuvable - HelyaCare" };
  
  return {
    title: `${product.title} - HelyaCare`,
    description: product.desc,
  };
}

export default async function DynamicProductPage(
  props: { params: Promise<{ handle: string }> }
) {
  const params = await props.params;
  const product = await getProductByHandle(params.handle);

  if (!product) {
    notFound();
  }

  // Placeholder images si non fournies
  const images = [
    { id: 1, src: `/images/products/${product.priceKey}/lifestyle.png`, alt: `${product.title} Lifestyle` },
    { id: 2, src: `/images/products/${product.priceKey}/macro.png`, alt: `${product.title} Macro` },
    { id: 3, src: `/images/products/${product.priceKey}/ecosystem.png`, alt: `HelyaCare Eco-System` },
    { id: 4, src: `/images/products/${product.priceKey}/ingredients.png`, alt: `${product.title} Ingredients` },
  ];

  return (
    <>
      <Header />
      <main className="bg-[#FAF9F7] min-h-screen selection:bg-[#1B3624] selection:text-white">
        
        {/* 1. HERO HEADER */}
        <section className="max-w-[1440px] mx-auto px-4 md:px-8 pt-8 md:pt-16 pb-16 md:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative">
            
            {/* Colonne Gauche : Galerie Grid */}
            <div className="lg:col-span-7">
              {/* Mobile Slider */}
              <div className="lg:hidden flex overflow-x-auto snap-x snap-mandatory gap-3 pb-4 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {images.map((img) => (
                  <div key={`mobile-${img.id}`} className="relative w-[85vw] aspect-[4/3] shrink-0 snap-start bg-[#1B3624] rounded-2xl overflow-hidden shadow-sm">
                    <Image src={img.src} alt={img.alt} fill className="object-cover" priority={img.id === 1} sizes="85vw" />
                  </div>
                ))}
              </div>

              {/* Desktop Masonry/Grid */}
              <div className="hidden lg:grid grid-cols-2 gap-4">
                <div className="col-span-2 relative w-full aspect-[16/10] bg-[#1B3624] rounded-[20px] overflow-hidden">
                  <Image src={images[0].src} alt={images[0].alt} fill className="object-cover" priority sizes="60vw" />
                </div>
                <div className="relative w-full aspect-[4/3] bg-[#1B3624] rounded-[20px] overflow-hidden">
                  <Image src={images[1].src} alt={images[1].alt} fill className="object-cover" sizes="30vw" />
                </div>
                <div className="relative w-full aspect-[4/3] bg-[#E8E3DC] rounded-[20px] overflow-hidden">
                  <Image src={images[2].src} alt={images[2].alt} fill className="object-cover" sizes="30vw" />
                </div>
                <div className="col-span-2 relative w-full aspect-[16/7] bg-[#1B3624] rounded-[20px] overflow-hidden mt-2">
                  <Image src={images[3].src} alt={images[3].alt} fill className="object-cover" sizes="60vw" />
                </div>
              </div>
            </div>

            {/* Colonne Droite : Sticky Buy Box */}
            <div className="lg:col-span-5">
              <div className="lg:sticky top-24 pt-2 lg:pt-0 max-w-[460px]">
                
                {/* Badge + Title */}
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2.5 py-0.5 border border-gray-300 text-gray-800 text-[11px] font-bold uppercase rounded-full tracking-wide ${inter.className}`}>
                    {product.badge}
                  </span>
                  <h1 className={`text-3xl md:text-[34px] font-medium text-gray-900 tracking-tight ${inter.className}`}>
                    {product.title}
                  </h1>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-6">
                  <span className="text-sm font-medium text-gray-900">{product.rating}</span>
                  <div className="flex items-center text-gray-900">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating) ? "fill-current" : "fill-transparent"}`} />
                    ))}
                  </div>
                  <a href="#avis" className="text-[13px] font-medium text-gray-900 underline underline-offset-4 decoration-1 hover:text-gray-600 transition-colors">
                    {product.reviews_count} Avis
                  </a>
                </div>
                
                {/* Description */}
                <p className={`text-[15px] text-gray-900 mb-6 leading-relaxed ${inter.className}`}>
                  {product.desc}
                </p>

                {/* Client Component for Purchase options & Add to cart */}
                <ProductBuyBox 
                  productKey={product.priceKey}
                  title={product.title}
                  thumbnail={product.image}
                  priceNormal={product.price_normal}
                  priceSubscription={product.price_subscription}
                />

                {/* Guarantees */}
                <p className={`text-xs text-gray-500 text-center mb-10 pb-8 border-b border-gray-200 ${inter.className}`}>
                  Garantie sans risque 30 jours. Livraison gratuite.
                </p>

                {/* Accordions (Bienfaits & Ingrédients) */}
                <ProductAccordions benefits={product.benefits} />

                {/* Cross-sell Box */}
                {product.cross_sell_handle && (
                  <div className="mt-8 bg-[#F6F5F2] p-4 rounded-[20px] flex gap-4 items-center">
                    <div className="w-16 h-16 bg-[#1B3624] rounded-lg flex items-center justify-center shrink-0 overflow-hidden relative">
                      {/* Image du cross-sell (placeholder en attendant une vraie image) */}
                      <Image src={`/images/products/${product.cross_sell_handle}/lifestyle.png`} alt="Bundle" fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-[14px] font-semibold text-gray-900 mb-1 ${inter.className}`}>Pack Complémentaire</h4>
                      <p className={`text-[12px] text-gray-800 mb-3 leading-snug ${inter.className}`}>
                        {product.cross_sell_text}
                      </p>
                      <button className={`px-4 py-1.5 bg-transparent border border-gray-900 text-gray-900 text-[13px] font-semibold rounded-[6px] hover:bg-gray-100 transition-colors ${inter.className}`}>
                        Ajouter
                      </button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* 2. TRANSPARENCE CLINIQUE */}
        <section className="w-full relative min-h-[700px] md:min-h-[800px] flex flex-col justify-between overflow-hidden">
          <Image 
            src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=2000&auto=format&fit=crop"
            alt={`${product.title} Clinical Transparency`}
            fill
            className="object-cover"
            sizes="100vw"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/10" />

          <div className="relative z-10 pt-20 md:pt-32 px-6 md:px-12 lg:px-24 max-w-5xl">
            <h2 className={`text-4xl md:text-5xl lg:text-[56px] font-medium text-white tracking-tight leading-[1.1] drop-shadow-md ${inter.className}`}>
              Sentez la différence avec<br className="hidden md:block"/> une formule cliniquement prouvée.
            </h2>
          </div>

          <div className="relative z-10 mt-auto px-4 md:px-8 pb-8 md:pb-12 pt-32">
            <div className="bg-[#434638] rounded-[24px] p-10 md:p-14 w-full max-w-[1440px] mx-auto shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
                
                {product.ingredients && product.ingredients.length > 0 ? (
                  product.ingredients.map((ing: any, idx: number) => {
                    const IconComponent = IconMap[ing.icon] || Flower2;
                    return (
                      <div key={idx} className="flex flex-col text-white">
                        <div className="mb-6">
                          <IconComponent className="w-8 h-8 text-white stroke-[1.5]" />
                        </div>
                        <h3 className={`text-[17px] font-semibold mb-3 ${inter.className}`}>{ing.title}</h3>
                        <p className={`text-white/80 text-[13px] leading-[1.6] ${inter.className}`}>
                          {ing.description}
                        </p>
                      </div>
                    )
                  })
                ) : (
                  <p className="text-white">Détails des ingrédients à venir.</p>
                )}

              </div>
            </div>
          </div>
        </section>

        {/* 3. TESTIMONIALS */}
        {product.testimonials && product.testimonials.length > 0 && (
          <section id="avis" className="bg-[#FAF9F7] py-20 md:py-32 px-6 md:px-8 max-w-[1440px] mx-auto border-t border-gray-200 mt-16 md:mt-24">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-4xl">
                <h2 className={`text-4xl md:text-[44px] lg:text-[52px] font-medium text-gray-900 tracking-tight leading-[1.1] mb-6 ${inter.className}`}>
                  De vraies personnes, de vrais résultats : ce que nos client·e·s en disent*
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-16">
              {product.testimonials.map((testi: any, idx: number) => (
                <div key={idx} className="flex flex-col gap-5">
                  <div className="relative w-full aspect-[4/3] sm:aspect-square rounded-[1rem] overflow-hidden bg-gray-200">
                    <Image src={testi.image || `/images/products/${product.priceKey}/lifestyle.png`} alt={testi.name} fill className="object-cover" sizes="(max-width: 1024px) 50vw, 25vw" />
                  </div>
                  <div>
                    <p className={`text-[14px] text-gray-500 font-medium mb-3 ${inter.className}`}>— {testi.name}</p>
                    <p className={`text-[16px] text-gray-900 leading-relaxed font-medium ${inter.className}`}>
                      « {testi.quote} »
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 4. FAQs */}
        <section className="flex flex-col md:flex-row bg-[#0F3D3E] text-white">
          <div className="w-full md:w-[55%] lg:w-[50%] p-10 md:p-16 lg:p-24 xl:px-32 flex flex-col justify-center">
            <h2 className={`text-4xl md:text-5xl lg:text-6xl font-light mb-12 tracking-wide ${inter.className}`}>
              FAQs
            </h2>
            <ProductFaq faqs={product.faqs} />
          </div>

          <div className="w-full md:w-[45%] lg:w-[50%] relative min-h-[500px] md:min-h-auto bg-[#E8E3DC]">
            <Image 
              src={`/images/products/${product.priceKey}/ecosystem.png`}
              alt={`HelyaCare ${product.title} FAQ`}
              fill 
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
