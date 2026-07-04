// Source unique de vérité pour toutes les informations de contact et de marque
// affichées sur le site. Éditer ici avant toute mise en production.

export const site = {
  name: 'Montpellier Dépannage',
  shortName: 'MDP',
  tagline: 'Remorquage · 24/7 · Entreprise familiale depuis 1956',

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
} as const;

// Navigation principale — pages multi-pages (architecture SEO).
export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Agences', href: '/agences/' },
] as const;

// Photos locales fournies par le client (dossier public/img/).
export const photos = {
  // Iconiques Montpellier
  heroComedie: '/img/hero-comedie.jpg',           // Aston Martin Place de la Comédie
  flotteCamions: '/img/flotte-camions.jpg',       // Flotte alignée vue de face
  peyrou: '/img/peyrou-vertical.jpg',             // Camion devant l'Arc du Peyrou (vertical)
  astonAntigone: '/img/aston-antigone.png',       // Aston Martin quartier Antigone
  porscheCayman: '/img/porsche-cayman.jpg',       // Porsche Cayman + plateau MDP
  flotteElectrique: '/img/flotte-electrique.jpg', // Petite voiture + scooters électriques MDP

  // Interventions terrain
  interventionA9: '/img/intervention-a9.jpg',     // Autoroute A9
  plRecuperation: '/img/pl-recuperation.jpg',     // Poids lourd dans le fossé
  transportInternational: '/img/transport-international.jpg', // Transport international / rapatriement

  // Photos d'agences (fournies par le client, optimisées en JPEG)
  agencePerols: '/img/agence-perols.jpg',                       // Site de Pérols
  agenceVilletelle: '/img/agence-villetelle.jpg',               // Site de Villetelle
  agenceVilletelleDepanneuse: '/img/agence-villetelle-depanneuse.jpg', // Dépanneuse à Villetelle

  // Raccourci avis (page d'accueil)
  qrAvis: '/img/qr-avis.png',                     // QR code avis Google
} as const;

