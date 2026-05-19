// Récupération des avis Google via l'API Google Business Profile (v4).
// Utilisé par le dashboard de pilotage pour remonter la note moyenne par
// établissement, la note globale du réseau et l'activité du mois courant.
//
// L'appel est coûteux (OAuth + une requête paginée par établissement) et
// le quota Google est faible : le résultat est mis en cache dans D1 par
// l'appelant (cf. functions/api/pilotage/snapshot.ts). Ce module ne fait
// que l'appel brut, sans cache.

import type { Env } from './env';

// Établissements Google Business Profile suivis. Les locationId
// proviennent du workflow n8n « WORKFLOW_GOOGLE_CENTRALISE ».
const GBP_LOCATIONS: { name: string; locationId: string }[] = [
  { name: 'Montpellier', locationId: '13226346560059197832' },
  { name: "Clermont-l'Hérault", locationId: '8289695854872502451' },
  { name: 'Étoile Assistance 2 Roues', locationId: '4399399974492064927' },
  { name: 'Garage Garosud 34', locationId: '16258940987569720760' },
];

const STAR_VALUE: Record<string, number> = {
  ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5,
};

const FETCH_TIMEOUT_MS = 8000;

export interface GoogleSiteRating {
  name: string;
  rating: number | null;   // note moyenne cumulée (tous avis)
  review_count: number;    // nombre total d'avis cumulés
}

export interface GoogleReviewsData {
  sites: GoogleSiteRating[];
  global_avg: number | null;   // moyenne réseau, pondérée par le nb d'avis
  global_count: number;        // total d'avis cumulés
  month_avg: number | null;    // moyenne des avis reçus ce mois-ci
  month_count: number;         // nb d'avis reçus ce mois-ci
  month_one_star: number;      // nb d'avis 1★ reçus ce mois-ci
}

/** True si toutes les variables d'env nécessaires à l'API Google sont posées. */
export function googleConfigured(env: Env): boolean {
  return Boolean(
    env.GOOGLE_CLIENT_ID &&
    env.GOOGLE_CLIENT_SECRET &&
    env.GOOGLE_REFRESH_TOKEN &&
    env.GBP_ACCOUNT_ID
  );
}

// Échange le refresh token contre un access token court.
async function getAccessToken(env: Env): Promise<string> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      client_secret: env.GOOGLE_CLIENT_SECRET,
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!res.ok) {
    throw new Error(`oauth ${res.status} ${(await res.text()).slice(0, 120)}`);
  }
  const json = (await res.json()) as { access_token?: string };
  if (!json.access_token) throw new Error('oauth: access_token manquant');
  return json.access_token;
}

interface GbpReview {
  starRating?: string;
  createTime?: string;
  updateTime?: string;
}
interface GbpReviewsPage {
  reviews?: GbpReview[];
  averageRating?: number;
  totalReviewCount?: number;
  nextPageToken?: string;
}

// Avis d'un établissement : note moyenne cumulée + notes du mois courant.
// Les avis sont renvoyés par Google triés par updateTime décroissant ; dès
// qu'on croise un avis modifié avant le début du mois, les suivants ne
// peuvent plus concerner le mois courant (createTime ≤ updateTime).
async function fetchLocation(
  env: Env,
  token: string,
  loc: { name: string; locationId: string },
  monthStartIso: string
): Promise<{ name: string; rating: number | null; count: number; monthStars: number[] }> {
  let pageToken = '';
  let rating: number | null = null;
  let count = 0;
  let firstPage = true;
  const monthStars: number[] = [];

  for (let page = 0; page < 5; page++) {
    const url =
      `https://mybusiness.googleapis.com/v4/accounts/${env.GBP_ACCOUNT_ID}` +
      `/locations/${loc.locationId}/reviews?pageSize=50` +
      (pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '');
    const res = await fetch(url, {
      headers: { authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });
    if (!res.ok) {
      throw new Error(`reviews ${loc.name} ${res.status}`);
    }
    const json = (await res.json()) as GbpReviewsPage;

    if (firstPage) {
      rating = typeof json.averageRating === 'number' ? json.averageRating : null;
      count = json.totalReviewCount ?? 0;
      firstPage = false;
    }

    let crossedMonth = false;
    for (const rv of json.reviews ?? []) {
      const updated = rv.updateTime || rv.createTime || '';
      if (updated < monthStartIso) { crossedMonth = true; break; }
      const created = rv.createTime || updated;
      if (created >= monthStartIso) {
        const stars = STAR_VALUE[rv.starRating ?? ''] ?? 0;
        if (stars) monthStars.push(stars);
      }
    }

    pageToken = json.nextPageToken ?? '';
    if (crossedMonth || !pageToken) break;
  }

  return { name: loc.name, rating, count, monthStars };
}

/** Premier jour du mois courant (fuseau Europe/Paris) au format RFC3339 UTC. */
function monthStartIso(now: Date): string {
  const parts: Record<string, string> = {};
  for (const p of new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris', year: 'numeric', month: '2-digit',
  }).formatToParts(now)) {
    parts[p.type] = p.value;
  }
  // Minuit le 1er du mois. L'écart Paris/UTC (1-2 h) est négligeable
  // pour un seuil de comptage mensuel.
  return `${parts.year}-${parts.month}-01T00:00:00Z`;
}

/** Appelle l'API Google Business Profile et agrège les indicateurs d'avis. */
export async function fetchGoogleReviews(env: Env): Promise<GoogleReviewsData> {
  const token = await getAccessToken(env);
  const since = monthStartIso(new Date());

  const settled = await Promise.allSettled(
    GBP_LOCATIONS.map((loc) => fetchLocation(env, token, loc, since))
  );

  const ok = settled
    .filter((s): s is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchLocation>>> =>
      s.status === 'fulfilled')
    .map((s) => s.value);

  if (ok.length === 0) {
    const reason = settled[0]?.status === 'rejected' ? String(settled[0].reason) : 'inconnu';
    throw new Error(`Aucun établissement Google joignable (${reason})`);
  }

  const sites: GoogleSiteRating[] = ok.map((r) => ({
    name: r.name,
    rating: r.rating,
    review_count: r.count,
  }));

  let weightedSum = 0;
  let globalCount = 0;
  for (const r of ok) {
    if (r.rating != null && r.count > 0) {
      weightedSum += r.rating * r.count;
      globalCount += r.count;
    }
  }
  const monthStars = ok.flatMap((r) => r.monthStars);
  const monthCount = monthStars.length;

  return {
    sites,
    global_avg: globalCount ? weightedSum / globalCount : null,
    global_count: globalCount,
    month_avg: monthCount
      ? monthStars.reduce((a, b) => a + b, 0) / monthCount
      : null,
    month_count: monthCount,
    month_one_star: monthStars.filter((s) => s === 1).length,
  };
}
