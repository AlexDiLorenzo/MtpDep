// ============================================================
// Point d'entrée unique de l'i18n.
//
// IMPORTANT — toute page localisée doit importer depuis CE module,
// jamais depuis `./content/en` ou `./content/es` directement : les
// fichiers de contenu déclarent leurs slugs traduits au routeur via
// `registerServiceSlugs()` au moment de leur import. Passer par ce
// module garantit que les deux langues sont enregistrées avant qu'une
// page ne résolve ses `hreflang` — sans quoi une alternative pourrait
// silencieusement manquer selon l'ordre d'évaluation des modules.
// ============================================================

import { en } from './content/en';
import { es } from './content/es';
import type { Locale } from './config';
import type { LocalizedContent, LocalizedService } from './types';

export * from './config';
export type * from './types';

/** Contenus des langues traduites (le FR garde ses données historiques). */
const contents = { en, es } as const;

/** Langues disposant d'un contenu traduit — exclut le français. */
export type TranslatedLocale = keyof typeof contents;

export const translatedLocales = Object.keys(contents) as TranslatedLocale[];

/** Contenu complet d'une langue traduite. */
export const getContent = (locale: TranslatedLocale): LocalizedContent =>
  contents[locale];

/** Retrouve un service traduit par son slug LOCALISÉ. */
export const getLocalizedService = (
  locale: TranslatedLocale,
  slug: string,
): LocalizedService | undefined =>
  contents[locale].services.find((s) => s.slug === slug);

/** Vrai si la locale dispose d'un contenu traduit. */
export const isTranslated = (locale: Locale): locale is TranslatedLocale =>
  locale in contents;
