# Montpellier Dépannage — Site web

Site vitrine public de **Montpellier Dépannage** (MDP), entreprise de remorquage et d'assistance routière fondée en 1956, opérant dans l'Hérault (Montpellier + autoroute A9).

Implémentation Astro de la homepage définie dans le handoff design (`design_handoff_site_web/`).

## Stack

- [Astro 4](https://astro.build/) — génération statique, zéro JS côté client par défaut
- CSS natif avec design tokens (cf. `src/styles/tokens.css`)
- Polices : **Space Grotesk** (display), **DM Sans** (body/UI), **JetBrains Mono** (numérique / technique)

## Scripts

```bash
npm install
npm run dev       # dev server sur http://localhost:4321
npm run build     # build statique → dist/
npm run preview   # preview du build
```

## Structure

```
src/
  components/
    TopNav.astro
    Footer.astro
    LogoMark.astro
    home/
      Hero.astro
      CertificationsBand.astro
      ServicesGrid.astro
      CoverageBand.astro
      DevisCTA.astro
      NewsSection.astro
  config/
    site.ts            # téléphone, adresse, contenus partagés
  layouts/
    BaseLayout.astro
  pages/
    index.astro
  styles/
    tokens.css         # design tokens (port verbatim du handoff)
    global.css
design_handoff_site_web/   # référence design, NE PAS déployer
```

## Notes d'implémentation

- **Un seul numéro de téléphone** `04 67 42 14 31`, source unique dans `src/config/site.ts`.
- Les photos sont temporairement chargées depuis le site WordPress existant (cf. handoff). Les remplacer par des copies locales avant mise en production.
- Le prototype JSX d'origine utilise Space Mono + un panneau « Tweaks » : les deux sont **exclus** de la production — Space Mono est réservé à l'app interne DepanTime.
- L'écosystème SEO (metadata, Open Graph, schema.org LocalBusiness) est câblé dans `BaseLayout.astro`.
