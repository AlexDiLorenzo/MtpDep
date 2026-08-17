// POST /api/track-call
// Tracking minimaliste des clics sur les liens "Appeler" (a[href^="tel:"]).
// Fire-and-forget côté front (avec keepalive). Pas d'auth — la donnée est
// agrégée (compteurs) et c'est cohérent avec une analyse simple de l'engagement.

import type { Env } from '../_lib/env';
import { jsonResponse } from '../_lib/html';
import { isSameOrigin } from '../_lib/auth';

interface Body { source?: string }

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  if (!isSameOrigin(ctx.request)) {
    return jsonResponse({ ok: false, error: 'forbidden_origin' }, 403);
  }
  const length = Number(ctx.request.headers.get('content-length') || 0);
  if (length > 2048) return jsonResponse({ ok: false, error: 'payload_too_large' }, 413);
  let body: Body = {};
  try { body = await ctx.request.json(); } catch { /* fallthrough */ }

  const source = (typeof body.source === 'string' ? body.source : '').slice(0, 120) || null;
  const ip_country = ctx.request.headers.get('cf-ipcountry') || null;
  const created_at = Date.now();

  try {
    await ctx.env.DB.prepare(
      `INSERT INTO call_clicks (created_at, source, user_agent, ip_country, referer)
       VALUES (?, ?, NULL, ?, NULL)`
    )
      .bind(created_at, source, ip_country)
      .run();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('Call tracking D1 error', msg);
    return jsonResponse({ ok: false, error: 'db_error' }, 500);
  }

  return jsonResponse({ ok: true });
};
