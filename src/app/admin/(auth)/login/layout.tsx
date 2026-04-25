/**
 * Layout spécifique pour /admin/login
 * Bypass le layout sidebar admin — page standalone sans nav
 */
export default function AdminLoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
