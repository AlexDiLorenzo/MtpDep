// GET /api/cron/check-overdue
// À appeler toutes les ~10 minutes par un cron externe (cron-job.org, GitHub Actions…).
// Header requis : Authorization: Bearer ${CRON_SECRET}
//
// Logique :
// 1. lit les devis ouverts depuis >2h sans alerte déjà envoyée
// 2. pour chacun, POST WhatsApp via Evolution API
// 3. marque alert_sent_at pour ne pas spammer

import type { Env, DevisRow } from '../../_lib/env';
import { jsonResponse } from '../../_lib/html';

const TWO_HOURS_MS = 2 * 60 * 60 * 1000;

export const onRequest: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  const auth = request.headers.get('authorization') || '';
  if (!env.CRON_SECRET || auth !== `Bearer ${env.CRON_SECRET}`) {
    return jsonResponse({ ok: false, error: 'unauthorized' }, 401);
  }

  const cutoff = Date.now() - TWO_HOURS_MS;

  const { results } = await env.DB.prepare(
    `SELECT * FROM devis
     WHERE status = 'open'
       AND alert_sent_at IS NULL
       AND created_at < ?
     ORDER BY created_at ASC
     LIMIT 50`
  )
    .bind(cutoff)
    .all<DevisRow>();

  const overdue = results ?? [];
  const sent: string[] = [];
  const failed: { id: string; error: string }[] = [];

  for (const row of overdue) {
    try {
      await sendWhatsApp(env, row);
      await env.DB.prepare(`UPDATE devis SET alert_sent_at = ? WHERE id = ?`)
        .bind(Date.now(), row.id)
        .run();
      sent.push(row.id);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error(`WhatsApp alert failed for ${row.id}`, msg);
      failed.push({ id: row.id, error: msg });
    }
  }

  return jsonResponse({
    ok: true,
    checked_at: new Date().toISOString(),
    overdue_count: overdue.length,
    sent_count: sent.length,
    failed_count: failed.length,
    failed,
  });
};

async function sendWhatsApp(env: Env, row: DevisRow): Promise<void> {
  const created = new Date(row.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const ageMin = Math.round((Date.now() - row.created_at) / 60000);
  const ageTxt = ageMin < 60 ? `${ageMin} min` : `${Math.floor(ageMin / 60)} h ${ageMin % 60} min`;

  const lines = [
    `🚨 *Devis non traité — ${ageTxt}*`,
    ``,
    `*${row.name ?? 'Sans nom'}*`,
    `📞 ${row.phone}`,
    row.email ? `✉️ ${row.email}` : null,
    row.vehicle_type ? `🚗 ${row.vehicle_type}` : null,
    row.location ? `📍 ${row.location}` : null,
    ``,
    row.details ? row.details.slice(0, 300) : null,
    ``,
    `Reçu le ${created}`,
    `ID: ${row.id.slice(0, 8)}`,
  ].filter(Boolean);

  const text = lines.join('\n');

  const url = `${env.EVOLUTION_API_URL.replace(/\/$/, '')}/message/sendText/${encodeURIComponent(env.EVOLUTION_INSTANCE)}`;

  // Evolution API attend généralement le JID complet (33XXX@s.whatsapp.net pour un perso,
  // @g.us pour un groupe). On ajoute le suffixe si l'utilisateur a mis juste le numéro.
  const number = env.ALERT_PHONE.includes('@')
    ? env.ALERT_PHONE
    : `${env.ALERT_PHONE.replace(/\D/g, '')}@s.whatsapp.net`;

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'apikey': env.EVOLUTION_API_KEY,
      'content-type': 'application/json',
    },
    body: JSON.stringify({ number, text }),
  });

  const respBody = await res.text().catch(() => '');
  if (!res.ok) {
    throw new Error(`Evolution ${res.status}: ${respBody.slice(0, 300)}`);
  }
  console.log(`Evolution OK → ${number} (${respBody.slice(0, 80)})`);
}
