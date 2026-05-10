-- D1 schema pour les demandes de devis
-- À exécuter une fois via :
--   wrangler d1 execute mtp-dep-db --file=schema.sql --remote

CREATE TABLE IF NOT EXISTS devis (
  id            TEXT PRIMARY KEY,                  -- UUID v4 généré côté serveur
  created_at    INTEGER NOT NULL,                  -- unix ms
  name          TEXT,
  phone         TEXT NOT NULL,
  email         TEXT,
  vehicle_type  TEXT,                              -- VL | UTILITAIRE | PL
  location      TEXT,
  details       TEXT,
  consent_rgpd  INTEGER NOT NULL DEFAULT 0,        -- 0/1
  status        TEXT NOT NULL DEFAULT 'open',      -- open | treated
  treated_at    INTEGER,                           -- unix ms quand le mail a été cliqué
  alert_sent_at INTEGER,                           -- unix ms quand l'alerte WhatsApp a été émise
  user_agent    TEXT,
  ip_country    TEXT
);

CREATE INDEX IF NOT EXISTS idx_devis_status_created ON devis(status, created_at);
CREATE INDEX IF NOT EXISTS idx_devis_created ON devis(created_at);
