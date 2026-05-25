// ============================================================
// Générateurs de données structurées JSON-LD (schema.org).
//
// Centralise tous les schémas du site pour garantir leur cohérence.
// Les composants/pages passent le résultat à BaseLayout via `jsonLd`.
// ============================================================

import { site } from '../config/site';
import { agences, agencePrincipale, type Agence } from '../data/agences';
import type { Service } from '../data/services';

/** Spécification d'ouverture 24h/24, 7j/7. */
const opening24_7 = {
  '@type': 'OpeningHoursSpecification',
  dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  opens: '00:00',
  closes: '23:59',
};

/** URL absolue d'une page agence. */
export const agenceUrl = (slug: string): string => `${site.url}/agences/${slug}/`;

/** URL absolue d'une page service. */
export const serviceUrl = (slug: string): string => `${site.url}/services/${slug}/`;

/** PostalAddress schema.org d'une agence. */
function postalAddress(a: Agence) {
  return {
    '@type': 'PostalAddress',
    streetAddress: a.adresse.rue,
    postalCode: a.adresse.codePostal,
    addressLocality: a.adresse.ville,
    addressRegion: a.departement,
    addressCountry: 'FR',
  };
}

/**
 * Schéma Organization global, listant les 8 agences en subOrganization.
 * À placer sur la home et sur /agences/.
 */
export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${site.url}/#organization`,
    name: site.name,
    url: site.url,
    logo: `${site.url}/img/logo-mdp.png`,
    image: `${site.url}/img/logo-mdp.png`,
    description:
      "Remorquage et dépannage 24h/24, 7j/7 à Montpellier et dans l'Hérault et le Gard. Plateaux VL et PL, autoroute A9, transport international. Plus de 30 ans d'expérience.",
    telephone: site.phone.display,
    email: site.email.display,
    address: postalAddress(agencePrincipale),
    subOrganization: agences.map((a) => ({
      '@type': 'AutomotiveBusiness',
      '@id': `${agenceUrl(a.slug)}#business`,
      name: a.societe,
      url: agenceUrl(a.slug),
      telephone: a.phones[0].display,
      address: postalAddress(a),
    })),
  };
}

/** Schéma AutomotiveBusiness d'une page agence. */
export function automotiveBusinessSchema(a: Agence) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AutomotiveBusiness',
    '@id': `${agenceUrl(a.slug)}#business`,
    name: a.societe,
    url: agenceUrl(a.slug),
    image: `${site.url}/og-default.jpg`,
    telephone: a.phones[0].display,
    address: postalAddress(a),
    ...(a.geo
      ? { geo: { '@type': 'GeoCoordinates', latitude: a.geo.lat, longitude: a.geo.lng } }
      : {}),
    openingHoursSpecification: [opening24_7],
    priceRange: '€€',
    areaServed: { '@type': 'City', name: a.adresse.ville },
    parentOrganization: {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
    },
  };
}

/** Schéma Service d'une page service. */
export function serviceSchema(s: Service) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: s.titre,
    serviceType: s.nom,
    url: serviceUrl(s.slug),
    provider: {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
    },
    areaServed: [
      { '@type': 'AdministrativeArea', name: 'Hérault' },
      { '@type': 'AdministrativeArea', name: 'Gard' },
    ],
  };
}

/** Élément de fil d'Ariane (nom + chemin relatif ou URL absolue). */
export type Crumb = { name: string; url: string };

/** Schéma BreadcrumbList à partir d'une liste de crumbs. */
export function breadcrumbSchema(items: Crumb[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url.startsWith('http') ? it.url : `${site.url}${it.url}`,
    })),
  };
}
