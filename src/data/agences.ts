// ============================================================
// SOURCE DE VÉRITÉ — les 8 agences du réseau Montpellier Dépannage.
//
// Règle non-négociable : le site s'aligne sur les sociétés.
// Les raisons sociales, adresses et téléphones ci-dessous priment
// sur tout affichage. Ne rien inventer — modifier ici uniquement.
//
// Lunel Dépannage et Étoile Assistance sont des sociétés séparées :
// pas de page agence dédiée (cf. brief refonte SEO).
//
// Le bloc `contenu` porte le rédactionnel local de chaque page
// agence (intro, accès, prestations, communes, photos). Il doit
// rester UNIQUE par agence — pas de duplicate content entre agences.
// ============================================================

import { photos } from '../config/site';

export type AgencePhone = {
  /** Numéro formaté pour l'affichage, ex. « 04 67 71 07 20 ». */
  display: string;
  /** Lien tel: normalisé au format E.164, ex. « tel:+33467710720 ». */
  href: string;
  /** Étiquette affichée quand une agence expose plusieurs numéros. */
  label?: string;
};

/** Une prestation affichée sur la page agence — non cliquable. */
export type AgenceService = {
  /** Intitulé de la prestation. */
  nom: string;
  /** Description courte, spécifique à l'agence. */
  description: string;
};

/** Une photo réelle de l'agence (dimensions = anti-CLS au rendu). */
export type AgenceImage = {
  /** Chemin servi — toujours une clé de `photos` (config/site.ts). */
  src: string;
  width: number;
  height: number;
};

/** Rédactionnel local d'une page agence — unique par agence. */
export type AgenceContenu = {
  /** Paragraphes de présentation (section « L'agence de … »). */
  intro: string[];
  /** Description de l'accès, des axes routiers et du stationnement. */
  acces: string;
  /** Prestations proposées par l'agence (affichées non cliquables). */
  services: AgenceService[];
  /** Communes desservies — maillage SEO de proximité. */
  communes: string[];
  /** Photos réelles de l'agence — vide si non fournies par le client. */
  images: AgenceImage[];
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
  /** Rédactionnel local de la page agence. */
  contenu: AgenceContenu;
  /** Lien Google pour consulter / laisser un avis — absent si non fourni. */
  reviewUrl?: string;
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
    reviewUrl: 'https://maps.app.goo.gl/bsSnb6yBAg5UhT7r5',
    societe: 'MONTPELLIER DÉPANNAGE',
    nomCourt: 'Montpellier Garosud',
    adresse: { rue: '2501 Av de Maurin, ZAC Garosud', codePostal: '34070', ville: 'Montpellier' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 556.3, y: 395.4 },
    geo: { lat: 43.583382, lng: 3.872376 },
    principal: true,
    contenu: {
      intro: [
        "Installée dans la ZAC de Garosud, au sud de Montpellier, notre agence est le siège historique du réseau Montpellier Dépannage. Depuis 1956, nos équipes interviennent jour et nuit sur l'ensemble de l'agglomération, du cœur de ville aux grands axes qui la traversent.",
        "C'est ici que sont basés notre atelier mécanique, notre parc de plateaux pour véhicules légers et poids lourds, ainsi que notre flotte électrique dédiée aux zones piétonnes. Cette concentration de moyens nous permet de couvrir tous les types d'intervention sans délai de mobilisation, 24 h/24 et 7 j/7.",
      ],
      acces: "L'agence se situe avenue de Maurin, dans la ZAC de Garosud, à proximité immédiate de l'A709 et de la sortie Montpellier-Sud. L'accès poids lourds est aisé et un parking sécurisé permet le dépôt des véhicules en attente d'expertise ou de réparation.",
      services: [
        {
          nom: 'Remorquage VL',
          description: "Voitures en panne ou accidentées, sortie de sous-sols, plateaux rabaissés adaptés aux véhicules surbaissés et de prestige.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Flotte 4×4 équipée de bras de levage et de plateaux PL pour la récupération de tout gabarit, de jour comme de nuit.",
        },
        {
          nom: 'Dépannage autoroute',
          description: "Équipes agréées, partenaires des concessionnaires autoroutiers, pour une intervention rapide sur l'A709 et l'A9.",
        },
        {
          nom: 'Transport international',
          description: "Rapatriement de véhicules accidentés ou en panne vers la France, la Belgique, l'Italie et l'Espagne.",
        },
        {
          nom: 'Centre-ville & zones piétonnes',
          description: "Flotte électrique zéro émission, véhicule compact et scooters pour intervenir dans le cœur historique : Comédie, Antigone, Peyrou.",
        },
        {
          nom: 'Mécanique, GPL & climatisation',
          description: "Atelier intégré : entretien courant, installation de systèmes GPL et révision de la climatisation.",
        },
      ],
      communes: [
        'Montpellier', 'Lattes', 'Pérols', 'Castelnau-le-Lez', 'Le Crès',
        'Juvignac', 'Lavérune', 'Saint-Jean-de-Védas', 'Grabels', 'Clapiers',
        'Jacou', 'Vendargues', 'Mauguio', 'Pignan', 'Saint-Clément-de-Rivière',
      ],
      images: [
        { src: photos.flotteCamions, width: 1200, height: 800 },
      ],
    },
  },
  {
    slug: 'perols',
    reviewUrl: 'https://maps.app.goo.gl/eWBoGdKXRKibPzw97',
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
    contenu: {
      intro: [
        "L'agence de Pérols dessert la frange littorale de l'agglomération montpelliéraine, entre les étangs et les stations balnéaires. Idéalement placée entre Montpellier et l'aéroport, elle répond aux pannes et accidents sur un secteur à forte circulation tout au long de l'année.",
        "Notre site de Pérols dispose d'un atelier mécanique et d'une importante capacité poids lourds : on y traite aussi bien l'entretien et la réparation que le remorquage de véhicules légers et de gros porteurs. Une astreinte permanente garantit une intervention à toute heure, 24 h/24 et 7 j/7.",
      ],
      acces: "L'agence est rue Louis-Lépine, dans la zone d'activités de Pérols, à quelques minutes de l'aéroport Montpellier-Méditerranée et des grands axes du littoral. Un stationnement dédié accueille les véhicules légers comme les poids lourds.",
      services: [
        {
          nom: 'Mécanique, GPL & climatisation',
          description: "Atelier équipé : entretien, réparation, pose de systèmes GPL et révision de la climatisation.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Moyens de levage et plateaux adaptés aux gros porteurs, pour une récupération sur route comme en zone d'activités.",
        },
        {
          nom: 'Dépannage VL',
          description: "Prise en charge des voitures en panne ou accidentées sur le secteur littoral, avec dépôt à l'atelier ou au garage de votre choix.",
        },
      ],
      communes: [
        'Pérols', 'Lattes', 'Mauguio', 'Carnon', 'La Grande-Motte',
        'Palavas-les-Flots', 'Montpellier', 'Candillargues', 'Mudaison', 'Saint-Aunès',
      ],
      images: [
        { src: photos.agencePerols, width: 1360, height: 800 },
      ],
    },
  },
  {
    slug: 'laroque',
    reviewUrl: 'https://maps.app.goo.gl/EVbEdJxcWhGxLzkVA',
    societe: 'MONTPELLIER DÉPANNAGE LAROQUE',
    nomCourt: 'Laroque',
    adresse: { rue: "620 Avenue de l'Europe", codePostal: '34190', ville: 'Laroque' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 509.7, y: 259.9 },
    geo: { lat: 43.928018, lng: 3.715162 },
    contenu: {
      intro: [
        "Implantée à Laroque, dans la vallée de l'Hérault, notre agence couvre un secteur rural et vallonné où la rapidité d'intervention fait toute la différence. Elle assure le dépannage de proximité autour de Ganges, de Saint-Bauzille-de-Putois et des communes situées aux portes des Cévennes.",
        "Spécialisée dans le dépannage de véhicules légers et d'utilitaires, l'agence de Laroque connaît parfaitement les routes sinueuses et étroites de la vallée. Nos équipes interviennent 24 h/24 sur panne, accident ou véhicule immobilisé.",
      ],
      acces: "L'agence se trouve avenue de l'Europe, à l'entrée de Laroque, le long de l'axe Ganges – Saint-Martin-de-Londres (RD986). L'accès est direct et une zone de dépôt accueille les véhicules en attente.",
      services: [
        {
          nom: 'Dépannage VL',
          description: "Voitures en panne ou accidentées : intervention rapide sur les routes de la vallée de l'Hérault et acheminement vers le garage de votre choix.",
        },
        {
          nom: "Dépannage d'utilitaires",
          description: "Fourgons et véhicules utilitaires légers pris en charge sur l'ensemble du secteur, en ville comme sur les axes ruraux.",
        },
      ],
      communes: [
        'Laroque', 'Ganges', 'Cazilhac', 'Saint-Bauzille-de-Putois',
        'Moulès-et-Baucels', 'Brissac', 'Agonès', 'Montoulieu',
        'Saint-Jean-de-Buèges', 'Causse-de-la-Selle',
      ],
      images: [],
    },
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
    contenu: {
      intro: [
        "Seule agence du réseau implantée dans le Gard, Fournès dessert le Gard rhodanien et la basse vallée du Rhône. Sa position, entre Nîmes, Avignon et le pont du Gard, en fait un point d'appui stratégique pour les interventions sur les grands axes de la région.",
        "L'agence de Fournès traite aussi bien le remorquage de véhicules légers que celui des poids lourds, et intervient sur autoroute auprès des automobilistes comme des transporteurs. Une astreinte est assurée en permanence, 24 h/24 et 7 j/7.",
      ],
      acces: "L'agence est située au lieu-dit de la Pale, à Fournès, à proximité de Remoulins et des accès autoroutiers du Gard rhodanien. Une vaste zone de dépôt accueille les véhicules légers et les poids lourds.",
      services: [
        {
          nom: 'Dépannage autoroute A54',
          description: "Interventions rapides sur autoroute pour les automobilistes et les professionnels, en lien avec les services de sécurité.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Bras de levage et plateaux PL pour la prise en charge des gros porteurs, sur route comme sur autoroute.",
        },
        {
          nom: 'Remorquage VL',
          description: "Voitures en panne ou accidentées récupérées sur l'ensemble du Gard rhodanien.",
        },
      ],
      communes: [
        'Fournès', 'Remoulins', 'Vers-Pont-du-Gard', 'Castillon-du-Gard',
        'Estézargues', 'Théziers', 'Domazan', 'Saze', 'Meynes', 'Valliguières',
      ],
      images: [],
    },
  },
  {
    slug: 'villetelle',
    reviewUrl: 'https://maps.app.goo.gl/u1ej8ZCsX9ZBcPGs5',
    societe: 'VILLETELLE DÉPANNAGE',
    nomCourt: 'Villetelle',
    adresse: { rue: '154 Impasse du Campaillou', codePostal: '34400', ville: 'Villetelle' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 636.1, y: 357.4 },
    geo: { lat: 43.720914, lng: 4.140154 },
    contenu: {
      intro: [
        "À l'extrémité est de l'Hérault, l'agence de Villetelle veille sur le secteur de Lunel et la limite avec le Gard. Sa proximité immédiate avec l'échangeur de l'A9 lui permet d'intervenir sans délai sur l'un des axes les plus fréquentés du littoral méditerranéen.",
        "L'agence prend en charge le remorquage de véhicules légers comme de poids lourds, sur autoroute et sur le réseau secondaire. Nos équipes assurent une présence permanente, de jour comme de nuit.",
      ],
      acces: "L'agence se situe impasse du Campaillou à Villetelle, à quelques minutes de l'échangeur A9 de Gallargues et de la RN113. L'accès et le stationnement sont adaptés aux véhicules légers comme aux poids lourds.",
      services: [
        {
          nom: 'Dépannage autoroute A9',
          description: "Intervention rapide sur l'A9 et ses bretelles, pour les automobilistes et les transporteurs.",
        },
        {
          nom: 'Remorquage VL',
          description: "Voitures en panne ou accidentées prises en charge sur le secteur de Lunel et acheminées au garage de votre choix.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Plateaux et moyens de levage PL pour la récupération des gros porteurs, sur autoroute comme sur route.",
        },
      ],
      communes: [
        'Villetelle', 'Lunel', 'Lunel-Viel', 'Marsillargues', 'Saint-Just',
        'Saturargues', 'Saint-Sériès', 'Boisseron', 'Gallargues-le-Montueux',
        'Aigues-Vives', 'Sommières',
      ],
      images: [
        { src: photos.agenceVilletelle, width: 1021, height: 1020 },
        { src: photos.agenceVilletelleDepanneuse, width: 1360, height: 1020 },
      ],
    },
  },
  {
    slug: 'saint-georges-d-orques',
    reviewUrl: 'https://maps.app.goo.gl/ad3AQ6zaARWygKKH8',
    societe: "ST GEORGES D'ORQUES DÉPANNAGE",
    nomCourt: "St-Georges-d'Orques",
    adresse: { rue: '11 Rue du Four à Chaux', codePostal: '34680', ville: "Saint-Georges-d'Orques" },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 513.0, y: 398.0 },
    geo: { lat: 43.628716, lng: 3.767828 },
    contenu: {
      intro: [
        "À l'ouest de Montpellier, l'agence de Saint-Georges-d'Orques couvre le secteur viticole qui s'étend entre la ville et les premiers reliefs. Elle assure une présence rapide sur les communes résidentielles de l'ouest montpelliérain et leurs axes de liaison.",
        "L'agence intervient sur autoroute, notamment vers l'A75, ainsi que sur le remorquage de véhicules légers et de poids lourds. Une astreinte permanente garantit une prise en charge à toute heure, 7 j/7.",
      ],
      acces: "L'agence est rue du Four à Chaux, à Saint-Georges-d'Orques, à proximité de la RD5 et des accès vers l'A750 et l'A75. Une zone de dépôt sécurisée accueille les véhicules pris en charge.",
      services: [
        {
          nom: 'Dépannage autoroute A75',
          description: "Interventions rapides sur l'A75 et ses voies d'accès, pour les automobilistes comme pour les professionnels.",
        },
        {
          nom: 'Dépannage VL',
          description: "Voitures en panne ou accidentées récupérées sur l'ouest montpelliérain et conduites au garage de votre choix.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Moyens de levage et plateaux PL pour la prise en charge des gros porteurs.",
        },
      ],
      communes: [
        "Saint-Georges-d'Orques", 'Juvignac', 'Lavérune', 'Pignan',
        'Murviel-lès-Montpellier', 'Saint-Paul-et-Valmalle', 'Montarnaud',
        'Grabels', 'Cournonterral', 'Cournonsec', 'Fabrègues',
      ],
      images: [],
    },
  },
  {
    slug: 'clermont-l-herault',
    reviewUrl: 'https://maps.app.goo.gl/BZWjviTi3J5TpmF69',
    societe: "CLERMONT L'HÉRAULT DÉPANNAGE",
    nomCourt: "Clermont-l'Hérault",
    adresse: { rue: '1790 ZAC de la Salamane', codePostal: '34800', ville: "Clermont-l'Hérault" },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 419.1, y: 388.2 },
    // TODO Phase 2 : géocodage précis de la ZAC de la Salamane.
    // Valeur actuelle = centre-ville de Clermont-l'Hérault (approximatif).
    geo: { lat: 43.626318, lng: 3.430241 },
    contenu: {
      intro: [
        "Au cœur du Clermontais, l'agence de Clermont-l'Hérault dessert un vaste bassin rural organisé autour du lac du Salagou et de la vallée de l'Hérault. Sa position sur l'A75 en fait un relais essentiel pour les automobilistes et les transporteurs qui empruntent cet axe nord-sud.",
        "L'agence assure le remorquage de véhicules légers et de poids lourds, ainsi que le dépannage sur autoroute. Nos équipes connaissent parfaitement le secteur, ses petites communes et ses routes de causse, et interviennent 24 h/24.",
      ],
      acces: "L'agence se trouve dans la ZAC de la Salamane à Clermont-l'Hérault, à proximité immédiate de l'A75 et de ses sorties Clermont-l'Hérault. L'accès poids lourds est aisé et une zone de dépôt accueille les véhicules en attente.",
      services: [
        {
          nom: 'Remorquage VL',
          description: "Voitures en panne ou accidentées prises en charge dans le Clermontais et acheminées vers le garage de votre choix.",
        },
        {
          nom: 'Dépannage autoroute A75',
          description: "Intervention rapide sur l'A75 et ses échangeurs, pour les automobilistes et les professionnels du transport.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Bras de levage et plateaux PL pour la récupération des gros porteurs, sur route comme sur autoroute.",
        },
      ],
      communes: [
        "Clermont-l'Hérault", 'Canet', 'Paulhan', 'Aspiran', 'Nébian',
        'Brignac', 'Ceyras', 'Saint-Félix-de-Lodez', 'Villeneuvette',
        'Mourèze', 'Cabrières', 'Lacoste',
      ],
      images: [],
    },
  },
  {
    slug: 'saint-jean-de-vedas-a9',
    societe: 'AGENCE A9 — ST JEAN DE VÉDAS',
    nomCourt: 'St-Jean-de-Védas (A9)',
    adresse: { rue: 'Lieu-dit Les Jasses', codePostal: '34430', ville: 'Saint-Jean-de-Védas' },
    departement: 'Hérault',
    phones: [tel('04 67 42 14 31')],
    carte: { x: 531.0, y: 421.0 },
    // TODO Phase 2 : géocodage précis du lieu-dit Les Jasses.
    // Valeur actuelle = centre-ville de St-Jean-de-Védas (approximatif).
    geo: { lat: 43.575179, lng: 3.82642 },
    contenu: {
      intro: [
        "Implantée aux portes sud-ouest de Montpellier, l'agence de Saint-Jean-de-Védas est dédiée au dépannage autoroutier. Elle veille en priorité sur l'A9 et l'A709, deux des axes les plus circulés du littoral méditerranéen.",
        "Positionnée pour intervenir au plus vite sur le réseau autoroutier, l'agence prend également en charge le remorquage de véhicules légers et de poids lourds sur le secteur. Une présence permanente est assurée, 24 h/24 et 7 j/7.",
      ],
      acces: "L'agence est située au lieu-dit Les Jasses à Saint-Jean-de-Védas, à proximité immédiate de l'A9, de l'A709 et de la sortie Saint-Jean-de-Védas. L'accès direct au réseau autoroutier permet une mobilisation rapide.",
      services: [
        {
          nom: 'Dépannage autoroute A9',
          description: "Cœur de métier de l'agence : intervention rapide sur l'A9 et l'A709, en lien avec les concessionnaires autoroutiers et les services de sécurité.",
        },
        {
          nom: 'Remorquage VL',
          description: "Voitures en panne ou accidentées prises en charge sur autoroute et sur le secteur de Saint-Jean-de-Védas.",
        },
        {
          nom: 'Remorquage poids lourds',
          description: "Plateaux et moyens de levage PL pour la récupération des gros porteurs sur le réseau autoroutier.",
        },
      ],
      communes: [
        'Saint-Jean-de-Védas', 'Lavérune', 'Fabrègues', 'Saussan',
        'Cournonsec', 'Cournonterral', 'Pignan', 'Villeneuve-lès-Maguelone',
        'Lattes', 'Montpellier',
      ],
      images: [],
    },
  },
];

/** Retrouve une agence par son slug. */
export const getAgence = (slug: string): Agence | undefined =>
  agences.find((a) => a.slug === slug);

/** L'agence principale du réseau (Montpellier Garosud). */
export const agencePrincipale: Agence = agences.find((a) => a.principal) ?? agences[0];
