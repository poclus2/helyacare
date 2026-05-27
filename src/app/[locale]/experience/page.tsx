"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslations } from "next-intl";
import { useState } from "react";
import "./experience.css";

export default function ExperiencePage() {
  const t = useTranslations("Experience");
  const doctors = t.raw("experts.doctors") as { name: string; role: string; quote: string }[];
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  const [activeTab, setActiveTab] = useState(0);
  const tabs = ["Efficacité", "Pureté", "Innovation"];

  return (
    <div className="seed-page">
      <Header />

      {/* 1. Hero Centered */}
      <section className="seed-hero-centered">
        <img 
          src="https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?q=80&w=2038&auto=format&fit=crop" 
          alt="HelyaCare Experience" 
        />
        <div className="seed-hero-overlay" />
        <div className="seed-hero-centered-content">
          <p className="seed-tag" style={{ color: '#CBF27A', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>L'Expérience HelyaCare</p>
          <h1 className="seed-hero-title-huge">L'EXPÉRIENCE</h1>
        </div>
      </section>

      {/* 2. Intro Science (Split) */}
      <section className="seed-split-section">
        <div className="seed-split-container">
          <div className="seed-split-text">
            <span className="seed-tag">La Science</span>
            <h2 className="seed-split-title">{t("hero.title")}</h2>
            <p className="seed-split-desc">{t("hero.subtitle")}</p>
            <div className="seed-quote-box">
              <p className="seed-quote-text">« Une approche révolutionnaire qui relie la nature et vos biomarqueurs. »</p>
              <div className="seed-quote-author">
                <span style={{ color: '#E56B2D' }}>✓</span> Comité Médical HelyaCare
              </div>
            </div>
          </div>
          <div>
            <img src="/images/experience/experience_clinical_lab.png" alt="Laboratoire HelyaCare" className="seed-split-image" />
          </div>
        </div>
      </section>

      {/* 3. Bannière Orange */}
      <section className="seed-banner-orange">
        <div className="seed-banner-container">
          <div>
            <span className="seed-tag" style={{ color: '#FFF' }}>Pureté Botanique</span>
            <h2 className="seed-banner-title">Conçu pour l'efficacité absolue</h2>
            <p className="seed-banner-desc">
              Nous avons extrait les composants les plus actifs de la nature africaine et mondiale pour vous offrir des résultats tangibles, sans compromis sur la pureté.
            </p>
          </div>
          <div>
            <img src="/images/products/crave-control/macro.png" alt="Flacon Crave Control" className="seed-banner-floating-img" />
          </div>
        </div>
      </section>

      {/* 4. Action / Drinkable (Split Inversé) */}
      <section className="seed-split-section">
        <div className="seed-split-container">
          <div className="seed-split-text">
            <span className="seed-tag">Assimilation</span>
            <h2 className="seed-split-title">L'intelligence de la nature</h2>
            <p className="seed-split-desc">
              Chaque capsule contient des extraits standardisés, garantissant une concentration optimale en principes actifs pour une biodisponibilité maximale.
            </p>
          </div>
          <div>
            <img src="/images/experience/experience_bento_botanical.png" alt="Ingrédients botaniques" className="seed-split-image" style={{ aspectRatio: '1/1', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* 5. Témoignages */}
      <section className="seed-testimonials-section">
        <div className="seed-testimonials-grid">
          <div className="seed-testimonial-card">
            <img src="/images/mission_botanical_field.png" alt="Champ" className="seed-testimonial-bg" />
            <div className="seed-testimonial-overlay" />
            <div className="seed-testimonial-content">
              <p className="seed-testimonial-quote">« Je ressens enfin une énergie constante, sans la nervosité du café. »</p>
              <p className="seed-testimonial-author">Sarah M., Patiente HelyaCare</p>
            </div>
          </div>
          <div className="seed-testimonial-card">
            <img src="https://images.unsplash.com/photo-1534062483808-0138d6df0266?q=80&w=2000" alt="Person" className="seed-testimonial-bg" />
            <div className="seed-testimonial-overlay" />
            <div className="seed-testimonial-content">
              <p className="seed-testimonial-quote">« Le suivi par l'IA a complètement changé mon rapport à mon alimentation. »</p>
              <p className="seed-testimonial-author">David T., Ambassadeur</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Onglets & Science */}
      <section className="seed-science-section">
        <div className="seed-science-header">
          <span className="seed-tag">La Méthode</span>
          <h2 className="seed-science-title">Comment HelyaCare agit sur votre corps</h2>
          <p style={{ color: '#666' }}>Une approche en 3 étapes basées sur vos données.</p>
        </div>

        <div className="seed-tabs-container">
          {tabs.map((tab, idx) => (
            <button 
              key={idx} 
              className={`seed-tab ${activeTab === idx ? 'active' : ''}`}
              onClick={() => setActiveTab(idx)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="seed-science-ui-box">
          <div>
            <div className="seed-ui-column-title">1. Analyse IA</div>
            <p className="seed-ui-column-desc">Vos données de santé sont croisées par notre algorithme propriétaire pour déterminer vos carences exactes.</p>
            
            <div className="seed-ui-column-title" style={{ marginTop: '30px' }}>2. Sélection Botanique</div>
            <p className="seed-ui-column-desc">Sélection rigoureuse d'extraits naturels certifiés, formulés pour travailler en synergie.</p>
          </div>
          <div className="seed-ui-center-img">
            <img src="/images/experience/experience_bento_data.png" style={{ borderRadius: '50%', aspectRatio: '1/1', objectFit: 'cover' }} alt="IA Analysis" />
          </div>
          <div>
            <div className="seed-ui-column-title">3. Dosage de précision</div>
            <p className="seed-ui-column-desc">Ajustement au milligramme près pour correspondre à vos besoins métaboliques réels.</p>
            
            <div className="seed-ui-column-title" style={{ marginTop: '30px' }}>4. Résultats cliniques</div>
            <p className="seed-ui-column-desc">Suivi en temps réel de votre évolution via l'application HelyaCare.</p>
          </div>
        </div>
      </section>

      {/* 7. Comparaison */}
      <section className="seed-comparison-section">
        <span className="seed-tag">Différence</span>
        <h2 className="seed-science-title" style={{ marginBottom: '60px' }}>Pourquoi choisir HelyaCare ?</h2>
        
        <div className="seed-comparison-table-wrapper">
          <table className="seed-comparison-table">
            <thead>
              <tr>
                <th></th>
                <th>
                  <img src="/images/products/crave-control/macro.png" alt="HelyaCare" className="seed-comparison-product-img" />
                  <br />HelyaCare
                </th>
                <th>
                  <div style={{ height: '80px', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', marginBottom: '10px' }}>
                    <div style={{ padding: '20px', background: '#F7F6F2', borderRadius: '8px' }}>Pilules standard</div>
                  </div>
                  Vitamines Classiques
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Origine</td>
                <td className="seed-check">Plantes 100% Naturelles</td>
                <td>Synthétique</td>
              </tr>
              <tr>
                <td>Personnalisation</td>
                <td className="seed-check">Basée sur l'IA</td>
                <td>Générique</td>
              </tr>
              <tr>
                <td>Biodisponibilité</td>
                <td className="seed-check">Haute (Extraits fluides)</td>
                <td>Faible (Comprimés secs)</td>
              </tr>
              <tr>
                <td>Suivi</td>
                <td className="seed-check">Application intégrée</td>
                <td>Aucun</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* 8. Panel Médical */}
      <section className="seed-experts-section">
        <div className="seed-experts-container">
          <div className="seed-split-text">
            <span className="seed-tag">Les Experts</span>
            <h2 className="seed-split-title">{t("experts.title")}</h2>
            <p className="seed-split-desc">
              Chaque formule est validée par notre comité médical indépendant, composé de médecins, pharmaciens et chercheurs de renommée internationale.
            </p>
          </div>
          <div className="seed-experts-photos">
            {doctors.slice(0, 2).map((doc, idx) => (
              <div key={idx} className="seed-expert-portrait">
                <img src={`/images/experience/experience_dr_${idx + 2}_1776847933658.png`} alt={doc.name} onError={(e) => { e.currentTarget.src = "/images/experience/experience_doctors_panel_new.png" }} />
                <div className="seed-expert-info">
                  <div className="seed-expert-name">{doc.name}</div>
                  <div className="seed-expert-role">{doc.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. Dark Ambassador */}
      <section className="seed-dark-ambassador">
        <img src="/images/experience/experience_doctors_panel_new.png" alt="Standard of Excellence" className="seed-dark-ambassador-bg" />
        <div className="seed-dark-ambassador-content">
          <span className="seed-dark-tag">Validation Clinique</span>
          <h2 className="seed-dark-title">Le standard d'excellence</h2>
          <p className="seed-dark-desc">
            Nous refusons le compromis. Si un ingrédient n'a pas prouvé son efficacité dans des études randomisées en double aveugle, il ne rentre pas dans nos flacons.
          </p>
        </div>
      </section>

      {/* 10. Clinical Evidence (Cartes empilées) */}
      <section className="seed-clinical-section">
        <div className="seed-clinical-header">
          <span className="seed-tag">Études</span>
          <h2 className="seed-clinical-title">{t("clinical.title")}</h2>
        </div>

        <div className="seed-clinical-cards">
          
          <div className="seed-clinical-card-large">
            <div className="seed-clinical-card-large-top">
              <div>
                <span className="seed-tag">Méta-analyse</span>
                <h3 className="seed-clinical-card-title">Impact sur la régulation métabolique globale</h3>
                <p className="seed-clinical-card-desc">
                  Nos études internes et externes montrent une corrélation forte entre l'utilisation de nos extraits de griffonia et de safran sur la gestion du stress et du poids.
                </p>
              </div>
              <div>
                <img src="/images/experience/experience_bento_data.png" alt="Graph" className="seed-clinical-chart-img" style={{ borderRadius: '12px' }} />
              </div>
            </div>
            <div className="seed-clinical-stats">
              <div className="seed-stat-block">
                <h4>95%</h4>
                <p>Amélioration du sommeil</p>
              </div>
              <div className="seed-stat-block">
                <h4>87%</h4>
                <p>Réduction des envies</p>
              </div>
              <div className="seed-stat-block">
                <h4>75%</h4>
                <p>Gain d'énergie</p>
              </div>
            </div>
          </div>

          <div className="seed-clinical-card-horizontal">
            <div>
              <span className="seed-tag">Botanique</span>
              <h3 className="seed-clinical-card-title">Pureté des extraits : Analyse spectrographique</h3>
              <p className="seed-clinical-card-desc">
                Chaque lot est testé pour garantir l'absence de métaux lourds et une concentration parfaite en principes actifs.
              </p>
              <a href="#" className="seed-read-more">Lire l'étude &rarr;</a>
            </div>
            <img src="/images/experience/experience_science_journal_new.png" alt="Journal scientifique" />
          </div>

          <div className="seed-clinical-card-horizontal">
            <div>
              <span className="seed-tag">Technologie</span>
              <h3 className="seed-clinical-card-title">La précision du profilage IA HelyaCare</h3>
              <p className="seed-clinical-card-desc">
                Comment notre algorithme surpasse les questionnaires standards de l'industrie pour personnaliser vos cures.
              </p>
              <a href="#" className="seed-read-more">Lire l'étude &rarr;</a>
            </div>
            <img src="/images/experience/experience_ai_phone_new.png" alt="IA" />
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
