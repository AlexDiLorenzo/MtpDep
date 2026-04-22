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
  { label: 'Flotte', href: '#flotte' },
  { label: 'Zones', href: '#zones' },
  { label: 'Actualités', href: '#news' },
  { label: 'Contact', href: '#contact' },
] as const;

// Photos hotlinkées depuis l'ancien WordPress en attendant
// une batch locale fournie par le client.
export const photos = {
  heroA9: 'https://montpellierdepannage.com/wp-content/uploads/2021/04/a9-avril21-4-1.jpg',
  accidentPL: 'https://montpellierdepannage.com/wp-content/uploads/2022/02/accident2.jpg',
  plateauVL: 'https://montpellierdepannage.com/wp-content/uploads/2020/04/Resized_21-1.jpg',
  bornesEV: 'https://montpellierdepannage.com/wp-content/uploads/2021/08/evbox-montpellier-1.jpg',
} as const;

export const certifications = {
  nfService: 'https://montpellierdepannage.com/wp-content/uploads/2024/05/NFS_Depannage-vehicules-legers-et-poids-lourds.webp',
  envol: 'https://montpellierdepannage.com/wp-content/uploads/2024/05/signature-titulaires-envol.webp',
  oleo100: 'https://montpellierdepannage.com/wp-content/uploads/elementor/thumbs/Visuel-RS-Oleo100-2023-MONTPELLIER-DEPANNAGE-800-qol3tq547eb1wu82do3kdqa9hmbloo01u3hvtw8qrg.png',
} as const;
