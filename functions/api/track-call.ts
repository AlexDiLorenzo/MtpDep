// POST /api/track-call
// Tracking minimaliste des clics sur les liens "Appeler" (a[href^="tel:"]).
// Fire-and-forget côté front (avec keepalive). Pas d'auth — la donnée est
// agrégée (compteurs) et c'est cohérent avec une analyse simple de l'engagement.

import type { Env } from '../_lib/env';
import { jsonResponse } from '../_lib/html';

interface Body { source?: string }

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: Body = {};
  try { body = await ctx.request.json(); } catch { /* fallthrough */ }

  const source = (typeof body.source === 'string' ? body.source : '').slice(0, 120) || null;
  const user_agent = (ctx.request.headers.get('user-agent') || '').slice(0, 200) || null;
  const ip_country = ctx.request.headers.get('cf-ipcountry') || null;
  const referer = (ctx.request.headers.get('referer') || '').slice(0, 200) || null;
  const created_at = Date.now();

  try {
    await ctx.env.DB.prepare(
      `INSERT INTO call_clicks (created_at, source, user_agent, ip_country, referer)
       VALUES (?, ?, ?, ?, ?)`
    )
      .bind(created_at, source, user_agent, ip_country, referer)
      .run();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return jsonResponse({ ok: false, error: 'db_error', debug: msg.slice(0, 300) }, 500);
  }

  return jsonResponse({ ok: true });
};
