import { NextResponse } from "next/server";
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);

// POST /api/admin/auth — Login
export async function POST(request: Request) {
  const { email, password } = await request.json();

  const validEmail = process.env.ADMIN_EMAIL || "admin@helyacare.com";
  const validPassword = process.env.ADMIN_PASSWORD || "helyacare-admin-2026";

  if (email !== validEmail || password !== validPassword) {
    return NextResponse.json({ error: "Identifiants incorrects" }, { status: 401 });
  }

  // Créer un JWT admin valable 8h
  const token = await new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);

  const response = NextResponse.json({ success: true });
  response.cookies.set("helyacare_admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8h
    path: "/",
  });

  return response;
}

// DELETE /api/admin/auth — Logout
export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.set("helyacare_admin_token", "", { maxAge: 0, path: "/" });
  return response;
}

// GET /api/admin/auth — Verify token
export async function GET(request: Request) {
  const token = request.headers
    .get("cookie")
    ?.split(";")
    .find(c => c.trim().startsWith("helyacare_admin_token="))
    ?.split("=")[1];

  if (!token) return NextResponse.json({ valid: false }, { status: 401 });

  try {
    await jwtVerify(token, SECRET);
    return NextResponse.json({ valid: true });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
