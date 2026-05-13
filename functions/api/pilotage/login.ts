// POST /api/pilotage/login — pose le cookie mdp_pilotage si le token correspond.
import type { Env } from '../../_lib/env';
import { jsonResponse } from '../../_lib/html';
import { makeAuthCookie, timingSafeEqual } from '../../_lib/auth';

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  let body: { token?: string } = {};
  try { body = await ctx.request.json(); } catch { /* fallthrough */ }
  const token = String(body?.token || '');
  const expected = ctx.env.PILOTAGE_TOKEN;
  if (!expected || !token || !timingSafeEqual(token, expected)) {
    return jsonResponse({ ok: false, error: 'invalid_token' }, 401);
  }
  const headers = new Headers({
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  });
  headers.append('set-cookie', makeAuthCookie('mdp_pilotage', token));
  return new Response(JSON.stringify({ ok: true }), { headers });
};
