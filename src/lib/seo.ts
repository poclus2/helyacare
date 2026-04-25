/**
 * HelyaCare — Métadonnées SEO centralisées
 * Toutes les pages importantes ont leurs propres métadonnées.
 */

const SITE = {
  name: "HelyaCare",
  url: "https://helyacare.com",
  description: "Compléments alimentaires cliniques couplés à un suivi santé par Intelligence Artificielle. Formulés pour le métabolisme africain.",
  locale: "fr_FR",
  twitter: "@helyacare",
};

/** Helper pour générer des métadonnées structurées */
export function buildMeta({
  title,
  description,
  path = "/",
  imageUrl,
}: {
  title: string;
  description: string;
  path?: string;
  imageUrl?: string;
}) {
  const fullTitle = `${title} | HelyaCare`;
  const image = imageUrl || `${SITE.url}/og-default.jpg`;
  const url = `${SITE.url}${path}`;

  return {
    title: fullTitle,
    description,
    metadataBase: new URL(SITE.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE.name,
      images: [{ url: image, width: 1200, height: 630, alt: fullTitle }],
      locale: SITE.locale,
      type: "website" as const,
    },
    twitter: {
      card: "summary_large_image" as const,
      title: fullTitle,
      description,
      creator: SITE.twitter,
      images: [image],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" as const },
    },
  };
}

// ── Métadonnées par page ──────────────────────────────────────────────────

export const SEO = {
  home: buildMeta({
    title: "Régulez votre métabolisme naturellement",
    description: "HelyaCare — compléments alimentaires cliniques + suivi santé IA. Formulés pour le métabolisme africain. Garantie 30 jours.",
    path: "/",
    imageUrl: `${SITE.url}/og-home.jpg`,
  }),

  boutique: buildMeta({
    title: "Boutique — Compléments alimentaires premium",
    description: "Découvrez nos formules cliniques : Crave Control, Helya Hydrate, Apple Satiety Shot. Livraison Afrique de l'Ouest.",
    path: "/boutique",
  }),

  craveControl: buildMeta({
    title: "Crave Control CC-01™ — Bouclier neuro-métabolique",
    description: "Réduisez vos envies de sucre, stabilisez votre glycémie et combattez les fringales. 3 actifs purs cliniquement validés. Essai 30 jours gratuit.",
    path: "/boutique/crave-control",
    imageUrl: `${SITE.url}/images/products/crave-control/og.jpg`,
  }),

  helyaHydrate: buildMeta({
    title: "Helya Hydrate HH-03™ — Électrolytes Premium",
    description: "Hydratation cellulaire optimale et récupération accélérée. Enrichi en minéraux essentiels. Formule clinique HelyaCare.",
    path: "/boutique/helya-hydrate",
  }),

  helyaVigor: buildMeta({
    title: "Helya Vigor HV-04™ — Vitalité & Énergie",
    description: "Formule vitalité et énergie à base de plantes et vitamines B. Soutient l'endurance physique et mentale.",
    path: "/boutique/helya-vigor",
  }),

  appleSatietyShot: buildMeta({
    title: "Apple Satiety Shot AS-02™ — Shot Satiété",
    description: "Shot anti-fringales formulé avec des extraits de pomme et plantes adaptogènes. Résultats en 15 minutes.",
    path: "/boutique/apple-satiety-shot",
  }),

  packBienEtre: buildMeta({
    title: "Pack Bien-Être — Économisez 20%",
    description: "Le duo quotidien Crave Control + Helya Hydrate pour une santé optimale. -20% sur votre première commande.",
    path: "/boutique/pack-bien-etre",
  }),

  experience: buildMeta({
    title: "L'Expérience HelyaCare — Santé augmentée par l'IA",
    description: "Découvrez comment HelyaCare combine science clinique et intelligence artificielle pour transformer votre santé.",
    path: "/experience",
  }),

  mission: buildMeta({
    title: "Notre Mission — Démocratiser la santé en Afrique",
    description: "HelyaCare : formuler des compléments adaptés au métabolisme africain et les rendre accessibles à tous.",
    path: "/mission",
  }),

  ambassadeur: buildMeta({
    title: "Programme Ambassadeur — Gagnez en partageant",
    description: "Rejoignez le réseau HelyaCare. Partagez, recommandez et gagnez des commissions sur chaque vente de votre réseau.",
    path: "/ambassadeur",
  }),

  connexion: buildMeta({
    title: "Connexion — Espace Client",
    description: "Connectez-vous à votre espace client HelyaCare pour suivre vos commandes et accéder à votre coach IA.",
    path: "/connexion",
  }),

  cgv: buildMeta({
    title: "Conditions Générales de Vente",
    description: "CGV HelyaCare — commandes, paiements, livraison, remboursements et droits clients.",
    path: "/legal/cgv",
  }),

  confidentialite: buildMeta({
    title: "Politique de Confidentialité",
    description: "Comment HelyaCare collecte, utilise et protège vos données personnelles. Conformité RGPD et CDP Sénégal.",
    path: "/legal/confidentialite",
  }),

  mentionsLegales: buildMeta({
    title: "Mentions Légales",
    description: "Informations légales sur HelyaCare : éditeur, hébergeur, propriété intellectuelle et droits applicables.",
    path: "/legal/mentions-legales",
  }),
};
