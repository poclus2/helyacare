/**
 * Utilitaire : obtient un token JWT admin Medusa via email/password.
 * Le token est mis en cache en mémoire pour éviter un login à chaque requête.
 */

const MEDUSA_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

let cachedToken: string | null = null;
let tokenExpiry: number = 0;

export async function getMedusaAdminToken(): Promise<string> {
  // Réutilise le token s'il est encore valide (expire dans 23h)
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans les variables d'environnement");
  }

  const res = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Echec de l'authentification Medusa admin: ${res.status} - ${err}`);
  }

  const data = await res.json();
  const token = data.token;

  if (!token) {
    throw new Error("Aucun token retourné par Medusa lors du login admin");
  }

  cachedToken = token;
  // Le token JWT Medusa dure 24h — on renouvelle après 23h
  tokenExpiry = Date.now() + 23 * 60 * 60 * 1000;

  return token;
}
