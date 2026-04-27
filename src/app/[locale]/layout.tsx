import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthSessionProvider } from "@/contexts/AuthSessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";
import { PricesProvider } from "@/contexts/PricesContext";


export const metadata: Metadata = {
  title: "Helyacare | L'Excellence de la Santé Numérique",
  description:
    "Compléments alimentaires haut de gamme couplés à un suivi santé par Intelligence Artificielle.",
};

/**
 * Locale layout — gère uniquement les providers contextuels et i18n.
 *
 * NE redéfinit PAS <html> ni <body> — ceux-ci viennent de src/app/layout.tsx.
 * L'attribut lang={locale} est appliqué dynamiquement via le script next-intl
 * en combinaison avec suppressHydrationWarning du root layout.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <AuthSessionProvider>
        <CurrencyProvider>
          <PricesProvider>
            <CartProvider>
              {children}
              <CartDrawer />
            </CartProvider>
          </PricesProvider>
        </CurrencyProvider>
      </AuthSessionProvider>
    </NextIntlClientProvider>
  );
}
