import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conditions Générales de Vente | HelyaCare",
  description: "Conditions générales de vente applicables à toutes les commandes passées sur la boutique HelyaCare.",
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const lastUpdated = "24 avril 2026";

export default function CGVPage() {
  return (
    <>
      <Header />
      <main className={`bg-[#FAF9F7] min-h-screen ${pjs.className}`}>
        {/* Hero */}
        <div className="bg-[#0F3D3E] text-white py-16 md:py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-4">Document légal</p>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-3 ${inter.className}`}>
              Conditions Générales de Vente
            </h1>
            <p className="text-white/60 text-sm">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

          {[
            {
              title: "1. Préambule",
              content: `Les présentes Conditions Générales de Vente (CGV) régissent l'ensemble des ventes de produits effectuées sur le site HelyaCare, exploité par la société HelyaCare SAS, ci-après dénommée "HelyaCare" ou "le Vendeur".

Tout achat effectué sur notre boutique en ligne implique l'acceptation pleine et entière des présentes CGV. HelyaCare se réserve le droit de modifier ces conditions à tout moment, les nouvelles conditions s'appliquant aux commandes passées après leur mise en ligne.`,
            },
            {
              title: "2. Produits",
              content: `HelyaCare commercialise des compléments alimentaires et produits de bien-être. Les produits sont conformes à la législation française et sénégalaise en vigueur.

Les photographies illustrant les produits ne sont pas contractuelles. HelyaCare s'engage à présenter les produits avec la plus grande fidélité possible mais ne peut être tenue responsable d'éventuelles erreurs d'affichage.

Nos compléments alimentaires ne sont pas des médicaments et ne se substituent pas à un traitement médical. En cas de doute, consultez un professionnel de santé.`,
            },
            {
              title: "3. Commandes",
              content: `Toute commande passée sur le site implique l'acceptation de ces CGV. La commande est définitive après validation du paiement.

HelyaCare se réserve le droit d'annuler ou de refuser toute commande en cas de litige antérieur, de suspicion de fraude, ou de rupture de stock exceptionnelle. Dans ce cas, le client sera intégralement remboursé.

Pour les abonnements mensuels, la commande se renouvelle automatiquement chaque mois. Le client peut résilier à tout moment depuis son espace personnel ou en contactant notre service client.`,
            },
            {
              title: "4. Prix et Paiement",
              content: `Les prix affichés sont exprimés en Francs CFA (XOF) ou en Euros (EUR) selon la devise sélectionnée par le client. Ils incluent toutes les taxes applicables.

Les paiements sont sécurisés et traités par Flutterwave, une plateforme de paiement certifiée PCI-DSS. Nous acceptons : carte bancaire Visa/Mastercard, Mobile Money (Wave, Orange Money, MTN MoMo), et virement bancaire.

HelyaCare ne stocke aucune donnée bancaire sur ses serveurs.`,
            },
            {
              title: "5. Livraison",
              content: `La livraison est offerte sur la première commande. Pour les commandes suivantes, les frais de livraison dépendent de la zone géographique et sont indiqués lors du passage en caisse.

Les délais de livraison indicatifs sont :
- Dakar et grandes villes : 2 à 5 jours ouvrés
- Autres régions d'Afrique de l'Ouest : 5 à 10 jours ouvrés
- Europe : 7 à 14 jours ouvrés

HelyaCare ne peut être tenu responsable des retards liés aux services postaux ou douaniers.`,
            },
            {
              title: "6. Droit de Rétractation et Garantie",
              content: `Conformément aux dispositions légales, le client dispose d'un délai de 30 jours à compter de la réception de sa commande pour exercer son droit de rétractation, sans avoir à justifier sa décision.

Pour exercer ce droit : envoyez un email à care@helyacare.com avec votre numéro de commande. Le remboursement sera effectué dans un délai de 14 jours après réception du retour, via le même moyen de paiement utilisé lors de l'achat.

Les produits retournés doivent être dans leur état d'origine (non ouverts, non endommagés).`,
            },
            {
              title: "7. Données Personnelles",
              content: `Les informations collectées lors de la commande sont nécessaires à son traitement et à la livraison. Elles peuvent être transmises à nos partenaires logistiques.

Conformément à la loi Informatique et Libertés et au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données personnelles. Pour l'exercer : privacy@helyacare.com`,
            },
            {
              title: "8. Litiges",
              content: `En cas de litige, le client est invité à contacter notre service client à l'adresse care@helyacare.com. Une solution amiable sera recherchée en priorité.

À défaut de règlement amiable, le litige sera soumis aux tribunaux compétents selon la législation applicable.

Les présentes CGV sont soumises au droit sénégalais et français.`,
            },
            {
              title: "9. Contact",
              content: `HelyaCare SAS
Email : care@helyacare.com
Site web : www.helyacare.com`,
            },
          ].map(({ title, content }) => (
            <section key={title}>
              <h2 className={`text-xl font-bold text-[#0F3D3E] mb-4 ${inter.className}`}>{title}</h2>
              <div className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-line">
                {content}
              </div>
            </section>
          ))}

          <div className="border-t border-[#E8E3DC] pt-8 text-sm text-gray-400">
            Document mis à jour le {lastUpdated}. Pour toute question : <a href="mailto:care@helyacare.com" className="text-[#0F3D3E] underline">care@helyacare.com</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
