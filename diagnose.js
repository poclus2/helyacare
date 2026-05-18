#!/usr/bin/env node
/**
 * Script de diagnostic HelyaCare — Medusa Admin API
 * Usage : node diagnose.js
 * Lance ce script depuis le dossier /var/www/helyacare sur ton VPS
 */

// Lecture du fichier .env manuellement
const fs = require("fs");
const path = require("path");

function loadEnv() {
  const envPath = path.join(__dirname, ".env");
  if (!fs.existsSync(envPath)) {
    console.error("❌ Fichier .env introuvable !");
    process.exit(1);
  }
  const lines = fs.readFileSync(envPath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim().replace(/^"(.*)"$/, "$1");
    process.env[key] = value;
  }
}

loadEnv();

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

console.log("\n====================================================");
console.log("     🏥 HELYACARE — DIAGNOSTIC MEDUSA API");
console.log("====================================================\n");

console.log("📋 CONFIGURATION DETECTEE :");
console.log(`  MEDUSA_URL      : ${MEDUSA_URL}`);
console.log(`  ADMIN_EMAIL     : ${ADMIN_EMAIL || "❌ MANQUANT"}`);
console.log(`  ADMIN_PASSWORD  : ${ADMIN_PASSWORD ? "✅ défini" : "❌ MANQUANT"}`);
console.log(`  PUBLISHABLE_KEY : ${PUBLISHABLE_KEY ? PUBLISHABLE_KEY.slice(0, 20) + "..." : "❌ MANQUANT"}`);
console.log("");

async function step(name, fn) {
  process.stdout.write(`🔍 Test : ${name}... `);
  try {
    const result = await fn();
    console.log(`✅ OK${result ? " — " + result : ""}`);
    return true;
  } catch (e) {
    console.log(`❌ ECHEC`);
    console.log(`   └─ Erreur : ${e.message}`);
    return false;
  }
}

async function main() {
  // === ETAPE 1 : Ping Medusa ===
  const pingOk = await step("Medusa est accessible", async () => {
    const res = await fetch(`${MEDUSA_URL}/health`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return `HTTP ${res.status}`;
  });
  if (!pingOk) {
    console.log("\n⛔ Le backend Medusa est inaccessible. Vérifiez que le conteneur backend tourne.");
    console.log("   Commande : docker compose ps");
    process.exit(1);
  }

  // === ETAPE 2 : Login admin ===
  let jwtToken = null;
  const loginOk = await step("Login admin email/password", async () => {
    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans .env");
    const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
    const data = JSON.parse(text);
    if (!data.token) throw new Error(`Pas de token dans la réponse : ${text}`);
    jwtToken = data.token;
    return `JWT obtenu (${jwtToken.slice(0, 30)}...)`;
  });
  if (!loginOk) {
    console.log("\n⛔ Le login admin a échoué. Vérifiez que :");
    console.log("   1. ADMIN_EMAIL et ADMIN_PASSWORD sont corrects dans votre .env");
    console.log("   2. Un compte admin existe dans Medusa avec ces identifiants");
    console.log("   3. Créez un compte admin avec :");
    console.log("      docker compose exec backend npx medusa user --email admin@helyacare.com --password helyacare-admin-2026");
    process.exit(1);
  }

  // === ETAPE 3 : Liste des produits ===
  await step("Récupérer la liste des produits", async () => {
    const res = await fetch(`${MEDUSA_URL}/admin/products?limit=5`, {
      headers: { Authorization: `Bearer ${jwtToken}` },
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
    const data = JSON.parse(text);
    return `${data.count} produit(s) trouvé(s)`;
  });

  // === ETAPE 4 : Créer un produit test ===
  let testProductId = null;
  const createOk = await step("Créer un produit de test", async () => {
    const payload = {
      title: "[TEST DIAGNOSTIC] Produit temporaire",
      status: "draft",
      options: [{ title: "Format", values: ["Standard"] }],
      variants: [{
        title: "Standard",
        manage_inventory: false,
        prices: [{ currency_code: "xof", amount: 100 }],
        options: { Format: "Standard" }
      }],
      metadata: { test: true }
    };
    const res = await fetch(`${MEDUSA_URL}/admin/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
    const data = JSON.parse(text);
    testProductId = data.product?.id;
    return `Produit créé avec ID : ${testProductId}`;
  });

  // === ETAPE 5 : Supprimer le produit test ===
  if (testProductId) {
    await step("Supprimer le produit de test", async () => {
      const res = await fetch(`${MEDUSA_URL}/admin/products/${testProductId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${jwtToken}` },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return "Nettoyage OK";
    });
  }

  // === ETAPE 6 : Test avec la clé publiable (store) ===
  await step("Récupérer les produits en tant que client (Store API)", async () => {
    const headers = {};
    if (PUBLISHABLE_KEY) headers["x-publishable-api-key"] = PUBLISHABLE_KEY;
    const res = await fetch(`${MEDUSA_URL}/store/products?limit=5`, { headers });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${text}`);
    const data = JSON.parse(text);
    return `${data.count} produit(s) visible(s) pour les clients`;
  });

  console.log("\n====================================================");
  if (createOk) {
    console.log("🎉 TOUS LES TESTS SONT PASSES !");
    console.log("");
    console.log("✅ L'API Medusa fonctionne correctement.");
    console.log("✅ La création de produits fonctionne.");
    console.log("");
    console.log("Le problème vient probablement du fait que les variables");
    console.log("d'environnement ne sont pas correctement injectées dans");
    console.log("le conteneur frontend (ADMIN_EMAIL, ADMIN_PASSWORD).");
    console.log("");
    console.log("Vérifiez avec : docker compose exec frontend env | grep ADMIN");
  } else {
    console.log("❌ CERTAINS TESTS ONT ECHOUE. Lisez les messages ci-dessus.");
  }
  console.log("====================================================\n");
}

main().catch(e => {
  console.error("\n💥 Erreur inattendue :", e);
  process.exit(1);
});
