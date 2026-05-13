// GET /admin?token=...
// Dashboard SSR : KPIs + courbe quotidienne + liste des dernières demandes.
// Auth basique : token en query string ou cookie httpOnly (set au premier passage avec ?token=).

import type { Env, DevisRow } from '../_lib/env';
import { htmlResponse, escapeHtml, jsonResponse } from '../_lib/html';

const COOKIE_NAME = 'mdp_admin';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 jours

const DAY_MS = 24 * 60 * 60 * 1000;
const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  const cookieToken = parseCookie(request.headers.get('cookie'))[COOKIE_NAME];
  const expected = env.ADMIN_TOKEN;

  const provided = queryToken || cookieToken;
  if (!expected || !provided || !timingSafeEqual(provided, expected)) {
    return renderLogin(provided ? 'Token invalide.' : null);
  }

  // Filtres optionnels
  const filter = url.searchParams.get('filter') || 'all'; // all | open | treated

  const now = Date.now();
  const windows = [
    { key: 'today', label: "Aujourd'hui", since: startOfDay(now) },
    { key: '7d', label: '7 derniers jours', since: now - 7 * DAY_MS },
    { key: '30d', label: '30 derniers jours', since: now - 30 * DAY_MS },
    { key: 'all', label: 'Total', since: 0 },
  ] as const;

  const kpis = await Promise.all(
    windows.map(async (w) => {
      const r = await env.DB.prepare(
        `SELECT
           COUNT(*) AS total,
           SUM(CASE WHEN status = 'treated' THEN 1 ELSE 0 END) AS treated,
           SUM(CASE WHEN status = 'treated' AND treated_at - created_at <= ? THEN 1 ELSE 0 END) AS treated_under_2h
         FROM devis
         WHERE created_at >= ?`
      )
        .bind(TWO_HOURS_MS, w.since)
        .first<{ total: number; treated: number; treated_under_2h: number }>();

      const total = r?.total ?? 0;
      const treated = r?.treated ?? 0;
      const treated2h = r?.treated_under_2h ?? 0;
      return {
        ...w,
        total,
        treated,
        treated_pct: total > 0 ? Math.round((treated / total) * 100) : 0,
        sla_pct: treated > 0 ? Math.round((treated2h / treated) * 100) : 0,
      };
    })
  );

  // Médiane de temps de traitement (sur les 90 derniers jours)
  const treatedDurations = await env.DB.prepare(
    `SELECT (treated_at - created_at) AS d FROM devis
     WHERE status = 'treated' AND created_at >= ? ORDER BY d ASC`
  )
    .bind(now - 90 * DAY_MS)
    .all<{ d: number }>();
  const durs = (treatedDurations.results ?? []).map((r) => r.d).filter((d) => d != null);
  const median = durs.length ? durs[Math.floor(durs.length / 2)] : 0;

  // Clics "Appeler" (liens tel:) — gère le cas où la table n'existe pas encore
  let callsToday = 0, calls7d = 0, calls30d = 0, callsTotal = 0;
  try {
    const callRow = await env.DB.prepare(
      `SELECT
         SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS today,
         SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS d7,
         SUM(CASE WHEN created_at >= ? THEN 1 ELSE 0 END) AS d30,
         COUNT(*) AS total
       FROM call_clicks`
    )
      .bind(startOfDay(now), now - 7 * DAY_MS, now - 30 * DAY_MS)
      .first<{ today: number; d7: number; d30: number; total: number }>();
    callsToday = callRow?.today ?? 0;
    calls7d = callRow?.d7 ?? 0;
    calls30d = callRow?.d30 ?? 0;
    callsTotal = callRow?.total ?? 0;
  } catch { /* table call_clicks absente → on garde 0 */ }

  // Courbe sur 30 jours (par jour local)
  const dailyRows = await env.DB.prepare(
    `SELECT created_at, status FROM devis WHERE created_at >= ? ORDER BY created_at ASC`
  )
    .bind(now - 30 * DAY_MS)
    .all<{ created_at: number; status: string }>();
  const daily = bucketByDay(dailyRows.results ?? [], 30);

  // Liste (filtrée)
  let listSql = `SELECT * FROM devis`;
  const binds: unknown[] = [];
  if (filter === 'open') {
    listSql += ` WHERE status = 'open'`;
  } else if (filter === 'treated') {
    listSql += ` WHERE status = 'treated'`;
  }
  listSql += ` ORDER BY created_at DESC LIMIT 50`;
  const list = await env.DB.prepare(listSql).bind(...binds).all<DevisRow>();

  const html = renderDashboard({
    kpis,
    median,
    daily,
    list: list.results ?? [],
    filter,
    calls: { today: callsToday, d7: calls7d, d30: calls30d, total: callsTotal },
  });

  // Set cookie au passage si le token est passé en query
  const headers = new Headers({ 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' });
  if (queryToken) {
    headers.append(
      'set-cookie',
      `${COOKIE_NAME}=${encodeURIComponent(queryToken)}; Path=/; Max-Age=${COOKIE_MAX_AGE}; HttpOnly; Secure; SameSite=Lax`
    );
  }
  return new Response(html, { headers });
};

// POST /admin (form login)
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const formData = await ctx.request.formData();
  const token = String(formData.get('token') || '');
  const url = new URL(ctx.request.url);
  url.searchParams.set('token', token);
  return new Response(null, { status: 302, headers: { location: url.pathname + url.search } });
};

// DELETE /admin?id=<uuid> — supprime un devis (utile pour purger les tests)
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;
  const url = new URL(request.url);
  const queryToken = url.searchParams.get('token');
  const cookieToken = parseCookie(request.headers.get('cookie'))[COOKIE_NAME];
  const expected = env.ADMIN_TOKEN;
  const provided = queryToken || cookieToken;
  if (!expected || !provided || !timingSafeEqual(provided, expected)) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }

  const id = url.searchParams.get('id');
  // Accepte UUID v4 ou tout ID alphanumérique court (rows de seed/test).
  // La requête SQL est paramétrée donc pas de risque d'injection.
  if (!id || id.length > 64 || !/^[A-Za-z0-9_-]+$/.test(id)) {
    return jsonResponse({ ok: false, error: 'bad_id' }, 400);
  }

  try {
    const res = await env.DB.prepare('DELETE FROM devis WHERE id = ?').bind(id).run();
    return jsonResponse({ ok: true, deleted: res.meta?.changes ?? 0 });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: 'db_error', debug: msg.slice(0, 300) }, 500);
  }
};

// ---------- helpers ----------

function startOfDay(ms: number): number {
  const d = new Date(ms);
  d.setHours(0, 0, 0, 0);
  return d.getTime();
}

function bucketByDay(
  rows: { created_at: number; status: string }[],
  days: number
): { date: string; total: number; treated: number }[] {
  const today = startOfDay(Date.now());
  const buckets: { date: string; total: number; treated: number }[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today - i * DAY_MS);
    const iso = d.toISOString().slice(0, 10);
    buckets.push({ date: iso, total: 0, treated: 0 });
  }
  const idx = new Map(buckets.map((b, i) => [b.date, i] as const));
  for (const r of rows) {
    const iso = new Date(startOfDay(r.created_at)).toISOString().slice(0, 10);
    const i = idx.get(iso);
    if (i == null) continue;
    buckets[i].total++;
    if (r.status === 'treated') buckets[i].treated++;
  }
  return buckets;
}

function parseCookie(header: string | null): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(';')) {
    const [k, ...rest] = part.trim().split('=');
    if (k) out[k] = decodeURIComponent(rest.join('='));
  }
  return out;
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function fmtDuration(ms: number): string {
  if (!ms || ms < 0) return '—';
  const min = Math.round(ms / 60000);
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h < 24) return `${h} h ${m} min`;
  const d = Math.floor(h / 24);
  return `${d} j ${h % 24} h`;
}

function fmtDateTime(ms: number): string {
  return new Date(ms).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
}

// ---------- rendering ----------

function renderLogin(error: string | null): Response {
  return htmlResponse(`<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Admin — Montpellier Dépannage</title>
<style>
  body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #FAFAF7; color: #1A190F; min-height: 100vh; display: flex; align-items: center; justify-content: center; }
  form { background: #fff; border: 1px solid #D3D1C7; border-radius: 16px; padding: 36px 32px; width: min(420px, 92vw); box-shadow: 0 4px 14px rgba(26,25,15,0.08); }
  h1 { font-family: 'Space Grotesk', sans-serif; margin: 0 0 22px; color: #2C6126; font-size: 22px; }
  input { width: 100%; padding: 12px 14px; border: 1px solid #D3D1C7; border-radius: 8px; font-size: 14px; box-sizing: border-box; }
  button { margin-top: 14px; width: 100%; padding: 12px; background: #2C6126; color: #fff; border: 0; border-radius: 8px; font-weight: 700; cursor: pointer; font-size: 14px; }
  .err { margin-top: 12px; color: #A32D2D; font-size: 13px; }
</style></head><body>
<form method="post" action="/admin">
  <h1>Accès admin</h1>
  <input name="token" type="password" placeholder="Token admin" autofocus required />
  <button type="submit">Se connecter</button>
  ${error ? `<div class="err">${escapeHtml(error)}</div>` : ''}
</form></body></html>`,
    error ? 401 : 200
  );
}

function renderDashboard(data: {
  kpis: { key: string; label: string; total: number; treated: number; treated_pct: number; sla_pct: number }[];
  median: number;
  daily: { date: string; total: number; treated: number }[];
  list: DevisRow[];
  filter: string;
  calls: { today: number; d7: number; d30: number; total: number };
}): string {
  const max = Math.max(1, ...data.daily.map((d) => d.total));
  const w = 720, h = 160, padL = 20, padR = 8, padT = 8, padB = 24;
  const innerW = w - padL - padR, innerH = h - padT - padB;
  const stepX = data.daily.length > 1 ? innerW / (data.daily.length - 1) : 0;
  const points = data.daily.map((d, i) => {
    const x = padL + i * stepX;
    const y = padT + innerH - (d.total / max) * innerH;
    return [x, y, d] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
  const area = `${path} L ${points[points.length - 1][0].toFixed(1)} ${(padT + innerH).toFixed(1)} L ${points[0][0].toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  const totalAll = data.kpis.find((k) => k.key === 'all')?.total ?? 0;
  const treatedAll = data.kpis.find((k) => k.key === 'all')?.treated ?? 0;
  const openAll = totalAll - treatedAll;

  return `<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="utf-8" /><meta name="viewport" content="width=device-width,initial-scale=1" />
<title>Admin — Devis MDP</title>
<style>
  :root { --green: #2C6126; --green-bg: #F1F7EC; --yellow: #E4E13C; --bg: #FAFAF7; --line: #D3D1C7; --muted: #5F5E5A; --text: #1A190F; }
  * { box-sizing: border-box; }
  body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: var(--bg); color: var(--text); }
  header { background: #fff; border-bottom: 1px solid var(--line); padding: 18px 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; }
  header h1 { font-family: 'Space Grotesk', sans-serif; margin: 0; font-size: 20px; color: var(--green); }
  header .right { display: flex; align-items: center; gap: 16px; font-size: 12px; color: var(--muted); }
  main { max-width: 1100px; margin: 0 auto; padding: 28px; display: flex; flex-direction: column; gap: 24px; }
  .kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
  .kpi { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 18px 18px 16px; position: relative; overflow: hidden; }
  .kpi::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: linear-gradient(90deg, var(--green), var(--yellow)); }
  .kpi-label { font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  .kpi-value { font-family: 'Space Grotesk', sans-serif; font-size: 28px; font-weight: 700; margin-top: 6px; line-height: 1; }
  .kpi-sub { margin-top: 8px; font-size: 12px; color: var(--muted); display: flex; gap: 12px; }
  .kpi-sub strong { color: var(--text); font-weight: 700; }
  .panel { background: #fff; border: 1px solid var(--line); border-radius: 12px; padding: 20px 22px; }
  .panel h2 { margin: 0 0 14px; font-family: 'Space Grotesk', sans-serif; font-size: 16px; }
  .grid-2 { display: grid; grid-template-columns: 1.4fr 1fr; gap: 16px; }
  .stat-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 13px; }
  .stat-row:last-child { border: 0; }
  .stat-row strong { font-family: 'Space Grotesk', sans-serif; }
  .filters { display: flex; gap: 6px; }
  .filters a { padding: 6px 12px; border-radius: 999px; text-decoration: none; font-size: 12px; font-weight: 700; border: 1px solid var(--line); color: var(--text); }
  .filters a.active { background: var(--green); color: #fff; border-color: var(--green); }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { text-align: left; padding: 10px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
  th { font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); font-weight: 700; }
  td.col-name { font-weight: 700; }
  td.col-phone { font-family: ui-monospace, SFMono-Regular, monospace; }
  .badge { display: inline-block; padding: 3px 8px; border-radius: 999px; font-size: 11px; font-weight: 700; }
  .badge-open { background: #FCEBEB; color: #A32D2D; }
  .badge-treated { background: var(--green-bg); color: var(--green); }
  .badge-alert { background: #FFF3CD; color: #856404; margin-left: 6px; }
  .btn-del { padding: 4px 9px; background: transparent; border: 1px solid var(--line); border-radius: 6px; color: var(--muted); font-size: 11px; font-weight: 700; cursor: pointer; transition: all 0.12s ease; }
  .btn-del:hover { background: #FCEBEB; border-color: #A32D2D; color: #A32D2D; }
  .btn-del:disabled { opacity: 0.4; cursor: wait; }
  svg .area { fill: rgba(44,97,38,0.18); }
  svg .line { fill: none; stroke: var(--green); stroke-width: 2; }
  svg text { font-family: ui-monospace, monospace; font-size: 9px; fill: var(--muted); }
  @media (max-width: 800px) { .kpis { grid-template-columns: repeat(2, 1fr); } .grid-2 { grid-template-columns: 1fr; } main { padding: 16px; } table { font-size: 12px; } }
</style></head><body>
<header>
  <h1>Devis · Tableau de bord</h1>
  <div class="right">
    <span><strong>${totalAll}</strong> demandes · <strong>${openAll}</strong> ouvertes</span>
  </div>
</header>
<main>
  <section class="kpis">
    ${data.kpis
      .map(
        (k) => `
      <div class="kpi">
        <div class="kpi-label">${escapeHtml(k.label)}</div>
        <div class="kpi-value">${k.total}</div>
        <div class="kpi-sub">
          <span><strong>${k.treated_pct}%</strong> traitées</span>
          <span><strong>${k.sla_pct}%</strong> &lt;2h</span>
        </div>
      </div>`
      )
      .join('')}
  </section>

  <section class="grid-2">
    <div class="panel">
      <h2>Volume sur 30 jours</h2>
      <svg viewBox="0 0 ${w} ${h}" width="100%" height="${h}">
        <path class="area" d="${area}" />
        <path class="line" d="${path}" />
        ${points
          .filter((_, i) => i % 5 === 0 || i === points.length - 1)
          .map(([x, , d]) => `<text x="${x.toFixed(1)}" y="${h - 6}" text-anchor="middle">${d.date.slice(5)}</text>`)
          .join('')}
      </svg>
    </div>
    <div class="panel">
      <h2>Performance</h2>
      <div class="stat-row"><span>Médiane temps de traitement</span><strong>${escapeHtml(fmtDuration(data.median))}</strong></div>
      <div class="stat-row"><span>Demandes ouvertes</span><strong>${openAll}</strong></div>
      <div class="stat-row"><span>Total traitées</span><strong>${treatedAll}</strong></div>
      <div class="stat-row"><span>Clics « Appeler » aujourd'hui</span><strong>${data.calls.today}</strong></div>
      <div class="stat-row"><span>Clics « Appeler » 7&nbsp;j / 30&nbsp;j</span><strong>${data.calls.d7} / ${data.calls.d30}</strong></div>
      <div class="stat-row"><span>Clics « Appeler » total</span><strong>${data.calls.total}</strong></div>
    </div>
  </section>

  <section class="panel">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;flex-wrap:wrap;gap:12px;">
      <h2 style="margin:0;">Demandes récentes</h2>
      <div class="filters">
        <a href="?filter=all" class="${data.filter === 'all' ? 'active' : ''}">Toutes</a>
        <a href="?filter=open" class="${data.filter === 'open' ? 'active' : ''}">Ouvertes</a>
        <a href="?filter=treated" class="${data.filter === 'treated' ? 'active' : ''}">Traitées</a>
      </div>
    </div>
    ${
      data.list.length === 0
        ? '<p style="color:var(--muted);font-size:13px;">Aucune demande pour ce filtre.</p>'
        : `<div style="overflow-x:auto;"><table>
      <thead><tr><th>Reçue</th><th>Nom</th><th>Téléphone</th><th>Véhicule</th><th>Départ → Destination</th><th>Statut</th><th>Délai</th><th></th></tr></thead>
      <tbody>${data.list
        .map((r) => {
          const elapsed = r.status === 'treated' && r.treated_at ? r.treated_at - r.created_at : Date.now() - r.created_at;
          const trip = [r.location, r.destination].filter(Boolean).map((s) => (s as string).slice(0, 40)).join(' → ') || '—';
          return `<tr data-id="${escapeHtml(r.id)}">
        <td>${escapeHtml(fmtDateTime(r.created_at))}</td>
        <td class="col-name">${escapeHtml(r.name ?? '—')}</td>
        <td class="col-phone">${escapeHtml(r.phone)}</td>
        <td>${escapeHtml(r.vehicle_type ?? '—')}</td>
        <td>${escapeHtml(trip)}</td>
        <td>${
          r.status === 'treated'
            ? '<span class="badge badge-treated">Traitée</span>'
            : `<span class="badge badge-open">Ouverte</span>${r.alert_sent_at ? '<span class="badge badge-alert">Alerte envoyée</span>' : ''}`
        }</td>
        <td>${escapeHtml(fmtDuration(elapsed))}</td>
        <td><button type="button" class="btn-del" data-del="${escapeHtml(r.id)}" title="Supprimer ce devis">Supprimer</button></td>
      </tr>`;
        })
        .join('')}</tbody></table></div>`
    }
  </section>
</main>
<script>
  document.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const btn = target.closest('[data-del]');
    if (!btn) return;
    const id = btn.getAttribute('data-del');
    if (!id) return;
    const row = btn.closest('tr');
    const label = row ? (row.querySelector('.col-name')?.textContent || '').trim() : id;
    if (!confirm('Supprimer définitivement le devis : ' + (label || id) + ' ?')) return;
    btn.setAttribute('disabled', 'true');
    btn.textContent = '...';
    try {
      const res = await fetch('/admin?id=' + encodeURIComponent(id), { method: 'DELETE' });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.ok) {
        alert('Échec de la suppression : ' + (json.debug || json.error || res.status));
        btn.removeAttribute('disabled');
        btn.textContent = 'Supprimer';
        return;
      }
      if (row) row.remove();
    } catch (err) {
      alert('Erreur réseau : ' + (err && err.message ? err.message : err));
      btn.removeAttribute('disabled');
      btn.textContent = 'Supprimer';
    }
  });
</script>
</body></html>`;
}
