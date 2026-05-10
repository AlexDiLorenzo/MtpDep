// Typage des variables d'env / bindings injectés par Cloudflare Pages.

export interface Env {
  // Bindings
  DB: D1Database;

  // Secrets (à configurer dans Pages → Settings → Environment variables)
  RESEND_API_KEY: string;
  RESEND_FROM: string;
  EMAIL_TO: string;

  DEVIS_SECRET: string;
  ADMIN_TOKEN: string;
  CRON_SECRET: string;

  EVOLUTION_API_URL: string;
  EVOLUTION_API_KEY: string;
  EVOLUTION_INSTANCE: string;
  ALERT_PHONE: string;

  SITE_URL: string;
}

export interface DevisRow {
  id: string;
  created_at: number;
  name: string | null;
  phone: string;
  email: string | null;
  vehicle_type: string | null;
  location: string | null;
  details: string | null;
  consent_rgpd: number;
  status: 'open' | 'treated';
  treated_at: number | null;
  alert_sent_at: number | null;
  user_agent: string | null;
  ip_country: string | null;
}
