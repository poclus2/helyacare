import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { AuthSessionProvider } from "@/contexts/AuthSessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import CartDrawer from "@/components/CartDrawer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Helyacare | L'Excellence de la Santé Numérique",
  description: "Compléments alimentaires haut de gamme couplés à un suivi santé par Intelligence Artificielle.",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <AuthSessionProvider>
            <CurrencyProvider>
              <CartProvider>
                {children}
                <CartDrawer />
              </CartProvider>
            </CurrencyProvider>
          </AuthSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
