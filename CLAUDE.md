# Montpellier Dépannage — Site web

Site vitrine Astro pour Montpellier Dépannage (remorquage 24/7, depuis 1956).
Stack : **Astro 4** static, vanilla TS, CSS scopé par composant. Pas de framework JS (pas de React, Vue, etc.).

## Source unique de vérité

`src/config/site.ts` exporte **tout** ce qui est partagé : nom, téléphone, email, adresse, nav, photos.
Toujours lire/modifier ces données ici, jamais en dur dans les composants.

## Arborescence

- `src/pages/index.astro` — homepage, ordre des sections : Hero → CapacityStats → ServicesGrid → CoverageBand → Certifications → AssistanceCTA
- `src/components/home/` — sections de la home (un fichier par section)
- `src/components/{TopNav,Footer,LogoMark}.astro` — chrome global
- `src/layouts/BaseLayout.astro` — head, fonts, meta
- `src/styles/{tokens.css,global.css}` — design tokens + reset

## Design tokens

Tout dans `src/styles/tokens.css` (variables CSS). Référence : `design_handoff_site_web/colors_and_type.css`.

Couleurs marque : `--md-brand-green: #2C6126`, `--md-brand-yellow: #E4E13C`, `--md-brand-black: #1A190F`.
Police d'affichage : Space Grotesk. Police de corps : DM Sans. Mono : JetBrains Mono.

**Ne pas hardcoder de couleurs ou de tailles** — toujours via `var(--…)`.

## Photos

- Source brute (PDF, DOCX, JPEG haute résolution fournis par le client) : `images/` à la racine.
- Versions servies : `public/img/` (renommées en kebab-case sémantique).
- Référencer via `photos.<key>` depuis `site.ts`, jamais en URL absolue.
- Workflow pour ajouter une photo : copier dans `public/img/`, ajouter une clé dans `photos`, l'utiliser dans le composant.
- **Ne jamais hotlinker depuis l'ancien WordPress** — historiquement on l'a fait, c'est nettoyé.

## Logo

`public/img/logo-mdp.png` (extrait du `.docx` client, oval ~1.78:1).
Le composant `LogoMark.astro` force la hauteur via inline style — le ratio largeur/hauteur de l'image est ~1.78:1, donc `size=32` donne ~32×57 px.
**Ne pas remettre de wordmark texte à côté du logo** : le nom de l'entreprise est déjà dans le visuel.

## Conventions copy

- Tout en français, ton sobre et professionnel.
- Numéros de téléphone toujours via `{site.phone.display}` et `{site.phone.href}`.
- Espaces insécables (`&nbsp;`) avant `?`, `!`, `:`, `;` et autour de `—`, et entre nombre+unité (`24&nbsp;min`).

## Animations

- `prefers-reduced-motion: reduce` doit être respecté partout (transitions désactivées, animations courtes).
- Compteurs animés via `IntersectionObserver` (cf. `CapacityStats.astro`).
- Pas de bibliothèque d'animation — CSS keyframes + JS minimal seulement.

## Section AssistanceCTA — carte qui se retourne

La carte recto reproduit le **Certificat d'Assurance** français (vert sauge, watermark "CA", titre serif, champs noirs).
Le verso met en évidence le numéro d'assistance (jaune signal).
Si on touche au design de la carte, garder la cohérence avec le visuel officiel français — référence : `public/img/carte-verte-ref.jpg`.

## Déploiement

- Repo GitHub : `AlexDiLorenzo/MtpDep`
- Hébergement : **Cloudflare Pages** (auto-deploy sur push `main`)
- Build : `npm run build` → `dist/`
- Variable d'env nécessaire côté Cloudflare : `NODE_VERSION=20`

Avant un push, vérifier que `npm run build` passe en local.

## À éviter

- Ajouter des dépendances lourdes (React, Vue, libs UI). Le site doit rester static + vanilla.
- Créer des composants génériques pour 1 seul usage. Les sections home sont des unités atomiques.
- Hotlinker des assets externes.
- Ajouter des sections "filler" (Actualités, Devis multi-étapes, etc.) — on a délibérément retiré ces parcours sans valeur.
