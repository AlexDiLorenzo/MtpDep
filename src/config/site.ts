// Source unique de vérité pour toutes les informations de contact et de marque
// affichées sur le site. Éditer ici avant toute mise en production.

export const site = {
  name: 'Montpellier Dépannage',
  shortName: 'MDP',
  tagline: 'Remorquage · 24/7 · Plus de 30 ans d’expérience',

  phone: {
    display: '04 67 42 14 31',
    href: 'tel:+33467421431',
  },

  email: {
    display: 'contact@montpellierdepannage.com',
    href: 'mailto:contact@montpellierdepannage.com',
  },

  address: {
    street: '2501 Av de Maurin',
    postalCode: '34070',
    city: 'Montpellier',
    region: 'Hérault',
    country: 'FR',
  },

  hours: '24/7',
  url: 'https://www.montpellierdepannage.com',

  legal: {
    companyName: 'MONTPELLIER DÉPANNAGE',
    legalForm: 'SAS',
    capital: '480 000 €',
    siren: '382 482 404',
    siret: '382 482 404 00078',
    rcs: '382 482 404 RCS Montpellier',
    vat: 'FR80 382 482 404',
    publicationDirector: 'Norbert Di Lorenzo',
  },
} as const;

// Navigation principale — pages multi-pages (architecture SEO).
export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Agences', href: '/agences/' },
  { label: 'Zones d’intervention', href: '/depannage/' },
] as const;

// Photos locales fournies par le client (dossier public/img/).
export const photos = {
  // Iconiques Montpellier
  heroComedie: '/img/hero-comedie.webp',           // Aston Martin Place de la Comédie
  flotteCamions: '/img/flotte-camions.webp',       // Flotte alignée vue de face
  peyrou: '/img/peyrou-vertical.webp',             // Camion devant l'Arc du Peyrou (vertical)
  astonAntigone: '/img/aston-antigone.webp',       // Aston Martin quartier Antigone
  porscheCayman: '/img/porsche-cayman.webp',       // Porsche Cayman + plateau MDP
  flotteElectrique: '/img/flotte-electrique.webp', // Petite voiture + scooters électriques MDP

  // Interventions terrain
  interventionA9: '/img/intervention-a9.webp',     // Autoroute A9
  plRecuperation: '/img/pl-recuperation.webp',     // Poids lourd dans le fossé
  transportInternational: '/img/transport-international.webp', // Transport international / rapatriement

  // Photos d'agences (fournies par le client, optimisées en JPEG)
  agencePerols: '/img/agence-perols.webp',                       // Site de Pérols
  agenceVilletelle: '/img/agence-villetelle.webp',               // Site de Villetelle
  agenceVilletelleDepanneuse: '/img/agence-villetelle-depanneuse.webp', // Dépanneuse à Villetelle

  // Raccourci avis (page d'accueil)
  qrAvis: '/img/qr-avis.png',                     // QR code avis Google
} as const;
