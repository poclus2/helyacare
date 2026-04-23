"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Currency = "XAF" | "EUR" | "USD" | string;

interface CurrencyContextProps {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (amountInEur: number) => string;
  isReady: boolean;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [isReady, setIsReady] = useState(false);

  // Exchange rates for demonstration (In production, use dynamic API)
  const EXCHANGE_RATES: Record<string, number> = {
    EUR: 1,
    XAF: 655.957,
    USD: 1.08,
  };

  useEffect(() => {
    // Check local storage first
    const savedCurrency = localStorage.getItem("helyacare_currency");
    if (savedCurrency) {
      setCurrencyState(savedCurrency);
      setIsReady(true);
      return;
    }

    // Auto-detect currency based on IP
    const detectCurrency = async () => {
      try {
        const response = await fetch("https://ipapi.co/currency/");
        if (!response.ok) throw new Error("API call failed");
        const detectedCurrency = await response.text();
        
        if (detectedCurrency && detectedCurrency.length === 3) {
          setCurrencyState(detectedCurrency.toUpperCase());
          localStorage.setItem("helyacare_currency", detectedCurrency.toUpperCase());
        }
      } catch (error) {
        console.error("Failed to detect currency:", error);
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

  const formatPrice = (amountInEur: number) => {
    const rate = EXCHANGE_RATES[currency] || 1; // Fallback rate 
    const converted = amountInEur * rate;

    return new Intl.NumberFormat(currency === "XAF" ? "fr-FR" : "en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: currency === "XAF" ? 0 : 2,
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
