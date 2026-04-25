import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { jwtVerify } from "jose";

/**
 * Vérification d'authentification admin.
 * Réutilisée dans toutes les routes /api/admin/*
 */
export async function verifyAdminAuth(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("helyacare_admin_token")?.value;
  if (!token) return false;
  const SECRET = new TextEncoder().encode(
    process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
  );
  try {
    await jwtVerify(token, SECRET);
    return true;
  } catch {
    return false;
  }
}
