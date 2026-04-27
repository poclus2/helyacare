import { auth } from '@/auth';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/navigation';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

/**
 * Middleware principal HelyaCare
 *
 * Ordre de priorité :
 * 1. Routes /admin → bypass total (pas de auth(), pas de intlMiddleware)
 * 2. Routes /[locale]/espace-client → protection auth via NextAuth
 * 3. Tout le reste → intlMiddleware (détection de locale)
 */
export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. ADMIN : bypass complet avant auth() ────────────────────────────────
  // Correction des redirections parasites /fr/admin → /admin
  if (pathname.match(/^\/(fr|en)\/admin/)) {
    const rest = pathname.replace(/^\/(fr|en)\/admin/, '/admin');
    return NextResponse.redirect(new URL(rest, request.url));
  }

  if (pathname.startsWith('/admin')) {
    // /admin/login : accessible sans token
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }
    // Autres routes admin : vérifier le cookie
    const adminToken = request.cookies.get('helyacare_admin_token')?.value;
    if (!adminToken) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.next();
  }

  // ── 2. Routes ESPACE CLIENT : protection via NextAuth ────────────────────
  const isProtectedRoute = pathname.match(/^\/(fr|en)\/espace-client/);
  if (isProtectedRoute) {
    // Déléguer à auth() seulement pour les routes protégées
    return (auth as any)((req: any) => {
      const isAuthenticated = !!req.auth;
      if (!isAuthenticated) {
        const locale = pathname.split('/')[1] || 'fr';
        return NextResponse.redirect(new URL(`/${locale}/connexion`, request.url));
      }
      return intlMiddleware(request);
    })(request, {} as NextFetchEvent);
  }

  // ── 3. Tout le reste : intlMiddleware ─────────────────────────────────────
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Exclure : fichiers statiques (_next, assets), API routes, et les fichiers avec extension
    '/((?!_next/static|_next/image|favicon.ico|api/|.*\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff|woff2|ttf|otf)).*)',
  ],
};
