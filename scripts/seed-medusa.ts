/**
 * HelyaCare — Script de seed Medusa
 * Configure automatiquement : Région XOF, Store, Produits + Variantes
 *
 * Usage :
 *   cd backend
 *   npx ts-node ../scripts/seed-medusa.ts
 *
 * Pré-requis :
 *   - Backend Medusa lancé sur http://localhost:9000
 *   - Clé API admin disponible (MEDUSA_ADMIN_API_KEY dans .env du backend)
 */

const BACKEND_URL = "http://localhost:9000";
const ADMIN_EMAIL = "admin@helyacare.com";
const ADMIN_PASSWORD = "SuperAdmin123!";

// ─── Couleurs console ────────────────────────────────────────────────────────
const c = {
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  blue: (s: string) => `\x1b[34m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
};

async function adminFetch(path: string, token: string, method = "GET", body?: any) {
  const res = await fetch(`${BACKEND_URL}/admin${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(`${method} /admin${path} → ${res.status}: ${JSON.stringify(data)}`);
  }
  return data;
}

// ─── Authentification Admin ──────────────────────────────────────────────────
async function getAdminToken(): Promise<string> {
  console.log(c.blue("🔐 Authentification admin..."));
  const res = await fetch(`${BACKEND_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Auth admin échouée: ${JSON.stringify(data)}`);
  console.log(c.green("✅ Admin authentifié"));
  return data.token;
}

// ─── Région XOF ─────────────────────────────────────────────────────────────
async function createRegion(token: string): Promise<string> {
  console.log(c.blue("\n📍 Création de la région Afrique de l'Ouest (XOF)..."));

  // Vérifier si la région existe déjà
  const existing = await adminFetch("/regions", token);
  const xofRegion = existing.regions?.find((r: any) => r.currency_code === "xof");
  if (xofRegion) {
    console.log(c.yellow(`⚠️  Région XOF déjà existante: ${xofRegion.id}`));
    return xofRegion.id;
  }

  const region = await adminFetch("/regions", token, "POST", {
    name: "Afrique de l'Ouest",
    currency_code: "xof",
    tax_rate: 0,
    countries: ["sn", "ci", "ml", "bf", "gn", "cm", "tg", "bj"],
    payment_providers: ["manual"],
    fulfillment_providers: ["manual"],
  });

  console.log(c.green(`✅ Région créée: ${region.region.id}`));
  return region.region.id;
}

// ─── Catalogue Produits ──────────────────────────────────────────────────────
const PRODUCTS = [
  {
    slug: "crave-control",
    title: "Crave Control",
    subtitle: "Bouclier neuro-métabolique CC-01™",
    description: "Bouclier neuro-métabolique validé cliniquement pour réguler l'appétit, stabiliser la glycémie et combattre les grignotages. Propulsé par 3 actifs purs.",
    handle: "crave-control",
    thumbnail: "/images/products/crave-control/macro.png",
    variants: [
      { title: "Abonnement Mensuel", sku: "CC-01-SUB", price: 17_000 },
      { title: "Achat Unique",       sku: "CC-01-OTP", price: 20_000 },
    ],
  },
  {
    slug: "helya-hydrate",
    title: "Helya Hydrate",
    subtitle: "Électrolytes Premium HH-03™",
    description: "Électrolytes premium enrichis en minéraux essentiels pour une hydratation cellulaire optimale et une récupération accélérée.",
    handle: "helya-hydrate",
    thumbnail: "/images/products/helya-hydrate/product.png",
    variants: [
      { title: "Abonnement Mensuel", sku: "HH-03-SUB", price: 17_000 },
      { title: "Achat Unique",       sku: "HH-03-OTP", price: 20_000 },
    ],
  },
  {
    slug: "apple-satiety-shot",
    title: "Apple Satiety Shot",
    subtitle: "Shot de Satiété AS-02™",
    description: "Shot de satiété formulé avec des extraits de pomme et de plantes adaptogènes pour couper les envies entre les repas.",
    handle: "apple-satiety-shot",
    thumbnail: "/images/products/apple-satiety-shot/product.png",
    variants: [
      { title: "Abonnement Mensuel", sku: "AS-02-SUB", price: 17_000 },
      { title: "Achat Unique",       sku: "AS-02-OTP", price: 20_000 },
    ],
  },
  {
    slug: "helya-vigor",
    title: "Helya Vigor",
    subtitle: "Formule Vitalité HV-04™",
    description: "Formule vitalité et énergie à base de plantes et de vitamines B pour soutenir l'endurance physique et mentale.",
    handle: "helya-vigor",
    thumbnail: "/images/products/helya-vigor/product.png",
    variants: [
      { title: "Abonnement Mensuel", sku: "HV-04-SUB", price: 17_000 },
      { title: "Achat Unique",       sku: "HV-04-OTP", price: 20_000 },
    ],
  },
  {
    slug: "pack-bien-etre",
    title: "Pack Bien-Être Essentiel",
    subtitle: "Duo quotidien validé cliniquement",
    description: "Duo quotidien associant Crave Control et Helya Hydrate pour une santé optimale au quotidien. Économisez 20%.",
    handle: "pack-bien-etre",
    thumbnail: "/images/products/crave-control/lifestyle.png",
    variants: [
      { title: "Abonnement Mensuel", sku: "PACK-SUB", price: 28_000 },
      { title: "Achat Unique",       sku: "PACK-OTP", price: 35_000 },
    ],
  },
];

async function createProducts(token: string, regionId: string) {
  console.log(c.blue("\n🛍️  Création des produits..."));

  const results: Record<string, Record<string, string>> = {};

  for (const product of PRODUCTS) {
    try {
      // Vérifier si le produit existe déjà (par handle)
      const existingProducts = await adminFetch(`/products?handle=${product.handle}`, token);
      if (existingProducts.products?.length > 0) {
        const existing = existingProducts.products[0];
        console.log(c.yellow(`  ⚠️  ${product.title} déjà existant (${existing.id})`));

        // Récupérer les variantes existantes
        results[product.slug] = {};
        for (const variant of existing.variants || []) {
          const key = variant.title.toLowerCase().includes("abonnement") ? "subscription" : "onetime";
          results[product.slug][key] = variant.id;
        }
        continue;
      }

      // Créer le produit
      const created = await adminFetch("/products", token, "POST", {
        title: product.title,
        subtitle: product.subtitle,
        description: product.description,
        handle: product.handle,
        status: "published",
        thumbnail: product.thumbnail,
        variants: product.variants.map(v => ({
          title: v.title,
          sku: v.sku,
          manage_inventory: false,
          prices: [{
            amount: v.price,
            currency_code: "xof",
            region_id: regionId,
          }],
        })),
      });

      results[product.slug] = {};
      for (const variant of created.product.variants || []) {
        const key = variant.title.toLowerCase().includes("abonnement") ? "subscription" : "onetime";
        results[product.slug][key] = variant.id;
      }

      console.log(c.green(`  ✅ ${product.title} créé avec ${created.product.variants?.length} variantes`));
    } catch (err: any) {
      console.error(c.red(`  ❌ Erreur pour ${product.title}: ${err.message}`));
    }
  }

  return results;
}

// ─── Afficher le résumé des variant IDs ─────────────────────────────────────
function printVariantIds(variants: Record<string, Record<string, string>>) {
  console.log(c.bold("\n📋 Variant IDs à copier dans prices.ts :"));
  console.log("─".repeat(60));

  for (const [slug, ids] of Object.entries(variants)) {
    console.log(c.blue(`\n${slug}:`));
    for (const [type, id] of Object.entries(ids)) {
      console.log(`  ${type}: ${c.green(id)}`);
    }
  }

  console.log("\n" + "─".repeat(60));
  console.log(c.yellow("\n💡 Mettez à jour src/lib/prices.ts avec ces IDs pour connecter le panier à Medusa.\n"));
}

// ─── Main ────────────────────────────────────────────────────────────────────
async function main() {
  console.log(c.bold("\n🌿 HelyaCare — Seed Medusa\n"));
  console.log(`Backend: ${BACKEND_URL}`);
  console.log("─".repeat(60));

  try {
    const token = await getAdminToken();
    const regionId = await createRegion(token);
    const variantIds = await createProducts(token, regionId);

    console.log(c.bold(c.green("\n✅ Seed terminé avec succès !")));
    printVariantIds(variantIds);

  } catch (error: any) {
    console.error(c.red(`\n❌ Erreur critique: ${error.message}`));
    process.exit(1);
  }
}

main();
