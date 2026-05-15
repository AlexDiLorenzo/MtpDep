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
  url: 'https://montpellierdepannage.com',
} as const;

// Navigation principale — pages multi-pages (architecture SEO).
export const nav = [
  { label: 'Services', href: '/services/' },
  { label: 'Agences', href: '/agences/' },
  { label: 'Contact', href: '/contact/' },
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
  plRenversement: '/img/pl-renversement.jpg',     // PL renversé
} as const;

