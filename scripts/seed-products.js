const fs = require('fs');
const path = require('path');

// Basic dotenv parser for this script
const envPath = path.join(__dirname, '..', '.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
const envVars = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const BACKEND_URL = (envVars.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000").replace(/['"]/g, '');
const API_KEY = (envVars.MEDUSA_API_KEY || "").replace(/['"]/g, '');

const products = [
  {
    handle: "crave-control",
    title: "Crave Control",
    description: "Un bouclier neuro-métabolique qui régule l'appétit, aide à limiter les fringales et soutient le métabolisme au quotidien.",
    priceNormal: 20000,
    priceSub: 17000,
  }
];

async function seedProducts() {
  console.log(`Seeding ${products.length} products to Medusa at ${BACKEND_URL}...`);
  
  for (const prod of products) {
    const payload = {
      title: prod.title,
      description: prod.description,
      handle: prod.handle,
      status: "published",
      options: [
        { title: "Type d'achat", values: ["Achat Unique", "Abonnement Mensuel"] }
      ],
      variants: [
        {
          title: "Achat Unique",
          manage_inventory: false,
          prices: [
            {
              currency_code: "xof",
              amount: prod.priceNormal * 100
            }
          ],
          options: { "Type d'achat": "Achat Unique" }
        },
        {
          title: "Abonnement Mensuel",
          manage_inventory: false,
          prices: [
            {
              currency_code: "xof",
              amount: prod.priceSub * 100
            }
          ],
          options: { "Type d'achat": "Abonnement Mensuel" }
        }
      ]
    };

    try {
      const res = await fetch(`${BACKEND_URL}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${Buffer.from(`${API_KEY}:`).toString("base64")}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        console.log(`✅ Créé: ${prod.title}`);
      } else {
        const err = await res.text();
        console.error(`❌ Echec pour ${prod.title}: ${res.status} - ${err}`);
      }
    } catch (e) {
      console.error(`❌ Erreur réseau pour ${prod.title}:`, e.message);
    }
  }
}

seedProducts();
