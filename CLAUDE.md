# Montpellier Dépannage — Site web

Site vitrine Astro pour Montpellier Dépannage (remorquage 24/7, entreprise familiale, plus de 30 ans d'expérience).
Stack : **Astro 4** static, vanilla TS, CSS scopé par composant. Pas de framework JS (pas de React, Vue, etc.).

## Source unique de vérité

`src/config/site.ts` exporte **tout** ce qui est partagé : nom, téléphone, email, adresse, nav, photos.
Toujours lire/modifier ces données ici, jamais en dur dans les composants.

## Arborescence

- `src/pages/index.astro` — homepage, ordre des sections : Hero → CapacityStats → ServicesGrid → CoverageBand → Certifications → DevisForm
- `src/components/home/` — sections de la home (un fichier par section)
- `src/components/{TopNav,Footer,LogoMark,LanguageSwitcher}.astro` — chrome global
- `src/components/i18n/` — chrome et gabarits des pages traduites (EN/ES)
- `src/i18n/` — routage multilingue et contenus traduits
- `src/layouts/BaseLayout.astro` — head, fonts, meta, hreflang
- `src/styles/{tokens.css,global.css}` — design tokens + reset

Pages « zones d'intervention » : `/depannage/` est le **hub** (page index générée
depuis `data/zones.ts`), `/depannage/{ville}/` les 15 fiches. Le hub est lié
depuis la nav, le hero et le footer — ne pas le déconnecter du maillage, c'est
la seule chose qui donne de la profondeur aux pages villes.

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

## Multilingue (FR / EN / ES)

Le **français reste à la racine** (`/`, `/services/…`) : aucune URL FR indexée ne
doit bouger. L'anglais et l'espagnol vivent sous `/en/` et `/es/`, avec des
segments traduits (`/es/servicios/`, `/es/zonas/`).

Périmètre traduit, volontairement resserré : accueil, index services, 6 fiches
services, page couverture. **Pas** les fiches agences, les 15 fiches villes, le
recrutement ni les pages légales — 30 pages étrangères peu recherchées
diluent le site sans rien capter. Les pages traduites renvoient vers le FR.

- `src/i18n/config.ts` — routes localisées, `pathFor()`, `alternatesFor()`.
  Les URL alternatives ne sont **jamais devinées** : une page déclare sa
  `RouteKey`, le routeur résout les URL qui existent réellement.
- `src/i18n/content/{en,es}.ts` — tout le texte traduit, un fichier par langue.
- Toujours importer depuis `src/i18n` (le barrel), jamais depuis `content/en`
  directement : c'est lui qui garantit que les slugs des deux langues sont
  enregistrés avant la résolution des hreflang.

Règles à ne pas casser :
- Une page multilingue passe `routeKey` à **`BaseLayout` ET à `TopNav`** — le
  premier émet les `hreflang`, le second le sélecteur de langue (c'est par ces
  liens que Google découvre les traductions).
- Les hreflang doivent rester **réciproques** : si `/en/x/` pointe vers `/x/`,
  `/x/` doit pointer vers `/en/x/`. `alternatesFor()` s'en charge tant qu'on
  déclare la même `RouteKey` des deux côtés.
- **Jamais de redirection automatique** par IP ou `Accept-Language` : Google
  documente que cela empêche l'exploration des versions localisées.
- Un lien depuis une page EN/ES vers une page FR porte `hreflang="fr" lang="fr"`.

## Backend — Pages Functions + D1

Le site est statique mais utilise **Cloudflare Pages Functions** (dossier `functions/`) pour le formulaire de devis, le dashboard admin, et le cron.

Le formulaire vit dans `src/components/home/DevisForm.astro`, section autonome de la
home portant l'ancre **`id="devis"`**. Ne pas retirer cette ancre : la barre d'appel
mobile (`MobileCallBar`) et la redirection 301 `/devis` de `public/_redirects`
pointent dessus. Toute la chaîne commerciale en dépend (D1 → Resend → relance
WhatsApp → `/admin` et `/pilotage`).

Endpoints :
- `POST /api/devis` — création d'une demande (insert D1 + email Resend avec lien signé)
- `GET  /api/devis/:id/traiter?t=<token>` — marque comme traitée (HMAC sur l'id)
- `GET  /api/cron/check-overdue` — relance WhatsApp via Evolution API pour les devis ouverts >2h. Header `Authorization: Bearer ${CRON_SECRET}` requis. À appeler via cron-job.org ou GitHub Actions toutes les ~10 min.
- `GET  /admin` — dashboard KPIs. Auth via `?token=<ADMIN_TOKEN>` puis cookie httpOnly.
- `GET  /api/pilotage/snapshot` — agrège les indicateurs du dashboard de pilotage. Auth cookie `mdp_pilotage` ou `?token=`.

Storage : **D1** (SQLite Cloudflare). Schéma dans `schema.sql`. Tables : `devis`, `call_clicks`, `kv_cache`.

## Dashboard de pilotage (`/pilotage`)

Écran affiché en continu au bureau. `src/pages/pilotage.astro` poll `/api/pilotage/snapshot` toutes les 30 s et fait défiler **3 pages** automatiquement toutes les 15 s (flèches ←/→ pour naviguer manuellement) :

1. **Opérations** — devis, relevés de temps, plannings (source : D1 + DepanTime).
2. **Conformité & flotte** — % véhicules avec CT planifié (app Flotte), taux de conformité documentaire des dépanneurs (app Habilitation).
3. **Avis clients Google** — note moyenne réseau, note du mois courant + nb d'avis 1★, note par établissement (API Google Business Profile).

Chaque indicateur porte un statut couleur (vert/orange/rouge/gris). `snapshot.ts` agrège en parallèle 4 sources externes, chacune tolérante à l'échec (carte grise « Indisponible ») :

- **Flotte** : `GET {FLOTTE_URL}/api/pilotage-public/snapshot`, `Authorization: Bearer {FLOTTE_PILOTAGE_SECRET}`.
- **Habilitation** : `GET {HABILITATION_URL}/api/pilotage/snapshot`, header `X-Pilotage-Secret: {HABILITATION_PILOTAGE_SECRET}`.
- **Google** : API Google Business Profile (OAuth refresh token). Quota faible → résultat mis en cache 30 min dans `kv_cache` (clé `google_reviews`) ; en cas d'échec on sert le dernier cache. Logique dans `functions/_lib/google-reviews.ts`.

Les secrets correspondants doivent matcher ceux configurés côté apps voisines (repos `FLOTTE` et `HABILITATION`).

Type-check des Functions : `npx tsc -p functions/tsconfig.json --noEmit` (les Functions ne passent PAS par le build Astro — Cloudflare les compile séparément lors du deploy).

## Déploiement

- Repo GitHub : `AlexDiLorenzo/MtpDep`
- Hébergement : **Cloudflare Pages** (auto-deploy sur push `main`)
- Build : `npm run build` → `dist/`
- Variable d'env Cloudflare : `NODE_VERSION=20`

### Setup initial Cloudflare (une seule fois)

1. **Créer la base D1** :
   ```bash
   npx wrangler d1 create mtp-dep-db
   ```
   Récupérer le `database_id` retourné, le coller dans `wrangler.toml` à la place de `REPLACE_AFTER_D1_CREATE`.

2. **Appliquer le schéma** :
   ```bash
   npx wrangler d1 execute mtp-dep-db --file=schema.sql --remote
   ```

3. **Lier la D1 au projet Pages** : dashboard Cloudflare → Pages → projet → Settings → Functions → D1 database bindings → ajouter `DB` → `mtp-dep-db`.

4. **Configurer les secrets** dans Pages → Settings → Environment variables (production) :

   | Variable | Source / format |
   |---|---|
   | `RESEND_API_KEY` | Console Resend → API Keys |
   | `RESEND_FROM` | `Montpellier Dépannage <devis@<domaine-vérifié>>` ou `onboarding@resend.dev` en test |
   | `EMAIL_TO` | `alexandre.dlrz@gmail.com` (à changer plus tard) |
   | `DEVIS_SECRET` | random 32+ chars (`openssl rand -base64 32`) |
   | `ADMIN_TOKEN` | random 32+ chars |
   | `CRON_SECRET` | random 32+ chars |
   | `EVOLUTION_API_URL` | `https://evolution.<vps>` |
   | `EVOLUTION_API_KEY` | apikey de l'instance Evolution |
   | `EVOLUTION_INSTANCE` | nom de l'instance Evolution |
   | `ALERT_PHONE` | `33XXXXXXXXX` (sans + ni espaces) |
   | `SITE_URL` | URL publique, ex `https://mtp-dep.pages.dev` |
   | `PILOTAGE_TOKEN` | random 32+ chars — accès à la page `/pilotage` |
   | `DEPANTIME_URL` | URL de l'app DepanTime |
   | `DEPANTIME_PILOTAGE_SECRET` | secret partagé avec DepanTime |
   | `FLOTTE_URL` | `https://flotte.alex-worksmart.com` |
   | `FLOTTE_PILOTAGE_SECRET` | = `FL_PILOTAGE_SECRET` côté repo Flotte |
   | `HABILITATION_URL` | `https://formations.alex-worksmart.com` |
   | `HABILITATION_PILOTAGE_SECRET` | = `PILOTAGE_SECRET` côté repo Habilitation |
   | `GOOGLE_CLIENT_ID` | OAuth Google (scope `business.manage`) |
   | `GOOGLE_CLIENT_SECRET` | OAuth Google |
   | `GOOGLE_REFRESH_TOKEN` | refresh token OAuth Google Business Profile |
   | `GBP_ACCOUNT_ID` | ID du compte Google Business Profile (`109079680965504488288`) |

5. **Cron externe** pour la relance 2h. Plus simple : créer un job sur **cron-job.org** :
   - URL : `https://<site>/api/cron/check-overdue`
   - Méthode : GET
   - Header : `Authorization: Bearer <CRON_SECRET>`
   - Fréquence : toutes les 10 min
   - Failure notification : activé (te notifie si l'endpoint répond mal)

Avant un push, vérifier que `npm run build` ET `npx tsc -p functions/tsconfig.json --noEmit` passent.

## À éviter

- Ajouter des dépendances lourdes (React, Vue, libs UI). Le site doit rester static + vanilla.
- Créer des composants génériques pour 1 seul usage. Les sections home sont des unités atomiques.
- Hotlinker des assets externes.
- Ajouter des sections "filler" (Actualités, Devis multi-étapes, etc.) — on a délibérément retiré ces parcours sans valeur.
