/**
 * Layout racine /admin — minimal, pas de wrapper UI.
 * Chaque route group ((auth) et (panel)) a son propre layout.
 */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
