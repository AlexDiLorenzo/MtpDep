// ============================================================
// SOURCE UNIQUE DE VÉRITÉ — internationalisation (FR / EN / ES).
//
// Le français est la langue par défaut et reste servi à la racine
// (`/`), sans préfixe : les URL FR déjà indexées ne bougent pas.
// L'anglais et l'espagnol vivent sous `/en/` et `/es/`.
//
// PRINCIPE — les URL alternatives ne sont JAMAIS devinées. Chaque page
// traduite déclare une clé de route (`RouteKey`) ; `alternatesFor()`
// résout les URL réellement existantes dans chaque langue. Une page qui
// n'existe pas dans une langue est absente des `hreflang` : Google exige
// des alternates bidirectionnels et vérifiables, un lien vers une page
// inexistante invalide tout le groupe.
//
// PAS DE REDIRECTION AUTOMATIQUE par IP ou Accept-Language : Google
// documente explicitement que cela empêche l'exploration des versions
// localisées. Le choix de langue est laissé à l'utilisateur (sélecteur
// dans l'en-tête) et à Google (hreflang).
// ============================================================

import { site } from '../config/site';

export const locales = ['fr', 'en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

/** Métadonnées d'affichage et balisage par langue. */
export const localeMeta: Record<
  Locale,
  {
    /** Attribut `lang` du <html> et valeur `hreflang`. */
    lang: string;
    /** Valeur `og:locale`. */
    ogLocale: string;
    /** Nom de la langue dans cette langue — sélecteur. */
    label: string;
    /** Abréviation affichée dans le sélecteur compact. */
    short: string;
  }
> = {
  fr: { lang: 'fr', ogLocale: 'fr_FR', label: 'Français', short: 'FR' },
  en: { lang: 'en', ogLocale: 'en_GB', label: 'English', short: 'EN' },
  es: { lang: 'es', ogLocale: 'es_ES', label: 'Español', short: 'ES' },
};

/**
 * Clés de route — une par page ayant au moins une traduction.
 * `service:<slugFr>` est généré dynamiquement (cf. serviceRouteKey).
 */
export type RouteKey = 'home' | 'services' | 'coverage' | `service:${string}`;

/** Clé de route d'une fiche service, à partir de son slug FRANÇAIS. */
export const serviceRouteKey = (slugFr: string): RouteKey =>
  `service:${slugFr}`;

/**
 * Segments d'URL localisés des rubriques. Les segments sont traduits
 * (`/es/servicios/`, pas `/es/services/`) : c'est le signal le plus lisible
 * pour l'utilisateur hispanophone dans les SERP, et Google recommande des
 * URL dans la langue de la page.
 */
const segments: Record<Locale, { services: string; coverage: string }> = {
  fr: { services: 'services', coverage: 'depannage' },
  en: { services: 'services', coverage: 'coverage' },
  es: { services: 'servicios', coverage: 'zonas' },
};

/** Préfixe de langue : vide pour le FR (racine), `/en` et `/es` sinon. */
const prefix = (locale: Locale): string =>
  locale === defaultLocale ? '' : `/${locale}`;

/**
 * Slugs de services par langue, indexés par slug FR.
 * Rempli par `registerServiceSlugs()` au chargement des contenus traduits,
 * ce qui évite de dupliquer la table de correspondance ici.
 */
const serviceSlugs: Record<Locale, Record<string, string>> = {
  fr: {},
  en: {},
  es: {},
};

/** Déclare les slugs localisés d'une langue (appelé par les fichiers contenu). */
export function registerServiceSlugs(
  locale: Locale,
  map: Record<string, string>,
): void {
  serviceSlugs[locale] = map;
}

/**
 * Chemin absolu (commençant par `/`) d'une route dans une langue donnée,
 * ou `null` si la page n'existe pas dans cette langue.
 */
export function pathFor(key: RouteKey, locale: Locale): string | null {
  const p = prefix(locale);
  const seg = segments[locale];

  if (key === 'home') return `${p}/`;
  if (key === 'services') return `${p}/${seg.services}/`;
  if (key === 'coverage') return `${p}/${seg.coverage}/`;

  if (key.startsWith('service:')) {
    const slugFr = key.slice('service:'.length);
    // Le FR est la référence : son slug est la clé de correspondance.
    const slug = locale === 'fr' ? slugFr : serviceSlugs[locale][slugFr];
    if (!slug) return null;
    return `${p}/${seg.services}/${slug}/`;
  }

  return null;
}

/** URL absolue d'une route, ou `null` si absente dans cette langue. */
export function urlFor(key: RouteKey, locale: Locale): string | null {
  const path = pathFor(key, locale);
  return path === null ? null : `${site.url}${path}`;
}

/** Une alternative linguistique déclarable en `<link rel="alternate">`. */
export type Alternate = { hreflang: string; href: string };

/**
 * Alternates d'une page, pour le <head> et le sitemap.
 *
 * Inclut toujours la page elle-même (auto-référence, exigée par Google)
 * et un `x-default` pointant sur le français — version canonique de
 * l'entreprise, et langue de la très grande majorité des clients.
 */
export function alternatesFor(key: RouteKey): Alternate[] {
  const langs = availableLocales(key);

  // Une seule version : rien à déclarer. Un groupe hreflang d'un seul
  // membre n'apporte aucun signal et ajoute du bruit dans le <head>.
  if (langs.length < 2) return [];

  const out: Alternate[] = langs.map((locale) => ({
    hreflang: localeMeta[locale].lang,
    href: urlFor(key, locale)!,
  }));

  // x-default → français, version canonique de l'entreprise.
  const fr = urlFor(key, 'fr');
  if (fr) out.push({ hreflang: 'x-default', href: fr });

  return out;
}

/**
 * Langues dans lesquelles une route existe — alimente le sélecteur de
 * langue, qui ne doit proposer que des destinations réelles.
 */
export function availableLocales(key: RouteKey): Locale[] {
  return locales.filter((l) => pathFor(key, l) !== null);
}
