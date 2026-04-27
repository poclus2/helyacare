import {createNavigation} from 'next-intl/navigation';
import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always',
  // next-intl ne doit PAS traiter les routes /admin
  // → géré par le middleware qui bypasse intlMiddleware pour ces paths
});

export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);
