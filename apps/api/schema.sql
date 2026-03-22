-- ============================================================
--  AiCruzz — PostgreSQL Schema
--  Run: psql -U postgres -d aicruzz -f schema.sql
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── USERS ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE NOT NULL,
  name            VARCHAR(255) NOT NULL,
  password_hash   VARCHAR(255),
  avatar_url      TEXT,
  plan            VARCHAR(50)  NOT NULL DEFAULT 'free',  -- free|starter|pro|studio
  credits_used    INTEGER      NOT NULL DEFAULT 0,
  credits_limit   INTEGER      NOT NULL DEFAULT 5,
  stripe_customer_id VARCHAR(255),
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── VIDEOS ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS videos (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL DEFAULT 'Untitled Video',
  type            VARCHAR(50)  NOT NULL DEFAULT 'text_to_video',
  prompt          TEXT,
  style           VARCHAR(100),
  duration        INTEGER,
  resolution      VARCHAR(20),
  status          VARCHAR(50)  NOT NULL DEFAULT 'queued',
  url             TEXT,
  s3_key          TEXT,
  thumbnail_url   TEXT,
  file_size       BIGINT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── API KEYS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(255) NOT NULL DEFAULT 'My API Key',
  key_hash        VARCHAR(255) UNIQUE NOT NULL,
  key_prefix      VARCHAR(20)  NOT NULL,
  environment     VARCHAR(20)  NOT NULL DEFAULT 'live',
  last_used_at    TIMESTAMPTZ,
  request_count   INTEGER      NOT NULL DEFAULT 0,
  is_active       BOOLEAN      NOT NULL DEFAULT TRUE,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── JOBS ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  video_id        UUID         REFERENCES videos(id) ON DELETE SET NULL,
  worker_type     VARCHAR(100),
  status          VARCHAR(50)  NOT NULL DEFAULT 'pending',
  progress        INTEGER      NOT NULL DEFAULT 0,
  error           TEXT,
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- ── SUBSCRIPTIONS ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS subscriptions (
  id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_sub_id        VARCHAR(255),
  plan                 VARCHAR(50) NOT NULL,
  status               VARCHAR(50) NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end   TIMESTAMPTZ,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INVOICES ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS invoices (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  stripe_inv_id   VARCHAR(255),
  amount_cents    INTEGER     NOT NULL DEFAULT 0,
  currency        VARCHAR(10) NOT NULL DEFAULT 'usd',
  status          VARCHAR(50) NOT NULL DEFAULT 'paid',
  pdf_url         TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── INDEXES ───────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_videos_user_id    ON videos(user_id);
CREATE INDEX IF NOT EXISTS idx_videos_status     ON videos(status);
CREATE INDEX IF NOT EXISTS idx_jobs_video_id     ON jobs(video_id);
CREATE INDEX IF NOT EXISTS idx_api_keys_user_id  ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id  ON invoices(user_id);

-- ── UPDATED_AT TRIGGER ────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
