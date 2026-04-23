/**
 * Catalogue de prix centralisé — tous les montants sont en XAF (devise de référence interne).
 * Pour ajouter un produit, ajoutez une entrée ici. Tous les composants s'y réfèrent.
 */
export const PRODUCT_PRICES = {
  // Produits individuels
  "crave-control": {
    normal: 20_000,       // Achat unique
    subscription: 17_000, // Abonnement mensuel (-15%)
  },
  "apple-satiety-shot": {
    normal: 20_000,
    subscription: 17_000,
  },
  "helya-hydrate": {
    normal: 20_000,
    subscription: 17_000,
  },
  "helya-vigor": {
    normal: 20_000,
    subscription: 17_000,
  },
  "helya-perform": {
    normal: 20_000,
    subscription: 17_000,
  },
  // Pack
  "pack-bien-etre": {
    normal: 35_000,
    subscription: 28_000, // ~20% de réduction sur le pack
  },
} as const;

export type ProductKey = keyof typeof PRODUCT_PRICES;

/** Prix de la boutique (page listing) */
export const BOUTIQUE_PRICES: Record<string, { normal: number; subscription?: number }> = {
  "crave-control":       { normal: 20_000, subscription: 17_000 },
  "pack-bien-etre":      { normal: 35_000, subscription: 28_000 },
  "apple-satiety-shot":  { normal: 20_000, subscription: 17_000 },
  "helya-hydrate":       { normal: 20_000, subscription: 17_000 },
  "helya-vigor":         { normal: 20_000, subscription: 17_000 },
  "helya-perform":       { normal: 20_000, subscription: 17_000 },
};
