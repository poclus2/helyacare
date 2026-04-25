import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions Légales | HelyaCare",
  description: "Mentions légales de HelyaCare — informations sur l'éditeur, l'hébergeur et les responsabilités.",
};

const inter = Inter({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });
const pjs = Plus_Jakarta_Sans({ subsets: ["latin"], weight: ["400", "500", "600"] });

const lastUpdated = "24 avril 2026";

export default function MentionsLegalesPage() {
  return (
    <>
      <Header />
      <main className={`bg-[#FAF9F7] min-h-screen ${pjs.className}`}>
        {/* Hero */}
        <div className="bg-[#0F3D3E] text-white py-16 md:py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <p className="text-[#CBF27A] text-xs font-bold uppercase tracking-widest mb-4">Document légal</p>
            <h1 className={`text-4xl md:text-5xl font-extrabold mb-3 ${inter.className}`}>
              Mentions Légales
            </h1>
            <p className="text-white/60 text-sm">Dernière mise à jour : {lastUpdated}</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-6 py-16 space-y-10">

          {[
            {
              title: "1. Éditeur du Site",
              content: `Raison sociale : HelyaCare SAS
Siège social : Dakar, Sénégal
Email : care@helyacare.com
Site web : www.helyacare.com

Directeur de la publication : [Nom du Directeur]

HelyaCare est une société spécialisée dans la santé numérique, le bien-être et les compléments alimentaires de haute qualité.`,
            },
            {
              title: "2. Hébergement",
              content: `Le site HelyaCare est hébergé par :

Vercel Inc.
440 N Barranca Ave #4133
Covina, CA 91723
États-Unis
https://vercel.com

Le backend est hébergé sur :
Railway / Serveur dédié selon configuration de production.`,
            },
            {
              title: "3. Propriété Intellectuelle",
              content: `L'ensemble du contenu du site HelyaCare (textes, images, vidéos, graphismes, logos, icônes, sons, logiciels) est protégé par le droit d'auteur et les lois sur la propriété intellectuelle.

Toute reproduction, représentation, modification, publication, transmission ou dénaturation, totale ou partielle, du site ou de son contenu, par quelque procédé que ce soit et sur quelque support que ce soit, est interdite sans l'autorisation écrite préalable de HelyaCare.

La marque "HelyaCare" est une marque déposée. Toute utilisation non autorisée constitue une contrefaçon.`,
            },
            {
              title: "4. Responsabilité",
              content: `HelyaCare met tout en œuvre pour assurer l'exactitude et la mise à jour des informations diffusées sur son site. Cependant, HelyaCare ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations mises à disposition.

HelyaCare se réserve le droit de modifier les contenus du site à tout moment et sans préavis.

HelyaCare ne peut être tenu pour responsable de l'utilisation qui serait faite de ces informations, ni des dommages directs ou indirects qui pourraient en résulter.

Les compléments alimentaires vendus sur HelyaCare ne sont pas des médicaments et ne peuvent se substituer à un traitement médical prescrit. Consultez un professionnel de santé en cas de doute.`,
            },
            {
              title: "5. Liens Hypertextes",
              content: `Le site HelyaCare peut contenir des liens vers d'autres sites internet. HelyaCare n'est pas responsable du contenu de ces sites tiers et ne peut être tenu responsable des dommages ou préjudices résultant de leur consultation.

La mise en place de liens hypertextes pointant vers le site HelyaCare nécessite une autorisation préalable et écrite.`,
            },
            {
              title: "6. Droit Applicable",
              content: `Les présentes mentions légales sont régies par le droit sénégalais et le droit français.

En cas de litige, et après toute tentative de règlement amiable, les tribunaux compétents de Dakar (Sénégal) seront seuls compétents.`,
            },
            {
              title: "7. Protection des Données",
              content: `Conformément à la loi sénégalaise sur la Protection des Données Personnelles et au RGPD européen, vous disposez de droits sur vos données personnelles.

Pour exercer ces droits ou pour toute question relative à la protection de vos données, contactez notre Délégué à la Protection des Données :
privacy@helyacare.com

Pour plus d'informations, consultez notre Politique de Confidentialité.`,
            },
            {
              title: "8. Cookies",
              content: `Le site HelyaCare utilise des cookies techniques et analytiques pour améliorer votre expérience utilisateur. Vous pouvez gérer vos préférences de cookies depuis les paramètres de votre navigateur.

Pour plus d'informations, consultez notre Politique de Confidentialité.`,
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
            Document mis à jour le {lastUpdated}. Contact : <a href="mailto:care@helyacare.com" className="text-[#0F3D3E] underline">care@helyacare.com</a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
