// GET /api/pilotage/snapshot
// Agrège : devis (D1) + DepanTime (relevés + plannings), calcule les statuts
// rouge/orange/vert selon les règles métier et renvoie un JSON consolidé pour
// l'écran de pilotage. Auth : cookie `mdp_pilotage` ou ?token=…

import type { Env } from '../../_lib/env';
import { jsonResponse } from '../../_lib/html';
import { checkToken } from '../../_lib/auth';

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

  let status: Status;
  let label: string;
  if (open_over_2h > 0) {
    status = 'red';
    label = `${open_over_2h} en attente > 2h`;
  } else if (open > 0) {
    status = 'orange';
    label = `${open} à traiter`;
  } else {
    status = 'green';
    label = 'Tout traité';
  }

  return {
    status,
    label,
    today: today_n,
    last_7d, last_30d, open, open_over_2h,
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
    label = `${signedPct}% signé`;
    sub = sig.sub;
  }

  return {
    status, label, sub,
    period_label: periodLabel,
    sent,
    sent_count: uniqueSent,
    total_employees: totalEmployees,
    completed,
    signed_pct: signedPct,
    days_since_sent: daysSinceSent,
  };
}

// ── Plannings ────────────────────────────────────────────────
function computePlanningStatus(dt: DTSnapshot, paris: ReturnType<typeof parisYMD>, now: number) {
  // Cible : envelope dont start_week === current_iso_week (couvre N et N+1)
  const targetYear = paris.iso_year;
  const targetWeek = paris.iso_week;
  const periodLabel = `S${targetWeek} + S${targetWeek + 1}`;

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
    sub = `Plannings S${targetWeek} et S${targetWeek + 1} attendus`;
  } else {
    const sig = signaturStatus(signedPct ?? 0, daysSinceSent);
    status = sig.status;
    label = `${signedPct}% signé`;
    sub = sig.sub;
  }

  return {
    status, label, sub,
    period_label: periodLabel,
    sent,
    sent_count: uniqueSent,
    total_employees: totalEmployees,
    completed,
    signed_pct: signedPct,
    days_since_sent: daysSinceSent,
  };
}

// ── Signature : rouge < 80% à J+5, orange [80-94%], vert ≥ 95% ──
function signaturStatus(pct: number, daysSinceSent: number): { status: Status; sub: string } {
  if (daysSinceSent < 5) {
    // Pas encore J+5, pas d'alerte stricte, on indique "en cours"
    return { status: pct >= 95 ? 'green' : 'green', sub: `Envoyé il y a ${daysSinceSent} j` };
  }
  if (pct < 80) return { status: 'red', sub: 'Signatures en retard' };
  if (pct < 95) return { status: 'orange', sub: 'À relancer' };
  return { status: 'green', sub: 'Conforme' };
}

function statusRank(s: string): number {
  if (s === 'completed') return 4;
  if (s === 'signed') return 4;
  if (s === 'delivered') return 3;
  if (s === 'sent') return 2;
  if (s === 'created') return 1;
  return 0;
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
