// ============================================================
// SOURCE DE VÉRITÉ — les 8 agences du réseau Montpellier Dépannage.
//
// Règle non-négociable : le site s'aligne sur les sociétés.
// Les raisons sociales, adresses et téléphones ci-dessous priment
// sur tout affichage. Ne rien inventer — modifier ici uniquement.
//
// Lunel Dépannage et Étoile Assistance sont des sociétés séparées :
// pas de page agence dédiée (cf. brief refonte SEO).
// ============================================================

export type AgencePhone = {
  /** Numéro formaté pour l'affichage, ex. « 04 67 71 07 20 ». */
  display: string;
  /** Lien tel: normalisé au format E.164, ex. « tel:+33467710720 ». */
  href: string;
  /** Étiquette affichée quand une agence expose plusieurs numéros. */
  label?: string;
};

export type Agence = {
  /** Segment d'URL : /agences/{slug}/ */
  slug: string;
  /** Raison sociale exacte. */
  societe: string;
  /** Nom court — fil d'Ariane, marqueurs de carte, titres. */
  nomCourt: string;
  adresse: {
    rue: string;
    codePostal: string;
    ville: string;
  };
  /** Département de rattachement. */
  departement: 'Hérault' | 'Gard';
  /** Téléphones — le premier élément est toujours le numéro principal. */
  phones: AgencePhone[];
  /** Coordonnées projetées pour la carte SVG (viewBox de CoverageBand). */
  carte: { x: number; y: number };
  /** Coordonnées géographiques réelles — JSON-LD GeoCoordinates. */
  geo: { lat: number; lng: number } | null;
  /** Site principal du réseau (Montpellier Garosud). */
  principal?: boolean;
};

/** Construit un AgencePhone à partir d'un numéro français affiché. */
const tel = (display: string, label?: string): AgencePhone => ({
  display,
  href: 'tel:+33' + display.replace(/\D/g, '').replace(/^0/, ''),
  ...(label ? { label } : {}),
});

export const agences: Agence[] = [
  {
    slug: 'montpellier-garosud',
    societe: 'MONTPELLIER DÉPANNAGE',
    nomCourt: 'Montpellier Garosud',
    adresse: { rue: '2501 Av de Maurin, ZAC Garosud', codePostal: '34070', ville: 'Montpellier' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 556.3, y: 395.4 },
    geo: { lat: 43.583382, lng: 3.872376 },
    principal: true,
  },
  {
    slug: 'perols',
    societe: 'PÉROLS DÉPANNAGE',
    nomCourt: 'Pérols',
    adresse: { rue: 'Rue Louis Lépine', codePostal: '34470', ville: 'Pérols' },
    departement: 'Hérault',
    phones: [
      tel('04 67 71 07 20', 'Ligne agence Pérols'),
      tel('04 67 42 14 31', 'Standard réseau 24/7'),
    ],
    carte: { x: 578.3, y: 419.7 },
    geo: { lat: 43.575945, lng: 3.946692 },
  },
  {
    slug: 'laroque',
    societe: 'MONTPELLIER DÉPANNAGE LAROQUE',
    nomCourt: 'Laroque',
    adresse: { rue: "620 Avenue de l'Europe", codePostal: '34190', ville: 'Laroque' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 509.7, y: 259.9 },
    geo: { lat: 43.928018, lng: 3.715162 },
  },
  {
    slug: 'fournes',
    societe: 'FOURNÈS DÉPANNAGE',
    nomCourt: 'Fournès',
    adresse: { rue: 'Lieu-dit de la Pale', codePostal: '30210', ville: 'Fournès' },
    departement: 'Gard',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 782.1, y: 263.2 },
    geo: { lat: 43.929063, lng: 4.6013 },
  },
  {
    slug: 'villetelle',
    societe: 'VILLETELLE DÉPANNAGE',
    nomCourt: 'Villetelle',
    adresse: { rue: '154 Impasse du Campaillou', codePostal: '34400', ville: 'Villetelle' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 636.1, y: 357.4 },
    geo: { lat: 43.720914, lng: 4.140154 },
  },
  {
    slug: 'saint-georges-d-orques',
    societe: "ST GEORGES D'ORQUES DÉPANNAGE",
    nomCourt: "St-Georges-d'Orques",
    adresse: { rue: '11 Rue du Four à Chaux', codePostal: '34680', ville: "Saint-Georges-d'Orques" },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 527.0, y: 393.5 },
    geo: { lat: 43.628716, lng: 3.767828 },
  },
  {
    slug: 'clermont-l-herault',
    societe: "CLERMONT L'HÉRAULT DÉPANNAGE",
    nomCourt: "Clermont-l'Hérault",
    adresse: { rue: '1790 ZAC de la Salamane', codePostal: '34800', ville: "Clermont-l'Hérault" },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 419.1, y: 388.2 },
    // TODO Phase 2 : géocodage précis de la ZAC de la Salamane.
    // Valeur actuelle = centre-ville de Clermont-l'Hérault (approximatif).
    geo: { lat: 43.626318, lng: 3.430241 },
  },
  {
    slug: 'saint-jean-de-vedas-a9',
    societe: 'AGENCE A9 — ST JEAN DE VÉDAS',
    nomCourt: 'St-Jean-de-Védas (A9)',
    adresse: { rue: 'Lieu-dit Les Jasses', codePostal: '34430', ville: 'Saint-Jean-de-Védas' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 540.5, y: 410.1 },
    // TODO Phase 2 : géocodage précis du lieu-dit Les Jasses.
    // Valeur actuelle = centre-ville de St-Jean-de-Védas (approximatif).
    geo: { lat: 43.575179, lng: 3.82642 },
  },
];

/** Retrouve une agence par son slug. */
export const getAgence = (slug: string): Agence | undefined =>
  agences.find((a) => a.slug === slug);

/** L'agence principale du réseau (Montpellier Garosud). */
export const agencePrincipale: Agence = agences.find((a) => a.principal) ?? agences[0];
