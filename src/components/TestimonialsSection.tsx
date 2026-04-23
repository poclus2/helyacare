"use client";

export default function TestimonialsSection() {
  const testimonials = [
    {
      id: 1,
      name: "Aminata Sall",
      role: "Entrepreneure",
      content: "Helyacare a complètement changé ma routine matinale. Avec Crave Control, je ressens une énergie constante tout au long de la journée, sans les coups de fatigue habituels de l'après-midi. Une vraie révolution pour ma productivité.",
      rating: 5,
    },
    {
      id: 2,
      name: "Dr. Kossi M.",
      role: "Nutritionniste",
      content: "Je recommande les formules Helyacare à mes patients. L'approche scientifique stricte, l'utilisation d'ingrédients tracés et les dosages cliniques précis correspondent exactement à ce dont notre marché avait besoin.",
      rating: 5,
    },
    {
      id: 3,
      name: "Sarah T.",
      role: "Athlète Amateure",
      content: "Helya Vigor et Hydrate sont devenus mes alliés indispensables. La différence de récupération musculaire et de maintien de l'hydratation est tout simplement bluffante. Le goût est aussi très subtil.",
      rating: 5,
    },
  ];

  return (
    <section className="w-full bg-white py-16 md:py-24 px-4 md:px-8 overflow-hidden">
      <div className="max-w-[1280px] mx-auto">
        <div className="flex flex-col items-center text-center mb-10 md:mb-16">
          <span className="text-[10px] md:text-[0.65rem] font-bold tracking-[0.2em] uppercase text-[#3CA0A0] mb-3 px-3 py-1 bg-[#3CA0A0]/10 rounded-full">
            Témoignages
          </span>
          <h2 className="text-3xl md:text-[2.6rem] font-extrabold text-[#0F3D3E] tracking-tight leading-tight mb-3 md:mb-4 mt-2">
            La communauté en parle.
          </h2>
          <p className="text-[#0F3D3E]/60 text-[15px] md:text-[0.95rem] max-w-[500px] mx-auto leading-relaxed">
            Découvrez comment intégrer nos formules peut marquer un tournant dans votre quête de vitalité et d&apos;équilibre.
          </p>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 md:grid md:grid-cols-3 md:gap-6 pb-6 md:pb-0 hide-scrollbar md:overflow-visible">
          {testimonials.map((test) => (
            <div
              key={test.id}
              className="bg-[#F6F4F1] rounded-2xl p-6 md:p-8 flex flex-col justify-between transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_40px_-15px_rgba(15,61,62,0.15)] shrink-0 snap-center w-[300px] md:w-auto"
            >
              <div>
                <div className="flex gap-1 mb-5 md:mb-6">
                  {[...Array(test.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-4 h-4 text-[#E56B2D]"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-[#0F3D3E] text-[15px] md:text-[0.95rem] leading-relaxed mb-8 italic">
                  &quot;{test.content}&quot;
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#0F3D3E]/10 flex items-center justify-center font-bold text-[#0F3D3E] text-sm shrink-0">
                  {test.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-[#0F3D3E] text-[15px] md:text-sm">{test.name}</h4>
                  <p className="text-[#0F3D3E]/60 text-xs mt-0.5">{test.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
