# Handoff — Site web Montpellier Dépannage

## Overview

Public marketing website for **Montpellier Dépannage** (MDP), a tow‑truck / roadside‑assistance company established in 1956, operating in the Hérault region (Montpellier + A9 motorway). The design covers the **homepage** — it's the first landmark page; subsequent pages (service detail, about, contact, devis form, news index) should reuse the same patterns.

This is a **sister product** to "DepanTime" (the company's internal web app). The public site is intentionally distinct from the app: the app uses Space Mono as its display face, the site uses Space Grotesk. Keep that separation.

## About the design files

The files in this bundle are **design references authored in HTML + inline JSX (React via Babel)**. They are prototypes — they express intended look, voice, and behaviour, but they are **not production code to ship**. The task is to recreate these designs inside MDP's target codebase, using whatever framework and conventions that codebase already uses (React, Vue, Astro, WordPress block theme, etc.). If no codebase exists yet, pick the most sensible framework for a French SMB marketing site (Astro or Next.js are both reasonable choices) and implement there.

All design tokens — colors, typography scale, spacing, radii, shadows — are codified in `colors_and_type.css`. Reuse those exact values in the implementation; **do not eyeball hex codes from the JSX**.

## Fidelity

**Hi‑fi.** Pixel‑perfect mockups with final colors, typography, spacing, copy, and imagery. The developer should recreate the UI pixel‑perfectly using the codebase's component primitives.

One caveat: the **photos used in the prototype are hotlinked from montpellierdepannage.com**. They are placeholders of the right kind of image (interventions, A9, EV charging) but the final site should host its own copies — either re‑export from the WordPress media library or receive a curated batch from the client. See "Assets" below.

## Screens / views

### Homepage (`homepage.html` → `HomeInstitutional` component)

One long scrolling page composed of 7 stacked sections. Max content width **1200 px** (coverage band stretches to 1400 px), horizontal padding **40 px**, section vertical padding **72–80 px**.

Read the JSX source directly for exact markup — below is a high‑level inventory.

| # | Section | Purpose |
|---|---|---|
| 0 | Sticky top nav | Persistent entry to services + the **two CTAs: phone number and devis form** |
| 1 | Hero | Full‑bleed photo of an A9 intervention with dark gradient overlay, title, dual CTA, and a 4‑stat trust strip anchored to the bottom |
| 2 | Certifications band | Labels row: **NF Service**, **Envol**, **Oleo 100**. Low‑contrast, confidence‑by‑logos |
| 3 | Services grid | 3×2 cards covering the 6 activities. Each card: photo header with numeric tag (01–06), title, 2‑line description, "En savoir plus →" |
| 4 | Coverage band | 2‑column split: editorial copy + zone list on the left, abstract topographic SVG with brand pins on the right |
| 5 | Devis CTA | Large green panel, 3‑step explainer (Type véhicule → Lieu & destination → Urgence) + dual CTA (primary devis, secondary phone) |
| 6 | News | 3 latest articles with photo, date (JetBrains Mono), category pill, title, "Lire la suite →" |
| 7 | Footer | 4‑column: contact block with logo & address, Services column, Entreprise column, Informations column. Black background, yellow brand accent on phone |

### Top nav (detail)

- Sticky, `backdrop-filter: blur(10px)` optional, border‑bottom 1 px.
- Left: 40 px circular logo (green bg, yellow "MD" + "DÉPANNAGE" micro‑caps) + two‑line wordmark.
- Center: 5 links — Services, Flotte, Zones, Actualités, Contact (13 px DM Sans 500).
- Right: phone CTA (outlined primary, JetBrains Mono for number) + devis CTA (filled primary).

### Hero (detail)

- Background: `linear-gradient(180deg, rgba(26,25,15,0.55), rgba(26,25,15,0.75))` over a full‑bleed photo (`background-size: cover; background-position: center`).
- Min‑height 560 px, 80 px top / 56 px bottom padding.
- Status pill (top): yellow bg, green dot with glow halo, black micro‑caps label — "INTERVENTION 24H/24 · 7J/7".
- H1: display font, 72 px, line‑height 1.02, letter‑spacing −0.025em; second line tinted yellow (`#E4E13C`).
- Lead copy: 18 px DM Sans 400, max‑width 620 px, opacity 88 %.
- CTA pair: yellow primary (phone icon + "Urgence" overline + number) and green secondary (devis → arrow).
- Trust strip: 4 stats separated by `border-top: 1px solid rgba(255,255,255,0.2)`. Each stat = display font 38 px yellow value, 12 px white label, 10 px 55 %‑opacity micro‑caps kicker.

## Interactions & behaviour

This page is mostly static/informational. Interactions are minimal:

- **Nav link hovers**: subtle underline or primary‑color shift. No dropdowns planned for v1.
- **Card hovers** (Services, News): lift 2 px + stronger shadow (`--shadow-md`). 150 ms `--ease-standard`. Photo can `scale(1.03)` inside a clipped container.
- **Button states**: filled buttons darken to `--color-primary-active`; outlined buttons fill with `--color-primary-bg`. Always keep border‑radius ≥ 8 px.
- **Devis CTA section**: "Commencer le devis" navigates to the multi‑step devis form (out of scope of this handoff — will be a separate deliverable).
- **Phone CTAs**: native `tel:` links.
- **Certifications logos**: no click behaviour in v1, but should be `<img alt>`‑accessible.
- **Scroll**: standard browser scroll. Nav stays sticky with `backdrop-filter: blur(10px)` once scrolled past hero (optional polish).

No JS app‑state management is required for the homepage itself. The dev‑only "Tweaks" panel and dark‑mode toggle exist only in the prototype to explore palette/typography options and **should not ship**.

## Responsive behaviour

Prototyped at 1280 px width. For implementation:

- **≥ 1024 px**: as shown.
- **768–1023 px**: hero H1 drops to 52 px; services grid collapses 3→2; coverage band stacks (copy above map); footer grid 4→2.
- **< 768 px**: nav links collapse to a hamburger (decide per codebase convention); all grids single‑column; hero min‑height 460 px; H1 36 px; CTAs full‑width stacked.
- Horizontal padding scales: 40 px (desktop) → 24 px (tablet) → 16 px (mobile).

Exact breakpoints can be adapted to the target codebase's existing Tailwind/SCSS conventions.

## Design tokens

**All of these live in `colors_and_type.css` and must be imported verbatim into the target codebase** (or ported to the codebase's token format — CSS vars, Tailwind theme, SCSS map, etc.).

### Colors

Brand mothers (from the logo):

| Token | Hex | Use |
|---|---|---|
| `--md-brand-green` | `#2C6126` | Primary — buttons, headlines accents |
| `--md-brand-yellow` | `#E4E13C` | Accent / signal — only as backgrounds, never as text |
| `--md-brand-black` | `#1A190F` | Text, dark sections |

Full forest (green) scale: `--md-forest-50` → `--md-forest-900`.
Full signal (yellow) scale: `--md-signal-50` → `--md-signal-900`.
Full stone (warm neutral) scale: `--md-stone-50` → `--md-stone-900`.

Semantic aliases (prefer these in code):

```
--color-primary         = --md-forest-600   #2C6126
--color-primary-hover   = --md-forest-500   #3E7F2C
--color-primary-active  = --md-forest-700   #255420
--color-accent          = --md-signal-300   #E4E13C
--color-text            = --md-stone-900    #1A190F
--color-text-muted      = --md-stone-500    #5F5E5A
--color-bg              = #FFFFFF
--color-bg-subtle       = --md-stone-50     #FAFAF7
--color-border          = --md-stone-200    #D3D1C7
```

### Typography

Three families, three distinct roles. **Load them from Google Fonts** (already wired in `homepage.html`):

| Family | Role | Where |
|---|---|---|
| **Space Grotesk** (500, 600, 700) | Display | H1, H2, section titles, stats values, logo wordmark |
| **DM Sans** (400, 500, 600, 700) | Body & UI | Body copy, button labels, nav links, card text, footer |
| **JetBrains Mono** (400, 500, 700) | Tabular / technical | Phone numbers, dates, coordinates, "// SECTION" micro‑caps |

Space Grotesk settings for headlines: `font-weight: 700`, `letter-spacing: -0.025em`.
**Never** use Space Grotesk for body copy. **Never** use Space Mono on this site (it's reserved for the DepanTime internal app — keep the visual separation between brand surfaces).

Scale (from `colors_and_type.css`):

```
--fs-xs   11px    /* overlines, micro-caps, logo sub-label */
--fs-sm   12px    /* captions, button labels small */
--fs-base 13px    /* body default on cards/meta */
--fs-md   14px    /* body default on long-form */
--fs-lg   16px    /* lead paragraphs, H3 */
--fs-xl   20px    /* H3 large */
--fs-2xl  24px    /* H2 small */
--fs-3xl  32px    /* H2 news title */
--fs-4xl  44px    /* section H2 */
--fs-5xl  60px    /* hero H1 medium */
/* Hero uses 72px directly — larger than --fs-5xl because the hero is exceptional */
```

### Spacing — 4 px base

```
--sp-1  4     --sp-8   32
--sp-2  8     --sp-10  40
--sp-3  12    --sp-12  48
--sp-4  16    --sp-16  64
--sp-5  20
--sp-6  24
```

Section vertical padding = 72–80 px (outside the 4 px scale — intentional).
Max content width = 1200 px; coverage band stretches to 1400 px.

### Radii

```
--radius-xs     4px     /* tag pills */
--radius-sm     6px     /* chip segments */
--radius-md     8px     /* buttons, small inputs */
--radius-lg    10px     /* CTAs, cards small */
--radius-xl    12px     /* service cards */
--radius-2xl   16px     /* large promotional blocks, devis panel */
--radius-pill 999px     /* status pills */
```

### Shadows

```
--shadow-xs:      0 1px 2px rgba(26,25,15,0.04)
--shadow-sm:      0 1px 3px rgba(26,25,15,0.06)     /* cards at rest */
--shadow-md:      0 4px 14px rgba(26,25,15,0.08)    /* card hover, nav scrolled */
--shadow-lg:      0 10px 40px rgba(26,25,15,0.15)   /* modals, devis panel */
--shadow-primary: 0 4px 14px rgba(44,97,38,0.30)    /* primary CTA */
--shadow-accent:  0 4px 14px rgba(228,225,60,0.35)  /* accent CTA (rarely) */
```

### Motion

```
--ease-standard: cubic-bezier(0.4, 0, 0.2, 1)
--ease-out:      cubic-bezier(0.0, 0, 0.2, 1)
--dur-fast:  120ms    /* hover color shifts */
--dur-base:  150ms    /* button/card state changes */
--dur-slow:  240ms    /* nav scroll-state transition */
```

## Assets

All photos in the prototype are **hotlinked from the current montpellierdepannage.com WordPress media library**. Replace with locally‑hosted copies before shipping.

### Photography (hero + service cards + news)

| Used as | Current URL |
|---|---|
| Hero, service "Autoroute A9" | `https://montpellierdepannage.com/wp-content/uploads/2021/04/a9-avril21-4-1.jpg` |
| Service "Remorquage PL", news "Accident A9" | `https://montpellierdepannage.com/wp-content/uploads/2022/02/accident2.jpg` |
| Service "Remorquage VL", service "Mécanique", news "Relevage PL" | `https://montpellierdepannage.com/wp-content/uploads/2020/04/Resized_21-1.jpg` |
| Service "Transport international", news "Borne EV" | `https://montpellierdepannage.com/wp-content/uploads/2021/08/evbox-montpellier-1.jpg` |

### Certification logos (certifications band)

| Label | URL |
|---|---|
| NF Service | `https://montpellierdepannage.com/wp-content/uploads/2024/05/NFS_Depannage-vehicules-legers-et-poids-lourds.webp` |
| Envol (signataires) | `https://montpellierdepannage.com/wp-content/uploads/2024/05/signature-titulaires-envol.webp` |
| Oleo 100 | `https://montpellierdepannage.com/wp-content/uploads/elementor/thumbs/Visuel-RS-Oleo100-2023-MONTPELLIER-DEPANNAGE-800-qol3tq547eb1wu82do3kdqa9hmbloo01u3hvtw8qrg.png` |

These are real certifications the company holds — keep all three and preserve the approved logo shapes (don't recolor or crop).

### Logo mark ("MD DÉPANNAGE")

Drawn inline in `shared.jsx` (`LogoMark` component) as a CSS/text fallback — a green circle with yellow "MD" on top and micro‑caps "DÉPANNAGE" below. **If the client has a proper SVG logo**, swap that in. Otherwise the fallback is acceptable.

## Files in this bundle

| File | What it is |
|---|---|
| `homepage.html` | Entry point — loads React + Babel, wires up the design canvas and mounts `HomeInstitutional` |
| `HomeInstitutional.jsx` | The full homepage as one React component + `Stat`, `ServiceCard`, `NewsCard` atoms |
| `shared.jsx` | `TopNav`, `Footer`, `LogoMark`, the `tokens()` helper, and the `TweaksPanel` (prototype‑only — discard) |
| `design-canvas.jsx` | The pan/zoom design canvas used to present the mock (prototype‑only — discard) |
| `colors_and_type.css` | **The source of truth for design tokens. Port this verbatim.** |

To preview: open `homepage.html` in any modern browser. No build step — React and Babel load from CDN.

## Implementation notes / gotchas

- **Discard the `TweaksPanel`** in `shared.jsx` — it's a prototype‑only tool for exploring palette/typography variants. The production site ships with green = `--color-primary`, yellow = ponctuel, Space Grotesk, light theme only.
- **The "coverage map" is abstract SVG**, not a real map. If the client wants an interactive Mapbox/Leaflet map with real intervention zones, that's a separate build. The current design deliberately avoids claiming real coverage precision.
- **Phone number** appears in 3 places (nav, hero CTA, footer). Single source of truth: `04 67 42 14 31` — wire it through config.
- **Accessibility**: ensure all photos have meaningful `alt` text, all CTAs are real links with underline on focus, color contrast of the yellow pill on white is low — keep it for decorative moments only, never for body text.
- **SEO / metadata**: out of scope for this handoff. The site should ship with proper `<title>`, Open Graph, `schema.org/LocalBusiness` with address + phone + opening hours (24/7), and French as primary language.
