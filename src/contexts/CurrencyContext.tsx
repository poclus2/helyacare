"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "XAF" | "EUR" | "USD" | string;

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  /** Formate un montant exprimé en XAF (devise interne) vers la devise sélectionnée */
  formatPrice: (amountInXAF: number) => string;
  isReady: boolean;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

// ─── Taux de change : tout est exprimé par rapport à 1 XAF ────────────────────
// 1 EUR ≈ 655.957 XAF  →  1 XAF ≈ 0.001525 EUR
// 1 USD ≈ 607 XAF      →  1 XAF ≈ 0.001647 USD (ajuster selon le marché)
const RATES_FROM_XAF: Record<string, number> = {
  XAF: 1,
  EUR: 1 / 655.957,
  USD: 1 / 607,
};

const CURRENCY_LOCALES: Record<string, string> = {
  XAF: "fr-FR",
  EUR: "fr-FR",
  USD: "en-US",
};

const MAX_FRACTION_DIGITS: Record<string, number> = {
  XAF: 0,
  EUR: 2,
  USD: 2,
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("XAF");
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 1. Vérifier le localStorage d'abord
    const savedCurrency = localStorage.getItem("helyacare_currency");
    if (savedCurrency && RATES_FROM_XAF[savedCurrency]) {
      setCurrencyState(savedCurrency);
      setIsReady(true);
      return;
    }

    // 2. Détection automatique par IP
    const detectCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/currency/");
        if (!response.ok) throw new Error("API call failed");
        const detectedCurrency = (await response.text()).trim().toUpperCase();

        if (detectedCurrency && detectedCurrency.length === 3 && RATES_FROM_XAF[detectedCurrency]) {
          setCurrencyState(detectedCurrency);
          localStorage.setItem("helyacare_currency", detectedCurrency);
        }
        // Si devise non gérée, on reste en XAF
      } catch {
        // Silently fail — XAF est la devise par défaut
      } finally {
        setIsReady(true);
      }
    };

    detectCurrency();
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("helyacare_currency", newCurrency);
  };

  /**
   * Convertit un montant en XAF (prix de référence interne)
   * vers la devise actuellement sélectionnée et le formate.
   */
  const formatPrice = (amountInXAF: number): string => {
    const rate = RATES_FROM_XAF[currency] ?? RATES_FROM_XAF["XAF"];
    const converted = amountInXAF * rate;
    const locale = CURRENCY_LOCALES[currency] ?? "fr-FR";
    const fractionDigits = MAX_FRACTION_DIGITS[currency] ?? 2;

    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currency,
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(converted);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice, isReady }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
