import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "Helyacare | L'Excellence de la Santé Numérique",
  description:
    "Compléments alimentaires haut de gamme couplés à un suivi santé par Intelligence Artificielle.",
};

/**
 * Root layout — seul responsable de <html> et <body>.
 *
 * suppressHydrationWarning sur <html> permet à next-intl de mettre à jour
 * l'attribut lang="fr" → "en" côté client sans erreur de hydration.
 *
 * Le layout [locale]/layout.tsx gère les providers i18n/auth/cart
 * mais ne redéfinit PAS <html> ni <body>.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      suppressHydrationWarning
      className={`${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
