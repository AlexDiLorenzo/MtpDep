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

  // Dashboard pilotage RH (page /pilotage)
  PILOTAGE_TOKEN: string;
  DEPANTIME_URL: string;
  DEPANTIME_PILOTAGE_SECRET: string;

  // Pilotage — flotte (app Flotte, contrôle technique)
  FLOTTE_URL: string;
  FLOTTE_PILOTAGE_SECRET: string;

  // Pilotage — habilitations (app Habilitation, conformité dépanneurs)
  HABILITATION_URL: string;
  HABILITATION_PILOTAGE_SECRET: string;

  // Pilotage — avis Google (API Google Business Profile)
  // OAuth : refresh token issu d'une autorisation `business.manage`.
  GOOGLE_CLIENT_ID: string;
  GOOGLE_CLIENT_SECRET: string;
  GOOGLE_REFRESH_TOKEN: string;
  GBP_ACCOUNT_ID: string;
}

export interface DevisRow {
  id: string;
  created_at: number;
  name: string | null;
  phone: string;
  email: string | null;
  vehicle_type: string | null;
  location: string | null;
  destination: string | null;
  details: string | null;
  consent_rgpd: number;
  status: 'open' | 'treated';
  treated_at: number | null;
  alert_sent_at: number | null;
  user_agent: string | null;
  ip_country: string | null;
}
