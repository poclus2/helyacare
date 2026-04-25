import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de Confidentialité | HelyaCare",
  description: "Découvrez comment HelyaCare collecte, utilise et protège vos données personnelles.",
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const lastUpdated = "24 avril 2026";

export default function ConfidentialitePage() {
  return (
    <>
      <Header />
      <main className={`bg-[#FAF9F7] min-h-screen ${pjs.className}`}>
        {/* Hero */}
        <div className="bg-[#0F3D3E] text-white py-16 md:py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-4">Document légal</p>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-3 ${inter.className}`}>
              Politique de Confidentialité
            </h1>
            <p className="text-white/60 text-sm">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

          {/* Intro */}
          <div className="bg-white border border-[#E8E3DC] rounded-2xl p-6">
            <p className="text-[#0F3D3E] font-semibold text-[15px] leading-relaxed">
              HelyaCare accorde une importance primordiale à la protection de vos données personnelles. Cette politique décrit quelles données nous collectons, comment nous les utilisons et vos droits à cet égard.
            </p>
          </div>

          {[
            {
              title: "1. Responsable du Traitement",
              content: `HelyaCare SAS
Email de contact : privacy@helyacare.com

En qualité de responsable du traitement, HelyaCare s'engage à traiter vos données personnelles dans le strict respect du Règlement Général sur la Protection des Données (RGPD) et de la loi Informatique et Libertés.`,
            },
            {
              title: "2. Données Collectées",
              content: `Lors de votre utilisation de nos services, nous collectons les catégories de données suivantes :

Données d'identification : nom, prénom, adresse email, numéro de téléphone.
Données de commande : adresse de livraison, historique des achats, préférences produits.
Données de navigation : adresse IP, type de navigateur, pages visitées, durée de visite (via cookies analytiques).
Données de santé limitées : objectifs santé déclarés via le bilan IA (stockés de façon anonymisée et chiffrée).
Données financières : nous ne stockons AUCUNE donnée bancaire. Les paiements sont traités exclusivement par Flutterwave (certifié PCI-DSS).`,
            },
            {
              title: "3. Finalités du Traitement",
              content: `Vos données sont utilisées pour :

• Traiter et livrer vos commandes
• Gérer votre compte client et abonnement
• Personnaliser vos recommandations santé via l'IA HelyaCare
• Vous envoyer des communications (confirmations de commande, suivi de livraison)
• Avec votre consentement : communications marketing (newsletter, offres)
• Améliorer nos services et détecter les fraudes
• Respecter nos obligations légales et fiscales`,
            },
            {
              title: "4. Base Légale",
              content: `Selon les traitements :
• Exécution du contrat : traitement des commandes, livraison, service client
• Consentement : emails marketing, cookies non-essentiels, bilan santé IA
• Intérêt légitime : sécurité, prévention des fraudes, amélioration du service
• Obligation légale : conservation des données comptables (10 ans)`,
            },
            {
              title: "5. Partage des Données",
              content: `Nous ne vendons jamais vos données personnelles à des tiers.

Nous partageons vos données uniquement avec :
• Nos prestataires logistiques (pour la livraison de vos commandes)
• Flutterwave (traitement sécurisé des paiements)
• Nos outils analytiques (données anonymisées uniquement)
• Les autorités compétentes si la loi l'exige

Tout transfert hors UE est encadré par des garanties appropriées (clauses contractuelles types).`,
            },
            {
              title: "6. Cookies",
              content: `Nous utilisons plusieurs types de cookies :

Cookies essentiels : nécessaires au fonctionnement du site (session, panier). Ne peuvent être désactivés.
Cookies analytiques : mesurent l'audience et les performances du site (peuvent être refusés).
Cookies de personnalisation : mémorisent vos préférences (langue, devise). Peuvent être refusés.

Vous pouvez gérer vos préférences de cookies à tout moment via les paramètres de votre navigateur.`,
            },
            {
              title: "7. Conservation des Données",
              content: `Vos données sont conservées pendant :

• Données de compte actif : durée de la relation commerciale + 3 ans
• Données de commande : 10 ans (obligation comptable légale)
• Données de navigation : 13 mois maximum
• Bilan santé IA : jusqu'à suppression du compte ou demande explicite

À l'expiration de ces délais, vos données sont supprimées ou anonymisées.`,
            },
            {
              title: "8. Vos Droits",
              content: `Conformément au RGPD, vous disposez des droits suivants :

• Droit d'accès : obtenir une copie de vos données personnelles
• Droit de rectification : corriger des données inexactes
• Droit à l'effacement ("droit à l'oubli") : demander la suppression de vos données
• Droit à la portabilité : recevoir vos données dans un format structuré
• Droit d'opposition : vous opposer à certains traitements
• Droit à la limitation : demander le gel temporaire du traitement
• Droit de retrait du consentement : à tout moment, sans affecter la licéité du traitement antérieur

Pour exercer ces droits : privacy@helyacare.com
Réponse garantie sous 30 jours.`,
            },
            {
              title: "9. Sécurité",
              content: `HelyaCare met en œuvre des mesures techniques et organisationnelles adaptées pour protéger vos données :

• Chiffrement HTTPS/TLS sur toutes les communications
• Bases de données chiffrées au repos
• Accès aux données restreint au personnel autorisé
• Audits de sécurité réguliers
• Politique de mots de passe renforcée

En cas de violation de données susceptible d'engendrer un risque pour vos droits, nous vous informerons dans les 72 heures conformément au RGPD.`,
            },
            {
              title: "10. Contact et Réclamation",
              content: `Pour toute question relative à la protection de vos données :

Email DPO : privacy@helyacare.com
Adresse : HelyaCare SAS, Dakar, Sénégal

Si vous estimez que vos droits ne sont pas respectés, vous pouvez déposer une réclamation auprès de la Commission de Protection des Données Personnelles (CDP) au Sénégal, ou de la CNIL en France.`,
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
            Document mis à jour le {lastUpdated}. DPO : <a href="mailto:privacy@helyacare.com" className="text-[#0F3D3E] underline">privacy@helyacare.com</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
