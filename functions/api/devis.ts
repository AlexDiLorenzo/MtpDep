// POST /api/devis — création d'une demande de devis.
// 1. valide les champs
// 2. insère en D1
// 3. envoie un email à EMAIL_TO via Resend, avec un lien signé pour marquer traité
// 4. répond { ok: true, id } au front

import type { Env } from '../_lib/env';
import { signId, uuidv4 } from '../_lib/crypto';
import { jsonResponse, escapeHtml } from '../_lib/html';

const VEHICLE_TYPES = new Set(['VL', 'UTILITAIRE', 'PL']);
const MAX_LEN = { name: 120, phone: 30, email: 160, location: 200, destination: 200, details: 2000 };

interface FormPayload {
  name?: string;
  phone?: string;
  email?: string;
  vehicle_type?: string;
  location?: string;
  destination?: string;
  details?: string;
  consent_rgpd?: boolean;
  // anti-bot honeypot
  website?: string;
}

function clean(s: unknown, max: number): string | null {
  if (typeof s !== 'string') return null;
  const t = s.trim();
  if (!t) return null;
  return t.slice(0, max);
}

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const { request, env } = ctx;

  // Vérifie d'abord la conf : on préfère échouer fort qu'enregistrer une demande qui n'enverra jamais d'email
  const envBag = env as unknown as Record<string, unknown>;
  const missing = ['EMAIL_TO', 'RESEND_API_KEY', 'RESEND_FROM', 'DEVIS_SECRET', 'SITE_URL'].filter(
    (k) => !envBag[k]
  );
  if (missing.length) {
    // Log exhaustif pour diagnostiquer les pièges Cloudflare (Plaintext qui ne propage pas, etc.)
    const visibleKeys = Object.keys(envBag).sort();
    console.error('Missing env vars:', missing.join(', '));
    console.error('Env keys visible in runtime:', visibleKeys.join(', '));
    return jsonResponse(
      {
        ok: false,
        error: `config_missing: ${missing.join(', ')}`,
        debug_keys_visible: visibleKeys,
      },
      500
    );
  }

  let body: FormPayload;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: 'invalid_json' }, 400);
  }

  // Honeypot : si rempli, on ignore silencieusement (mais on retourne ok pour ne pas indiquer au bot que le filtre existe)
  if (body.website && body.website.trim()) {
    return jsonResponse({ ok: true, id: 'ignored' });
  }

  const phone = clean(body.phone, MAX_LEN.phone);
  if (!phone) {
    return jsonResponse({ ok: false, error: 'phone_required' }, 400);
  }
  if (!body.consent_rgpd) {
    return jsonResponse({ ok: false, error: 'consent_required' }, 400);
  }

  const name = clean(body.name, MAX_LEN.name);
  const email = clean(body.email, MAX_LEN.email);
  const vehicle_type = clean(body.vehicle_type, 20);
  const location = clean(body.location, MAX_LEN.location);
  const destination = clean(body.destination, MAX_LEN.destination);
  const details = clean(body.details, MAX_LEN.details);

  const vt = vehicle_type && VEHICLE_TYPES.has(vehicle_type) ? vehicle_type : null;

  const id = uuidv4();
  const created_at = Date.now();

  const ip_country = request.headers.get('cf-ipcountry') || null;
  const user_agent = (request.headers.get('user-agent') || '').slice(0, 200) || null;

  try {
    await env.DB.prepare(
      `INSERT INTO devis
       (id, created_at, name, phone, email, vehicle_type, location, destination, details, consent_rgpd, status, user_agent, ip_country)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 'open', ?, ?)`
    )
      .bind(id, created_at, name, phone, email, vt, location, destination, details, user_agent, ip_country)
      .run();
  } catch (e) {
    console.error('D1 insert error', e);
    return jsonResponse({ ok: false, error: 'db_error' }, 500);
  }

  // Lien signé pour marquer la demande comme traitée
  const token = await signId(id, env.DEVIS_SECRET);
  const treatUrl = `${env.SITE_URL.replace(/\/$/, '')}/api/devis/${id}/traiter?t=${token}`;

  // Email Resend (n'attend pas la réponse pour ne pas bloquer si Resend rate-limit ; mais on log)
  const subject = `[Devis MDP] ${name ?? 'Sans nom'} — ${vt ?? 'véhicule non précisé'}`;
  const html = renderEmail({ id, name, phone, email, vt, location, destination, details, treatUrl, created_at });

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'authorization': `Bearer ${env.RESEND_API_KEY}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        from: env.RESEND_FROM,
        to: env.EMAIL_TO, // string, pas tableau — Resend accepte les deux mais string évite les pièges null
        subject,
        html,
        reply_to: email || undefined,
      }),
    });
    if (!res.ok) {
      const errBody = await res.text();
      console.error(`Resend failed ${res.status}:`, errBody);
    }
  } catch (e) {
    console.error('Resend exception', e);
    // On n'échoue pas la requête côté user — la demande est en D1, l'alerte WhatsApp suivra
  }

  return jsonResponse({ ok: true, id });
};

function renderEmail(d: {
  id: string;
  name: string | null;
  phone: string;
  email: string | null;
  vt: string | null;
  location: string | null;
  destination: string | null;
  details: string | null;
  treatUrl: string;
  created_at: number;
}): string {
  const dt = new Date(d.created_at).toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
  const phoneHref = d.phone.replace(/\s+/g, '');
  return `<!DOCTYPE html>
<html lang="fr"><body style="margin:0;padding:0;background:#F1EFE8;font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#1A190F;">
  <div style="max-width:600px;margin:0 auto;padding:24px;">
    <div style="background:#2C6126;color:#fff;padding:18px 22px;border-radius:8px 8px 0 0;">
      <div style="font-size:11px;letter-spacing:0.12em;text-transform:uppercase;opacity:0.8;font-weight:700;">Nouvelle demande de devis</div>
      <div style="font-size:20px;font-weight:700;margin-top:4px;">${escapeHtml(d.name ?? 'Sans nom')}</div>
      <div style="font-size:12px;opacity:0.85;margin-top:4px;">${escapeHtml(dt)} · #${escapeHtml(d.id.slice(0, 8))}</div>
    </div>
    <div style="background:#fff;padding:24px 22px;border:1px solid #D3D1C7;border-top:none;">
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:8px 0;width:130px;color:#5F5E5A;">Téléphone</td>
            <td style="padding:8px 0;font-weight:700;"><a style="color:#2C6126;text-decoration:none;" href="tel:${escapeHtml(phoneHref)}">${escapeHtml(d.phone)}</a></td></tr>
        ${d.email ? `<tr><td style="padding:8px 0;color:#5F5E5A;">Email</td><td style="padding:8px 0;"><a style="color:#2C6126;" href="mailto:${escapeHtml(d.email)}">${escapeHtml(d.email)}</a></td></tr>` : ''}
        ${d.vt ? `<tr><td style="padding:8px 0;color:#5F5E5A;">Véhicule</td><td style="padding:8px 0;font-weight:700;">${escapeHtml(d.vt)}</td></tr>` : ''}
        ${d.location ? `<tr><td style="padding:8px 0;color:#5F5E5A;vertical-align:top;">Lieu</td><td style="padding:8px 0;">${escapeHtml(d.location)}</td></tr>` : ''}
        ${d.destination ? `<tr><td style="padding:8px 0;color:#5F5E5A;vertical-align:top;">Destination</td><td style="padding:8px 0;">${escapeHtml(d.destination)}</td></tr>` : ''}
        ${d.details ? `<tr><td style="padding:8px 0;color:#5F5E5A;vertical-align:top;">Détails</td><td style="padding:8px 0;white-space:pre-wrap;">${escapeHtml(d.details)}</td></tr>` : ''}
      </table>

      <div style="margin-top:24px;padding-top:20px;border-top:1px solid #D3D1C7;">
        <a href="${escapeHtml(d.treatUrl)}"
           style="display:inline-block;background:#E4E13C;color:#1A190F;font-weight:700;padding:14px 22px;border-radius:8px;text-decoration:none;font-size:14px;">
          ✓ Marquer cette demande comme traitée
        </a>
        <div style="margin-top:10px;font-size:11px;color:#5F5E5A;">
          Sans clic sous 2&nbsp;heures, une alerte WhatsApp est envoyée.
        </div>
      </div>
    </div>
  </div>
</body></html>`;
}
