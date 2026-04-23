import createMiddleware from 'next-intl/middleware';

const nextIntlMiddleware = createMiddleware({
  // A list of all locales that are supported
  locales: ['fr', 'en'],

  // Used when no locale matches
  defaultLocale: 'fr',
  
  // Keep the locale visible in the URL even for the default language.
  localePrefix: 'always'
});

export default function proxy(request: any) {
  console.log('--- Proxy Intercepting ---', request.nextUrl.pathname);
  const response = nextIntlMiddleware(request);
  console.log('--- Proxy Response Status ---', response.status);
  return response;
}

export const config = {
  // Match all pathnames except for:
  // - API routes, trpc, _next, and _vercel internal paths
  // - Any path containing a dot (e.g., favicon.ico, styles.css)
  matcher: ['/((?!api|trpc|_next|_vercel|.*\\..*).*)']
};
