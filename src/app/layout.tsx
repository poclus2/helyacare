import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HelyaCare",
};

/**
 * Layout racine Next.js — fournit les tags <html> et <body> requis.
 * Les routes [locale]/* surchargent ce layout avec leur propre structure.
 * Les routes /admin/* utilisent ce layout comme base + leur propre AdminShell.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
