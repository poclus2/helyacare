"use client";

import { useState } from "react";
import { usePathname, useRouter, Link } from "@/navigation";
import { useTranslations, useLocale } from "next-intl";
import { useCurrency } from "@/contexts/CurrencyContext";

import { Dna, Menu, X } from "lucide-react";
import Image from "next/image";

// Geometric Logo (Official)
function GeometricLogo({ className = "", color = "white" }: { className?: string, color?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Image 
        src="/logo-white.png" 
        alt="HelyaCare Logo" 
        width={32} 
        height={32} 
        className="object-contain" 
        unoptimized
      />
    </div>
  );
}

// Cart Icon
function CartIcon({ hasItems = false }: { hasItems?: boolean }) {
  return (
    <div className="relative">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
        <line x1="3" y1="6" x2="21" y2="6"/>
        <path d="M16 10a4 4 0 01-8 0"/>
      </svg>
      {hasItems && (
        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#E56B2D] rounded-full border border-[#0F3D3E]"></span>
      )}
    </div>
  );
}

const navLinks = [
  { key: "boutique", href: "/boutique" },
  { key: "experience", href: "/experience" },
  { key: "mission", href: "/mission" },
  { key: "ambassadeur", href: "/ambassadeur" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Header");
  const { currency, setCurrency } = useCurrency();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const handleLocaleChange = (newLocale: "fr" | "en") => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <>
      <header className="w-full bg-[#0F3D3E]/85 backdrop-blur-xl border-b border-white/10 sticky top-0 z-[100]">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-[75px] md:h-[85px] flex items-center justify-between gap-6">
          
          {/* Left: Mobile Menu Toggle */}
          <div className="md:hidden flex items-center flex-1">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-white p-2 -ml-2"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Center/Left: Logo */}
          <Link href="/" className="flex flex-row items-center justify-center gap-2 flex-shrink-0 md:flex-1 md:justify-start lg:flex-none">
            <GeometricLogo color="white" />
            <span className="text-[1.2rem] md:text-[1.35rem] font-bold text-white tracking-tight leading-none">HelyaCare</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.key}
                  href={link.href}
                  className={`whitespace-nowrap text-[13px] tracking-wide uppercase font-semibold transition-colors pb-1 ${
                    isActive
                      ? "text-white border-b-2 border-[#E56B2D]"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {t(link.key)}
                </Link>
              );
            })}
          </nav>

          {/* Right side (Desktop & Mobile) */}
          <div className="flex items-center justify-end gap-4 flex-1">
            
            {/* Desktop Only: Language & Currency */}
            <div className="hidden lg:flex items-center gap-4">
              <div className="flex items-center gap-1 text-[13px] border-r border-white/20 pr-4">
                <button
                  onClick={() => handleLocaleChange("fr")}
                  className={`font-semibold transition-colors ${locale === "fr" ? "text-white" : "text-white/50 hover:text-white/80"}`}
                >
                  FR
                </button>
                <span className="text-white/30">/</span>
                <button
                  onClick={() => handleLocaleChange("en")}
                  className={`font-semibold transition-colors ${locale === "en" ? "text-white" : "text-white/50 hover:text-white/80"}`}
                >
                  EN
                </button>
              </div>

              <select 
                value={currency} 
                onChange={(e) => setCurrency(e.target.value)}
                className="text-[13px] font-semibold bg-transparent border-none text-white cursor-pointer outline-none hover:opacity-80 transition-opacity"
              >
                <option value="EUR" className="text-black">€ EUR</option>
                <option value="XAF" className="text-black">FCFA</option>
                <option value="USD" className="text-black">$ USD</option>
              </select>
            </div>

            {/* Desktop Only: CTA */}
            <Link
              href="/connexion"
              className="hidden lg:block bg-white text-[#0F3D3E] text-[13px] font-bold px-5 py-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              {t("login")}
            </Link>

            {/* Cart (Desktop & Mobile) */}
            <button className="p-2 hover:opacity-80 transition-opacity -mr-2 md:mr-0">
              <CartIcon hasItems={true} /> {/* Simulation panier plein */}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Drawer */}
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Drawer */}
      <div className={`fixed inset-y-0 left-0 w-[85vw] max-w-[400px] bg-[#0F3D3E] z-[120] transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex flex-col items-start">
            <span className="text-xl font-bold text-white tracking-tight leading-none mb-1">HelyaCare</span>
            <GeometricLogo color="white" className="items-start" />
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="text-white/70 hover:text-white p-2">
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex flex-col p-6 gap-6 overflow-y-auto">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white text-lg font-medium"
            >
              {t(link.key)}
            </Link>
          ))}
          
          <div className="h-px w-full bg-white/10 my-4" />
          
          <Link
            href="/connexion"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-white text-lg font-medium flex items-center justify-between"
          >
            {t("login")}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
          </Link>

          <div className="mt-8 flex items-center justify-between text-white/80">
            <span className="text-sm font-medium">Langue</span>
            <div className="flex gap-4 text-sm font-bold">
              <button onClick={() => {handleLocaleChange("fr"); setIsMobileMenuOpen(false);}} className={locale === "fr" ? "text-white" : "text-white/50"}>FR</button>
              <button onClick={() => {handleLocaleChange("en"); setIsMobileMenuOpen(false);}} className={locale === "en" ? "text-white" : "text-white/50"}>EN</button>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-between text-white/80">
            <span className="text-sm font-medium">Devise</span>
            <select 
              value={currency} 
              onChange={(e) => {setCurrency(e.target.value); setIsMobileMenuOpen(false);}}
              className="bg-transparent text-white font-bold outline-none text-right"
            >
              <option value="EUR" className="text-black">EUR</option>
              <option value="XAF" className="text-black">FCFA</option>
              <option value="USD" className="text-black">USD</option>
            </select>
          </div>
        </nav>
      </div>
    </>
  );
}
