"use client";

import { useState, useEffect, createContext, useContext, useCallback } from "react";

export interface PriceEntry {
  normal: number;
  subscription: number;
  variant_id?: string;
}

interface PricesContextValue {
  prices: Record<string, PriceEntry>;
  loading: boolean;
  source: "medusa" | "static" | "static_fallback" | null;
  reload: () => void;
  getPrice: (handle: string, type?: "normal" | "subscription") => number;
  getVariantId: (handle: string) => string | undefined;
}

// ── Fallback statique (rendu SSR / avant chargement) ──────────────────────
const STATIC_FALLBACK: Record<string, PriceEntry> = {
  "crave-control":      { normal: 20_000, subscription: 17_000 },
  "apple-satiety-shot": { normal: 20_000, subscription: 17_000 },
  "helya-hydrate":      { normal: 20_000, subscription: 17_000 },
  "helya-vigor":        { normal: 20_000, subscription: 17_000 },
  "helya-perform":      { normal: 20_000, subscription: 17_000 },
  "pack-bien-etre":     { normal: 35_000, subscription: 28_000 },
};

const PricesContext = createContext<PricesContextValue>({
  prices: STATIC_FALLBACK,
  loading: true,
  source: null,
  reload: () => {},
  getPrice: (handle, type = "normal") => STATIC_FALLBACK[handle]?.[type] ?? 0,
  getVariantId: () => undefined,
});

export function PricesProvider({ children }: { children: React.ReactNode }) {
  const [prices, setPrices] = useState<Record<string, PriceEntry>>(STATIC_FALLBACK);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState<PricesContextValue["source"]>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/prices", { next: { revalidate: 60 } } as any);
      if (res.ok) {
        const data = await res.json();
        setPrices(data.prices || STATIC_FALLBACK);
        setSource(data.source);
      }
    } catch {
      // Garder les prix statiques en cas d'erreur réseau
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const getPrice = useCallback(
    (handle: string, type: "normal" | "subscription" = "normal"): number =>
      prices[handle]?.[type] ?? STATIC_FALLBACK[handle]?.[type] ?? 0,
    [prices]
  );

  const getVariantId = useCallback(
    (handle: string): string | undefined => prices[handle]?.variant_id,
    [prices]
  );

  return (
    <PricesContext.Provider value={{ prices, loading, source, reload: load, getPrice, getVariantId }}>
      {children}
    </PricesContext.Provider>
  );
}

/** Hook principal — utiliser dans tous les composants qui affichent des prix */
export function useLivePrices() {
  return useContext(PricesContext);
}

/** Hook simplifié pour un seul produit */
export function useProductPrice(handle: string) {
  const { getPrice, getVariantId, loading } = useLivePrices();
  return {
    normal: getPrice(handle, "normal"),
    subscription: getPrice(handle, "subscription"),
    variantId: getVariantId(handle),
    loading,
  };
}
