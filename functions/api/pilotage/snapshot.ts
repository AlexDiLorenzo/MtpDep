// GET /api/pilotage/snapshot
// Agrège : devis (D1) + DepanTime (relevés + plannings), calcule les statuts
// rouge/orange/vert selon les règles métier et renvoie un JSON consolidé pour
// l'écran de pilotage. Auth : cookie `mdp_pilotage` ou ?token=…

import type { Env } from '../../_lib/env';
import { jsonResponse } from '../../_lib/html';
import { checkToken } from '../../_lib/auth';
import {
  fetchGoogleReviews,
  googleConfigured,
  type GoogleReviewsData,
} from '../../_lib/google-reviews';

const COOKIE_NAME = 'mdp_pilotage';
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type Status = 'green' | 'orange' | 'red' | 'gray';

interface DTEnvelope {
  envelope_id: string;
  employee_id: string;
  site_id: string;
  status: string; // sent | delivered | completed | voided | created
  sent_at: string;
}
interface DTTimesheet extends DTEnvelope { year: number; month: number; }
interface DTPlanning  extends DTEnvelope { iso_year: number; start_week: number; }
interface DTSnapshot {
  ts: number;
  sites: { id: string; name: string; code: string; employee_count: number }[];
  timesheets: DTTimesheet[];
  plannings: DTPlanning[];
}

const MONTHS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  const tokenCheck = checkToken(request, env.PILOTAGE_TOKEN, COOKIE_NAME);
  if (!tokenCheck.ok) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }

  const now = Date.now();
  const paris = parisYMD(new Date(now));

  // ── Apps voisines : on lance les appels HTTP en parallèle, ils
  // tournent pendant la requête D1 + DepanTime ci-dessous. Chaque
  // fonction est tolérante à l'échec et renvoie une carte « grise ».
  const flottePromise = computeFlotte(env);
  const habilitationPromise = computeHabilitation(env);
  const googlePromise = computeGoogle(env, now);

  // ── 1. Devis (D1) ──────────────────────────────────────────
  const devis = await computeDevis(env, now);

  // ── 2. DepanTime (HTTP avec timeout court, ne bloque pas en cas d'échec) ─
  let dt: DTSnapshot | null = null;
  let dtError: string | null = null;
  try {
    if (!env.DEPANTIME_URL || !env.DEPANTIME_PILOTAGE_SECRET) {
      throw new Error('depantime_not_configured');
    }
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    const res = await fetch(`${env.DEPANTIME_URL.replace(/\/$/, '')}/api/pilotage-public/snapshot`, {
      headers: { authorization: `Bearer ${env.DEPANTIME_PILOTAGE_SECRET}` },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} ${body.slice(0, 100)}`);
    }
    dt = (await res.json()) as DTSnapshot;
  } catch (e) {
    dtError = e instanceof Error ? e.message : String(e);
  }

  const timesheets = dt ? computeTimesheetStatus(dt, paris, now) : unavailable('relevé');
  const plannings = dt ? computePlanningStatus(dt, paris, now) : unavailable('planning');

  const [flotte, habilitation, google] = await Promise.all([
    flottePromise, habilitationPromise, googlePromise,
  ]);

  const url = new URL(request.url);
  const debug = url.searchParams.get('debug') === '1';
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  return new Response(JSON.stringify({
    ts: now,
    paris,
    devis,
    timesheets,
    plannings,
    flotte,
    habilitation,
    google,
    depantime: { status: dtError ? 'error' : 'ok', error: dtError },
    ...(debug && dt
      ? {
          _debug: {
            sites: dt.sites,
            timesheets_total: dt.timesheets.length,
            timesheets_first: dt.timesheets[0] ?? null,
            timesheets_years_months: [
              ...new Set(dt.timesheets.map((e) => `${e.year}-${e.month}`)),
            ],
            timesheets_statuses: [...new Set(dt.timesheets.map((e) => e.status))],
            target_year: timesheets.period_label,
            plannings_total: dt.plannings.length,
            plannings_weeks: [
              ...new Set(dt.plannings.map((e) => `${e.iso_year}-W${e.start_week}`)),
            ],
            current_iso_week: `${paris.iso_year}-W${paris.iso_week}`,
          },
        }
      : {}),
  }), { headers });
};

// ── Helpers : date Paris ─────────────────────────────────────
function parisYMD(d: Date): { year: number; month: number; day: number; iso_year: number; iso_week: number } {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Europe/Paris',
    year: 'numeric', month: '2-digit', day: '2-digit',
  });
  const parts: Record<string, string> = {};
  for (const p of fmt.formatToParts(d)) parts[p.type] = p.value;
  const year = parseInt(parts.year, 10);
  const month = parseInt(parts.month, 10);
  const day = parseInt(parts.day, 10);
  // ISO week (lundi=1) du calendrier Paris
  const pd = new Date(Date.UTC(year, month - 1, day));
  const dayNum = pd.getUTCDay() || 7;
  pd.setUTCDate(pd.getUTCDate() + 4 - dayNum); // jeudi de la semaine ISO
  const yearStart = new Date(Date.UTC(pd.getUTCFullYear(), 0, 1));
  const iso_week = Math.ceil(((pd.getTime() - yearStart.getTime()) / DAY_MS + 1) / 7);
  return { year, month, day, iso_year: pd.getUTCFullYear(), iso_week };
}

// Nombre de semaines ISO dans une année (52 ou 53).
function isoWeeksInYear(year: number): number {
  const jan1 = new Date(Date.UTC(year, 0, 1)).getUTCDay();
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  return jan1 === 4 || (isLeap && jan1 === 3) ? 53 : 52;
}

// Avance (ou recule) de `delta` semaines ISO en gérant le passage d'année.
function addIsoWeeks(year: number, week: number, delta: number): { year: number; week: number } {
  let y = year;
  let w = week + delta;
  while (w > isoWeeksInYear(y)) { w -= isoWeeksInYear(y); y += 1; }
  while (w < 1) { y -= 1; w += isoWeeksInYear(y); }
  return { year: y, week: w };
}

// ── Devis (D1) ────────────────────────────────────────────────
async function computeDevis(env: Env, now: number) {
  const today = startOfDayParis(now);
  const since7d = now - 7 * DAY_MS;
  const since30d = now - 30 * DAY_MS;

  const r = await env.DB.prepare(
    `SELECT
       SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END)        AS today,
       SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END)        AS last_7d,
       SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END)        AS last_30d,
       SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END)        AS open,
       SUM(CASE WHEN status = 'open' AND created_at < ? THEN 1 ELSE 0 END) AS open_over_2h
     FROM devis`
  )
    .bind(today, since7d, since30d, now - TWO_HOURS_MS)
    .first<{ today: number; last_7d: number; last_30d: number; open: number; open_over_2h: number }>();

  const today_n = r?.today ?? 0;
  const last_7d = r?.last_7d ?? 0;
  const last_30d = r?.last_30d ?? 0;
  const open = r?.open ?? 0;
  const open_over_2h = r?.open_over_2h ?? 0;

  // Clics « Appeler » (tolérant à l'absence de la table)
  let calls_today = 0, calls_7d = 0;
  try {
    const c = await env.DB.prepare(
      `SELECT
         SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today,
         SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS d7
       FROM call_clicks`
    )
      .bind(today, since7d)
      .first<{ today: number; d7: number }>();
    calls_today = c?.today ?? 0;
    calls_7d = c?.d7 ?? 0;
  } catch { /* table absente → 0 */ }

  let status: Status;
  let label: string;
  let sub: string;
  if (open_over_2h > 0) {
    status = 'red';
    label = `${open_over_2h} en attente > 2h`;
    sub = `${today_n} reçu${today_n > 1 ? 's' : ''} aujourd'hui · à traiter immédiatement`;
  } else if (open > 0) {
    status = 'orange';
    label = `${open} à traiter`;
    sub = `${today_n} reçu${today_n > 1 ? 's' : ''} aujourd'hui · ouvert · pas encore > 2h`;
  } else {
    status = 'green';
    label = 'Tout traité';
    sub = `${today_n} reçu${today_n > 1 ? 's' : ''} aujourd'hui · aucun en attente`;
  }

  return {
    status,
    label,
    sub,
    today: today_n,
    last_7d, last_30d, open, open_over_2h,
    calls_today, calls_7d,
  };
}

function startOfDayParis(ts: number): number {
  const p = parisYMD(new Date(ts));
  // ms Paris midnight ≈ UTC midnight of that day + offset
  // Pour des seuils approximatifs (devis du jour), UTC suffit largement.
  // On utilise UTC midnight de la date Paris.
  return Date.UTC(p.year, p.month - 1, p.day) - 2 * 60 * 60 * 1000; // CEST max
}

// ── Relevés de temps ─────────────────────────────────────────
function computeTimesheetStatus(dt: DTSnapshot, paris: ReturnType<typeof parisYMD>, now: number) {
  // Cible : mois M-1 par rapport à aujourd'hui.
  // ATTENTION : DepanTime stocke month en 0-indexé (front utilise
  // Date.getMonth() qui renvoie 0=Jan, 11=Déc). On compare donc en 0-indexé.
  let target0 = paris.month - 2; // paris.month est 1-indexé (Mai=5) → mois précédent en 0-indexé = 5-2 = 3 (Avril)
  let targetYear = paris.year;
  if (target0 < 0) { target0 += 12; targetYear -= 1; }
  const periodLabel = `${MONTHS_FR[target0]} ${targetYear}`;

  const totalEmployees = dt.sites.reduce((s, x) => s + x.employee_count, 0);

  const filtered = dt.timesheets.filter(
    (e) => Number(e.year) === targetYear && Number(e.month) === target0 && e.status !== 'voided'
  );
  const bestByEmployee = new Map<string, DTTimesheet>();
  for (const e of filtered) {
    const key = `${e.site_id}::${e.employee_id}`;
    const cur = bestByEmployee.get(key);
    if (!cur || statusRank(e.status) > statusRank(cur.status)) {
      bestByEmployee.set(key, e);
    }
  }
  const uniqueSent = bestByEmployee.size;
  const completed = [...bestByEmployee.values()].filter((e) => e.status === 'completed').length;

  // Date du dernier envoi (pour J+5)
  const latestSent = filtered.reduce((max, e) => {
    const t = new Date(e.sent_at).getTime();
    return t > max ? t : max;
  }, 0);
  const daysSinceSent = latestSent > 0 ? Math.floor((now - latestSent) / DAY_MS) : 0;

  // "Envoyé" dès qu'au moins un envelope existe pour la période.
  // Les envois partiels (sous-ensemble d'employés) sont volontaires (congés,
  // exceptions) — on ne pénalise pas le statut pour ça.
  const sent = uniqueSent > 0;

  // % signature sur le nombre d'envelopes réellement envoyés.
  const signedPct = uniqueSent > 0 ? Math.round((completed / uniqueSent) * 100) : null;

  // Logique de statut
  // - Si on est dans mois courant M, jour 1-10 :
  //     - pas envoyé → orange "à envoyer avant le 10"
  //     - envoyé → check signature (à J+5)
  // - Si on est dans mois courant M, jour > 10 :
  //     - pas envoyé → rouge "envoi en retard"
  //     - envoyé → check signature
  let status: Status;
  let label: string;
  let sub: string;

  if (!sent) {
    if (paris.day <= 10) {
      status = 'orange';
      label = 'À envoyer';
      sub = `Avant le 10 ${MONTHS_FR[paris.month - 1].toLowerCase()}`;
    } else {
      status = 'red';
      label = 'Envoi en retard';
      sub = `Devait être envoyé avant le 10`;
    }
  } else {
    // Envoyé : on regarde la signature à J+5
    const sig = signaturStatus(signedPct ?? 0, daysSinceSent);
    status = sig.status;
    label = `✓ ${signedPct}% signé`;
    sub = sig.sub;
  }

  return {
    status, label, sub,
    period_label: periodLabel,
    sent,
    sent_at_label: sent ? formatSentDate(latestSent) : null,
    sent_count: uniqueSent,
    total_employees: totalEmployees,
    completed,
    signed_pct: signedPct,
    days_since_sent: daysSinceSent,
  };
}

// ── Plannings ────────────────────────────────────────────────
function computePlanningStatus(dt: DTSnapshot, paris: ReturnType<typeof parisYMD>, now: number) {
  // Les plannings sont envoyés par blocs de 2 semaines ISO, ancrés sur les
  // semaines paires (S20+S21, S22+S23, …). On suit toujours le PROCHAIN bloc :
  // pendant le bloc calendaire courant, c'est celui-là qu'on prépare et fait
  // signer. La cible avance donc par pas de 2 semaines, jamais d'une seule.
  const blockStart = paris.iso_week - (paris.iso_week % 2); // semaine paire du bloc courant
  const target = addIsoWeeks(paris.iso_year, blockStart, 2); // bloc suivant
  const targetYear = target.year;
  const targetWeek = target.week;
  const secondWeek = addIsoWeeks(targetYear, targetWeek, 1).week;
  const periodLabel = `S${targetWeek} + S${secondWeek}`;

  const totalEmployees = dt.sites.reduce((s, x) => s + x.employee_count, 0);

  const filtered = dt.plannings.filter(
    (e) => Number(e.iso_year) === targetYear && Number(e.start_week) === targetWeek && e.status !== 'voided'
  );
  const bestByEmployee = new Map<string, DTPlanning>();
  for (const e of filtered) {
    const key = `${e.site_id}::${e.employee_id}`;
    const cur = bestByEmployee.get(key);
    if (!cur || statusRank(e.status) > statusRank(cur.status)) {
      bestByEmployee.set(key, e);
    }
  }
  const uniqueSent = bestByEmployee.size;
  const completed = [...bestByEmployee.values()].filter((e) => e.status === 'completed').length;

  const latestSent = filtered.reduce((max, e) => {
    const t = new Date(e.sent_at).getTime();
    return t > max ? t : max;
  }, 0);
  const daysSinceSent = latestSent > 0 ? Math.floor((now - latestSent) / DAY_MS) : 0;

  // "Envoyé" dès qu'au moins un envelope existe (cf. note relevés).
  const sent = uniqueSent > 0;
  const signedPct = uniqueSent > 0 ? Math.round((completed / uniqueSent) * 100) : null;

  // Règle : à partir de lundi de la semaine N, si plannings N+N+1 pas envoyés → rouge
  // (le user a dit "à partir de lundi de la semaine N rouge")
  let status: Status;
  let label: string;
  let sub: string;

  if (!sent) {
    status = 'red';
    label = 'Non envoyé';
    sub = `Plannings S${targetWeek} et S${secondWeek} attendus`;
  } else {
    const sig = signaturStatus(signedPct ?? 0, daysSinceSent);
    status = sig.status;
    label = `✓ ${signedPct}% signé`;
    sub = sig.sub;
  }

  return {
    status, label, sub,
    period_label: periodLabel,
    sent,
    sent_at_label: sent ? formatSentDate(latestSent) : null,
    sent_count: uniqueSent,
    total_employees: totalEmployees,
    completed,
    signed_pct: signedPct,
    days_since_sent: daysSinceSent,
  };
}

// ── Signature : seuils appliqués dès l'envoi pour signaler les % faibles.
// Vert    : ≥ 95% (conforme)
// Orange  : 80-94% (à relancer) OU < 80% avant J+5 (à surveiller, on laisse le temps)
// Rouge   : < 80% ET J+5 dépassé (vraiment en retard, escalade)
function signaturStatus(pct: number, daysSinceSent: number): { status: Status; sub: string } {
  const jPrefix = `Envoyé · J+${daysSinceSent}`;
  if (pct >= 95) return { status: 'green',  sub: `${jPrefix} · Conforme` };
  if (pct >= 80) return { status: 'orange', sub: `${jPrefix} · À relancer` };
  // pct < 80
  if (daysSinceSent < 5) return { status: 'orange', sub: `${jPrefix} · À surveiller` };
  return { status: 'red', sub: `${jPrefix} · Signatures en retard` };
}

function statusRank(s: string): number {
  if (s === 'completed') return 4;
  if (s === 'signed') return 4;
  if (s === 'delivered') return 3;
  if (s === 'sent') return 2;
  if (s === 'created') return 1;
  return 0;
}

function formatSentDate(ts: number): string {
  if (!ts) return '—';
  const fmt = new Intl.DateTimeFormat('fr-FR', {
    timeZone: 'Europe/Paris',
    day: '2-digit', month: 'long',
  });
  return fmt.format(new Date(ts));
}

function unavailable(kind: string) {
  return {
    status: 'gray' as Status,
    label: 'Indisponible',
    sub: `Connexion à DepanTime impossible`,
    period_label: '—',
    sent: false,
    sent_count: 0,
    total_employees: 0,
    completed: 0,
    signed_pct: null as number | null,
    days_since_sent: 0,
    _kind: kind,
  };
}

// ── Helpers apps voisines (Flotte, Habilitation, Google) ─────
const num = (x: unknown): number =>
  typeof x === 'number' ? x : (Number(x) || 0);

// GET JSON avec timeout court ; lève en cas d'erreur HTTP.
async function fetchJson(
  url: string,
  bearer: string | null,
  extraHeaders: Record<string, string> = {}
): Promise<Record<string, unknown>> {
  const headers: Record<string, string> = { ...extraHeaders };
  if (bearer) headers.authorization = `Bearer ${bearer}`;
  const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`HTTP ${res.status} ${body.slice(0, 80)}`);
  }
  return (await res.json()) as Record<string, unknown>;
}

// ── Flotte : % de véhicules avec contrôle technique planifié ──
async function computeFlotte(env: Env) {
  if (!env.FLOTTE_URL || !env.FLOTTE_PILOTAGE_SECRET) {
    return flotteGray('non configuré');
  }
  try {
    const r = await fetchJson(
      `${env.FLOTTE_URL.replace(/\/$/, '')}/api/pilotage-public/snapshot`,
      env.FLOTTE_PILOTAGE_SECRET
    );
    const considered = num(r.fleet_considered);
    const planned = num(r.ct_planned);
    const overdue = num(r.ct_overdue);
    const missing = num(r.ct_missing);
    if (considered === 0) return flotteGray('aucun véhicule suivi');

    const pct = Math.round((planned / considered) * 100);
    let status: Status;
    let label: string;
    if (pct >= 95) { status = 'green'; label = 'Sous contrôle'; }
    else if (pct >= 80) { status = 'orange'; label = 'À surveiller'; }
    else { status = 'red'; label = 'Action requise'; }

    const toPlan = overdue + missing;
    const sub = toPlan > 0
      ? `${toPlan} véhicule${toPlan > 1 ? 's' : ''} à planifier · ${overdue} CT en retard`
      : `Les ${considered} véhicules suivis ont un CT planifié`;

    return { status, label, sub, pct, considered, planned, overdue, missing };
  } catch (e) {
    return flotteGray(e instanceof Error ? e.message : String(e));
  }
}

function flotteGray(reason: string) {
  return {
    status: 'gray' as Status,
    label: 'Indisponible',
    sub: 'Connexion à Flotte impossible',
    pct: null as number | null,
    considered: 0, planned: 0, overdue: 0, missing: 0,
    _error: reason,
  };
}

// ── Habilitation : taux de conformité documentaire moyen ─────
async function computeHabilitation(env: Env) {
  if (!env.HABILITATION_URL || !env.HABILITATION_PILOTAGE_SECRET) {
    return habilitationGray('non configuré');
  }
  try {
    const r = await fetchJson(
      `${env.HABILITATION_URL.replace(/\/$/, '')}/api/pilotage/snapshot`,
      null,
      { 'X-Pilotage-Secret': env.HABILITATION_PILOTAGE_SECRET }
    );
    const bs = (r.by_status ?? {}) as Record<string, unknown>;
    const green = num(bs.green);
    const orange = num(bs.orange);
    const red = num(bs.red);
    const driversTotal = num(r.drivers_total);
    const score = r.score_global == null ? null : num(r.score_global);
    if (score == null) return habilitationGray('aucune donnée de conformité');

    let status: Status;
    let label: string;
    if (score >= 90) { status = 'green'; label = 'Conforme'; }
    else if (score >= 75) { status = 'orange'; label = 'À compléter'; }
    else { status = 'red'; label = 'Non conforme'; }

    const sub = red > 0
      ? `${red} document${red > 1 ? 's' : ''} non conforme${red > 1 ? 's' : ''} · ${driversTotal} dépanneurs`
      : `${driversTotal} dépanneurs actifs · dossiers à jour`;

    return {
      status, label, sub, score,
      drivers_total: driversTotal,
      conformes: green + orange,
      non_conformes: red,
    };
  } catch (e) {
    return habilitationGray(e instanceof Error ? e.message : String(e));
  }
}

function habilitationGray(reason: string) {
  return {
    status: 'gray' as Status,
    label: 'Indisponible',
    sub: 'Connexion à Habilitation impossible',
    score: null as number | null,
    drivers_total: 0, conformes: 0, non_conformes: 0,
    _error: reason,
  };
}

// ── Avis Google : note par site, globale et activité du mois ──
// L'API Google Business Profile a un quota faible ; on met le
// résultat en cache 30 min dans D1 (table kv_cache). En cas
// d'échec, on sert le dernier cache disponible.
const GOOGLE_CACHE_KEY = 'google_reviews';
const GOOGLE_CACHE_TTL_MS = 30 * 60 * 1000;

async function computeGoogle(env: Env, now: number) {
  let cached: { data: GoogleReviewsData; updated_at: number } | null = null;
  try {
    const row = await env.DB
      .prepare('SELECT v, updated_at FROM kv_cache WHERE k = ?')
      .bind(GOOGLE_CACHE_KEY)
      .first<{ v: string; updated_at: number }>();
    if (row) cached = { data: JSON.parse(row.v), updated_at: row.updated_at };
  } catch { /* table absente → on refetch */ }

  let data: GoogleReviewsData | null = cached?.data ?? null;
  let updatedAt = cached?.updated_at ?? 0;
  let error: string | null = null;

  const stale = !cached || now - cached.updated_at > GOOGLE_CACHE_TTL_MS;
  if (!googleConfigured(env)) {
    error = 'non configuré';
  } else if (stale) {
    try {
      data = await fetchGoogleReviews(env);
      updatedAt = now;
      await env.DB
        .prepare(
          `INSERT INTO kv_cache (k, v, updated_at) VALUES (?, ?, ?)
           ON CONFLICT(k) DO UPDATE SET v = excluded.v, updated_at = excluded.updated_at`
        )
        .bind(GOOGLE_CACHE_KEY, JSON.stringify(data), now)
        .run();
    } catch (e) {
      // On conserve l'ancien cache (`data`) s'il existe.
      error = e instanceof Error ? e.message : String(e);
    }
  }

  return buildGoogleCard(data, updatedAt, error);
}

function ratingStatus(avg: number | null): Status {
  if (avg == null) return 'gray';
  if (avg >= 4.5) return 'green';
  if (avg >= 4.0) return 'orange';
  return 'red';
}

function buildGoogleCard(
  data: GoogleReviewsData | null,
  updatedAt: number,
  error: string | null
) {
  if (!data) {
    return {
      status: 'gray' as Status,
      error,
      updated_at: updatedAt,
      global: { status: 'gray' as Status, avg: null as number | null, count: 0 },
      month: { status: 'gray' as Status, avg: null as number | null, count: 0, one_star: 0 },
      sites: [] as { name: string; rating: number | null; review_count: number; status: Status }[],
    };
  }
  const oneStar = data.month_one_star;
  const monthStatus: Status = oneStar >= 3 ? 'red' : oneStar >= 1 ? 'orange' : 'green';
  return {
    // `stale` = on sert un cache mais le dernier refresh a échoué.
    status: error ? ('stale' as const) : ('ok' as const),
    error,
    updated_at: updatedAt,
    global: {
      status: ratingStatus(data.global_avg),
      avg: data.global_avg,
      count: data.global_count,
    },
    month: {
      status: monthStatus,
      avg: data.month_avg,
      count: data.month_count,
      one_star: oneStar,
    },
    sites: data.sites.map((s) => ({
      name: s.name,
      rating: s.rating,
      review_count: s.review_count,
      status: ratingStatus(s.rating),
    })),
  };
}
