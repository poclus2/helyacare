"use client";

import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

interface FaqItem {
  q?: string;
  a?: string;
  question?: string;
  answer?: string;
}

interface ProductFaqProps {
  faqs: FaqItem[];
}

export default function ProductFaq({ faqs }: ProductFaqProps) {
  const [openFaq, setOpenFaq] = useState<number>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="flex flex-col">
      {faqs.map((faq, index) => (
        <div key={index} className="border-t border-white/20">
          <button 
            onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
            className="w-full flex items-center justify-between py-6 text-left group"
          >
            <span className={`text-[15px] md:text-[16px] font-bold tracking-tight pr-8 ${inter.className}`}>
              {faq.question || faq.q}
            </span>
            <span className="text-2xl font-light leading-none">
              {openFaq === index ? "−" : "+"}
            </span>
          </button>
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${openFaq === index ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"}`}>
            <p className={`text-[13px] md:text-[14px] text-white/90 leading-relaxed pr-6 ${inter.className}`}>
              {faq.answer || faq.a}
            </p>
          </div>
        </div>
      ))}
      <div className="border-t border-white/20"></div>
    </div>
  );
}
