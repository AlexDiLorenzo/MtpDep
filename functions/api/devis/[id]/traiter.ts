// GET /api/devis/:id/traiter?t=<token>
// Lien signé envoyé dans l'email — un clic marque la demande comme traitée.

import type { Env, DevisRow } from '../../../_lib/env';
import { verifyId } from '../../../_lib/crypto';
import { htmlResponse, escapeHtml } from '../../../_lib/html';

export const onRequestGet: PagesFunction<Env, 'id'> = async (ctx) => {
  const { params, request, env } = ctx;
  const id = params.id as string;
  const url = new URL(request.url);
  const token = url.searchParams.get('t') || '';

  if (!id || !token) {
    return htmlResponse(layout('Lien invalide', '<p>Lien manquant ou incomplet.</p>'), 400);
  }

  const ok = await verifyId(id, token, env.DEVIS_SECRET);
  if (!ok) {
    return htmlResponse(layout('Lien invalide', '<p>Le lien a été modifié ou est expiré.</p>'), 403);
  }

  const row = await env.DB.prepare(
    `SELECT * FROM devis WHERE id = ? LIMIT 1`
  )
    .bind(id)
    .first<DevisRow>();

  if (!row) {
    return htmlResponse(layout('Demande introuvable', `<p>Aucune demande avec l'identifiant <code>${escapeHtml(id)}</code>.</p>`), 404);
  }

  if (row.status === 'treated') {
    const dt = row.treated_at ? new Date(row.treated_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' }) : '';
    return htmlResponse(
      layout(
        'Déjà traitée',
        `<p>Cette demande a déjà été marquée comme traitée${dt ? ` le ${escapeHtml(dt)}` : ''}.</p>
         <p style="color:#5F5E5A;font-size:13px;">Aucune alerte WhatsApp ne sera envoyée.</p>`
      )
    );
  }

  const treated_at = Date.now();
  await env.DB.prepare(
    `UPDATE devis SET status = 'treated', treated_at = ? WHERE id = ? AND status = 'open'`
  )
    .bind(treated_at, id)
    .run();

  const elapsed = treated_at - row.created_at;
  const min = Math.round(elapsed / 60000);
  const elapsedTxt = min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${min % 60} min`;

  return htmlResponse(
    layout(
      'Demande traitée ✓',
      `<p>La demande de <strong>${escapeHtml(row.name ?? row.phone)}</strong> est marquée comme traitée.</p>
       <p style="color:#5F5E5A;font-size:13px;">Délai de traitement : <strong>${escapeHtml(elapsedTxt)}</strong>. Aucune alerte ne sera envoyée.</p>`
    )
  );
};

function layout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr"><head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)} — Montpellier Dépannage</title>
<style>
  body { margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; background: #FAFAF7; color: #1A190F; }
  main { max-width: 540px; margin: 80px auto; padding: 0 24px; }
  .card { background: #fff; border: 1px solid #D3D1C7; border-radius: 16px; padding: 36px 32px; box-shadow: 0 4px 14px rgba(26,25,15,0.08); }
  h1 { font-family: 'Space Grotesk', sans-serif; font-size: 28px; margin: 0 0 18px; color: #2C6126; }
  p { line-height: 1.6; }
  code { background: #F1EFE8; padding: 2px 6px; border-radius: 4px; font-size: 13px; }
  .muted { font-size: 11px; color: #888780; margin-top: 24px; letter-spacing: 0.06em; text-transform: uppercase; font-weight: 700; }
</style></head><body>
<main><div class="card">
  <h1>${escapeHtml(title)}</h1>
  ${body}
  <div class="muted">Montpellier Dépannage</div>
</div></main></body></html>`;
}
