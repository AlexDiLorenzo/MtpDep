// Source unique de vérité pour toutes les informations de contact et de marque
// affichées sur le site. Éditer ici avant toute mise en production.

export const site = {
  name: 'Montpellier Dépannage',
  shortName: 'MDP',
  foundedYear: 1956,
  tagline: 'Remorquage · 24/7 · Depuis 1956',

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

export const nav = [
  { label: 'Services', href: '#services' },
  { label: 'Capacité', href: '#capacite' },
  { label: 'Zones', href: '#zones' },
  { label: 'Contact', href: '#contact' },
] as const;

// Photos locales fournies par le client (dossier public/img/).
export const photos = {
  heroA9: '/img/intervention-a9.jpg',
  flotteDepot: '/img/flotte-depot.jpg',
  porschePlateau: '/img/porsche-plateau.jpg',
  plRecuperation: '/img/pl-recuperation.jpg',
  plRenversement: '/img/pl-renversement.jpg',
} as const;

