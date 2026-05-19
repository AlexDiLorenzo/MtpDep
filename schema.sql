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
  location      TEXT,                              -- lieu de la panne
  destination   TEXT,                              -- destination souhaitée
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

-- Tracking des clics sur les liens "tel:" (bouton appeler).
-- Une ligne par clic ; on garde un peu de contexte pour analyse.
CREATE TABLE IF NOT EXISTS call_clicks (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  created_at  INTEGER NOT NULL,        -- unix ms
  source      TEXT,                    -- pathname (/, /recrutement, …) ou data-call-source explicite
  user_agent  TEXT,
  ip_country  TEXT,
  referer     TEXT
);
CREATE INDEX IF NOT EXISTS idx_call_clicks_created ON call_clicks(created_at);

-- Cache clé/valeur générique (JSON sérialisé + horodatage).
-- Utilisé par le dashboard de pilotage pour mémoriser le dernier
-- snapshot des avis Google et éviter de marteler l'API Google
-- Business Profile (quota faible) à chaque polling de l'écran.
CREATE TABLE IF NOT EXISTS kv_cache (
  k          TEXT PRIMARY KEY,
  v          TEXT NOT NULL,           -- payload JSON
  updated_at INTEGER NOT NULL         -- unix ms
);

-- Migration pour la table existante (ajoute la colonne destination si pas déjà là).
-- À lancer une seule fois après mise à jour, ignore l'erreur "duplicate column" :
--   wrangler d1 execute mtp-dep-db --command="ALTER TABLE devis ADD COLUMN destination TEXT" --remote
