/**
 * sync-medusa-products.js
 * Synchronise les produits HelyaCare dans Medusa v2
 * Usage: node scripts/sync-medusa-products.js
 */

const BACKEND = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const API_KEY = process.env.MEDUSA_API_KEY || "sk_23cc27387d8bfe87f8308f9be53185e76c03b0b6baec38a206afb1257faa7efb";

const authHeader = "Basic " + Buffer.from(`${API_KEY}:`).toString("base64");

const PRODUCTS = [
  {
    handle: "crave-control",
    title: "Crave Control",
    description:
      "Un bouclier neuro-métabolique qui régule l'appétit, aide à limiter les fringales et soutient le métabolisme au quotidien.",
    status: "published",
    options: [{ title: "Type d'achat", values: ["Achat Unique", "Abonnement Mensuel"] }],
    variants: [
      {
        title: "Achat Unique",
        manage_inventory: false,
        options: { "Type d'achat": "Achat Unique" },
        prices: [{ currency_code: "xof", amount: 2500000 }], // 25 000 XOF
      },
      {
        title: "Abonnement Mensuel",
        manage_inventory: false,
        options: { "Type d'achat": "Abonnement Mensuel" },
        prices: [{ currency_code: "xof", amount: 1900000 }], // 19 000 XOF
      },
    ],
  },
  {
    handle: "pack-bien-etre",
    title: "Pack Bien-Être Essentiel",
    description:
      "Duo quotidien validé cliniquement associant Crave Control et Helya Hydrate pour une santé optimale au quotidien.",
    status: "published",
  },
  {
    handle: "apple-satiety-shot",
    title: "Apple Satiety Shot",
    description:
      "Shot de satiété formulé avec des extraits de pomme et de plantes adaptogènes pour couper les envies entre les repas.",
    status: "published",
  },
  {
    handle: "helya-hydrate",
    title: "Helya Hydrate",
    description:
      "Électrolytes premium enrichis en minéraux essentiels pour une hydratation cellulaire optimale et une récupération accélérée.",
    status: "published",
  },
  {
    handle: "helya-vigor",
    title: "Helya Vigor",
    description:
      "Formule vitalité et énergie à base de plantes et de vitamines B pour soutenir l'endurance physique et mentale.",
    status: "published",
  },
  {
    handle: "helya-perform",
    title: "Helya Perform",
    description:
      "Protocole performance avancé, formulé pour les sportifs souhaitant optimiser leur récupération musculaire et leur clarté mentale.",
    status: "published",
  },
];

async function apiGet(path) {
  const res = await fetch(`${BACKEND}${path}`, {
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
  });
  return res.json();
}

async function apiPost(path, body) {
  const res = await fetch(`${BACKEND}${path}`, {
    method: "POST",
    headers: { Authorization: authHeader, "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`POST ${path} → ${res.status}: ${text.substring(0, 300)}`);
  return JSON.parse(text);
}

async function main() {
  console.log("🔍 Vérification des produits HelyaCare dans Medusa...\n");

  // Récupérer tous les produits existants
  const existing = await apiGet("/admin/products?limit=100");
  const existingHandles = new Set((existing.products || []).map((p) => p.handle));
  console.log("Produits existants:", [...existingHandles].join(", ") || "(aucun)");
  console.log();

  for (const product of PRODUCTS) {
    if (existingHandles.has(product.handle)) {
      console.log(`✅ ${product.handle} — déjà présent`);
      continue;
    }

    console.log(`➕ Création de "${product.title}" (${product.handle})...`);

    const payload = {
      title: product.title,
      description: product.description,
      handle: product.handle,
      status: product.status || "published",
      options: product.options || [
        { title: "Type d'achat", values: ["Achat Unique", "Abonnement Mensuel"] },
      ],
      variants: product.variants || [
        {
          title: "Achat Unique",
          manage_inventory: false,
          options: { "Type d'achat": "Achat Unique" },
          prices: [{ currency_code: "xof", amount: 2000000 }],
        },
        {
          title: "Abonnement Mensuel",
          manage_inventory: false,
          options: { "Type d'achat": "Abonnement Mensuel" },
          prices: [{ currency_code: "xof", amount: 1500000 }],
        },
      ],
    };

    try {
      const result = await apiPost("/admin/products", payload);
      console.log(`   ✅ Créé : ${result.product?.id || "OK"}`);
    } catch (err) {
      console.error(`   ❌ Erreur:`, err.message);
    }
  }

  console.log("\n🏁 Synchronisation terminée.");

  // Vérification finale via store API
  const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_55ffe19dc5806dc56f8bbe4c7ff3ee8b1f531588f10ed5614d6d8758767ab5f7";
  const fields = encodeURIComponent("handle,title,status,description,thumbnail,*variants.prices");
  const storeRes = await fetch(`${BACKEND}/store/products?fields=${fields}&limit=50`, {
    headers: { "x-publishable-api-key": pubKey },
  });
  const storeData = await storeRes.json();
  const published = (storeData.products || []).filter((p) => p.status === "published");

  console.log(`\n📦 Store API — ${published.length} produit(s) publiés visibles par les clients :`);
  published.forEach((p) => {
    const variant = p.variants?.[0];
    const price = variant?.prices?.[0]?.amount;
    const xof = price ? Math.round(price / 100).toLocaleString("fr-FR") : "?";
    console.log(`   • ${p.handle} — ${p.title} — ${xof} XOF`);
  });
}

main().catch(console.error);
