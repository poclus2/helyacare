import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://helyacare.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = ["fr", "en"];

  const routes = [
    { path: "", priority: 1.0, changeFrequency: "weekly" as const },
    { path: "/boutique", priority: 0.9, changeFrequency: "weekly" as const },
    { path: "/boutique/crave-control", priority: 0.9, changeFrequency: "monthly" as const },
    { path: "/boutique/helya-hydrate", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/boutique/helya-vigor", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/boutique/apple-satiety-shot", priority: 0.8, changeFrequency: "monthly" as const },
    { path: "/boutique/pack-bien-etre", priority: 0.85, changeFrequency: "monthly" as const },
    { path: "/experience", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/mission", priority: 0.6, changeFrequency: "monthly" as const },
    { path: "/ambassadeur", priority: 0.7, changeFrequency: "monthly" as const },
    { path: "/connexion", priority: 0.5, changeFrequency: "yearly" as const },
    { path: "/legal/cgv", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/confidentialite", priority: 0.3, changeFrequency: "yearly" as const },
    { path: "/legal/mentions-legales", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      entries.push({
        url: `${BASE_URL}/${locale}${route.path}`,
        lastModified: new Date(),
        changeFrequency: route.changeFrequency,
        priority: route.priority,
      });
    }
  }

  return entries;
}
