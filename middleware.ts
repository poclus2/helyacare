import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/navigation';
import { NextResponse, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default auth((req: NextRequest & { auth?: any }) => {
  const { pathname } = req.nextUrl;

  // Si on est sur une route /admin ou /api, on bypasse next-intl.
  if (pathname.startsWith('/admin') || pathname.startsWith('/api')) {
    return NextResponse.next();
  }

  // Rediriger /fr/admin ou /en/admin vers /admin (qui n'est pas localisé)
  const adminMatch = pathname.match(/^\/(fr|en)\/admin(.*)/);
  if (adminMatch) {
    return NextResponse.redirect(new URL(`/admin${adminMatch[2] || ''}`, req.url));
  }

  // ── Routes ESPACE CLIENT protégées ────────────────────────────────────────
  const isAuth = !!(req as any).auth;
  const isProtectedRoute = pathname.match(/^\/(fr|en)\/espace-client/);

  if (isProtectedRoute && !isAuth) {
    const locale = pathname.split('/')[1] || 'fr';
    const loginUrl = new URL(`/${locale}/connexion`, req.nextUrl.origin);
    return NextResponse.redirect(loginUrl);
  }

  // ── Toutes les autres routes (hors /admin) : middleware i18n ──────────────
  return intlMiddleware(req);
});

export const config = {
  matcher: ['/((?!_next|.*\\..*).*)'],
};
