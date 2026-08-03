// ============================================================
// Contrat de contenu d'une langue traduite (EN, ES).
//
// Le français n'utilise PAS ce contrat : il garde ses pages et ses
// données historiques (data/services.ts, data/agences.ts, data/zones.ts),
// afin qu'aucune URL FR indexée ne change et qu'aucun texte FR ne soit
// réécrit au passage.
//
// Les langues traduites servent un périmètre volontairement resserré —
// accueil, services, couverture — plutôt qu'un clone intégral du site FR :
// une trentaine de pages étrangères peu recherchées diluerait le budget
// d'exploration sans capter de trafic. Cf. README de la section i18n.
// ============================================================

/** Une étape du déroulé d'intervention. */
export type LocalizedEtape = { titre: string; desc: string };

/** Une question / réponse — section FAQ + JSON-LD FAQPage. */
export type LocalizedFaq = { q: string; a: string };

/** Une fiche service traduite. */
export type LocalizedService = {
  /** Slug FRANÇAIS — clé de correspondance entre les langues. */
  slugFr: string;
  /** Slug dans cette langue — segment d'URL réel. */
  slug: string;
  /** Intitulé court — cartes, navigation, fil d'Ariane. */
  nom: string;
  /** Titre complet — H1 et <title>. */
  titre: string;
  /** Numéro d'ordre affiché. */
  tag: string;
  /** Résumé court — cartes et meta description. */
  resume: string;
  /** Paragraphes de présentation. */
  intro: string[];
  /** Étapes concrètes de l'intervention. */
  deroule: LocalizedEtape[];
  /** Questions fréquentes. */
  faq: LocalizedFaq[];
};

/** Libellés d'interface partagés par toutes les pages d'une langue. */
export type LocalizedUi = {
  /** Libellés de navigation. */
  navServices: string;
  navCoverage: string;
  navHome: string;
  /** CTA téléphone. */
  callNow: string;
  emergency: string;
  available: string;
  /** Sélecteur de langue. */
  languageLabel: string;
  /** Fil d'Ariane. */
  breadcrumbLabel: string;
  /** Sections récurrentes. */
  servicesHeading: string;
  stepsHeading: string;
  faqHeading: string;
  otherServices: string;
  backToServices: string;
  /** Pied de page. */
  footerServices: string;
  footerNetwork: string;
  footerLegal: string;
  footerFrenchSite: string;
  footerRights: string;
  /** Bandeau « site en français » vers la version FR complète. */
  fullSiteNotice: string;
  fullSiteLink: string;
  /** Accessibilité. */
  skipToContent: string;
};

/** Contenu de la page d'accueil traduite. */
export type LocalizedHome = {
  title: string;
  description: string;
  heroPill: string;
  heroTitle: string;
  heroTitleAccent: string;
  heroLead: string;
  heroReassure: string[];
  stats: { value: string; label: string; kicker: string }[];
  /** Bloc « pourquoi nous » / réassurance. */
  trustOverline: string;
  trustHeading: string;
  trustBody: string[];
  trustPoints: { titre: string; desc: string }[];
  /** Bloc services (introduit la grille). */
  servicesOverline: string;
  servicesHeading: string;
  servicesLead: string;
  /** Bloc couverture. */
  coverageOverline: string;
  coverageHeading: string;
  coverageLead: string;
  coverageCta: string;
  /** Bloc « que faire en cas de panne » — utile et très recherché. */
  breakdownOverline: string;
  breakdownHeading: string;
  breakdownSteps: { titre: string; desc: string }[];
  /** FAQ d'accueil. */
  faq: LocalizedFaq[];
  /** CTA final. */
  ctaTitle: string;
  ctaLead: string;
};

/** Contenu de la page couverture (agences + villes, page unique). */
export type LocalizedCoverage = {
  title: string;
  description: string;
  overline: string;
  heading: string;
  lead: string[];
  /** Titre du bloc listant les agences. */
  agencesHeading: string;
  agencesLead: string;
  /** Titre du bloc listant les villes desservies. */
  villesHeading: string;
  villesLead: string;
  /** Libellé « rattachée à ». */
  fromAgency: string;
  faq: LocalizedFaq[];
  ctaTitle: string;
  ctaLead: string;
};

/** Contenu de l'index des services. */
export type LocalizedServiceIndex = {
  title: string;
  description: string;
  overline: string;
  heading: string;
  lead: string;
};

/** L'ensemble du contenu d'une langue traduite. */
export type LocalizedContent = {
  ui: LocalizedUi;
  home: LocalizedHome;
  serviceIndex: LocalizedServiceIndex;
  services: LocalizedService[];
  coverage: LocalizedCoverage;
};
