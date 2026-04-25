import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import AdminShell from "@/components/admin/AdminShell";

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_SECRET || "helyacare-admin-fallback-secret"
);

/**
 * Layout pour le groupe (panel) — /admin/dashboard, /admin/commandes, etc.
 * Vérifie le cookie admin côté serveur et redirige si non authentifié.
 */
export default async function PanelGroupLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get("helyacare_admin_token")?.value;

  if (!token) {
    redirect("/admin/login");
  }

  try {
    await jwtVerify(token, SECRET);
  } catch {
    redirect("/admin/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
