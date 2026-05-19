"use client";

import { useState } from "react";
import { Inter } from "next/font/google";
import { ArrowRight } from "lucide-react";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface ProductAccordionsProps {
  benefits: string[];
}

export default function ProductAccordions({ benefits }: ProductAccordionsProps) {
  const [openSection, setOpenSection] = useState<string | null>("benefits");

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <div className="space-y-0">
      {/* Benefits Accordion */}
      <div className="py-4 border-b border-gray-200">
        <button 
          onClick={() => toggleSection("benefits")}
          className="w-full flex items-center justify-between font-semibold text-[15px] text-gray-900 mb-4"
        >
          Bienfaits*
          <span className="text-xl leading-none font-light">{openSection === "benefits" ? "-" : "+"}</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === "benefits" ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"}`}>
          {benefits && benefits.length > 0 ? (
            <ul className="space-y-3 mb-6 pl-5 list-disc marker:text-gray-400">
              {benefits.map((b, i) => (
                <li key={i} className={`text-[14px] text-gray-900 pl-1 ${inter.className}`}>{b}</li>
              ))}
            </ul>
          ) : (
            <p className={`text-[14px] text-gray-500 mb-6 ${inter.className}`}>Aucun bienfait renseigné.</p>
          )}
          <a href="#" className={`inline-flex items-center text-[13px] font-bold text-[#1B3624] hover:underline underline-offset-4 decoration-1 ${inter.className}`}>
            Voir les Études Cliniques <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </a>
        </div>
      </div>

      {/* Ingredients Accordion (Closed by default) */}
      <div className="py-5 border-b border-gray-200">
        <button 
          onClick={() => toggleSection("ingredients")}
          className="w-full flex items-center justify-between font-semibold text-[15px] text-gray-900"
        >
          Ingrédients
          <span className="text-xl leading-none font-light">{openSection === "ingredients" ? "-" : "+"}</span>
        </button>
        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openSection === "ingredients" ? "max-h-[800px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
           <p className={`text-[14px] text-gray-500 ${inter.className}`}>Voir la section Transparence Clinique ci-dessous pour le détail complet.</p>
        </div>
      </div>
    </div>
  );
}
