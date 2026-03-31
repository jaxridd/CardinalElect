-- CardinalElect Database Schema
-- All tables are normalized to 3NF
-- Covers: FR-01 through FR-18, NFR-03 through NFR-05

-- ─────────────────────────────────────────────
-- ADMINS (FR-01, FR-02, FR-03, FR-13, FR-14)
-- ─────────────────────────────────────────────
CREATE TABLE admins (
  admin_id   SERIAL PRIMARY KEY,
  username   VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─────────────────────────────────────────────
-- ELECTIONS (FR-01, FR-13, FR-14, FR-15)
-- ─────────────────────────────────────────────
CREATE TABLE elections (
  election_id  SERIAL PRIMARY KEY,
  admin_id     INT NOT NULL REFERENCES admins(admin_id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  start_time   TIMESTAMPTZ NOT NULL,
  end_time     TIMESTAMPTZ NOT NULL,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_times CHECK (start_time < end_time)
);

-- ─────────────────────────────────────────────
-- POSITIONS (FR-02, FR-08)
-- ─────────────────────────────────────────────
CREATE TABLE positions (
  position_id  SERIAL PRIMARY KEY,
  election_id  INT NOT NULL REFERENCES elections(election_id) ON DELETE CASCADE,
  title        VARCHAR(255) NOT NULL,
  description  TEXT
);

-- ─────────────────────────────────────────────
-- CANDIDATES (FR-03, FR-04, FR-09)
-- ─────────────────────────────────────────────
CREATE TABLE candidates (
  candidate_id  SERIAL PRIMARY KEY,
  position_id   INT NOT NULL REFERENCES positions(position_id) ON DELETE CASCADE,
  name          VARCHAR(255) NOT NULL,
  photo_url     TEXT,
  description   TEXT
);

-- ─────────────────────────────────────────────
-- VOTER VERIFICATIONS (FR-05, FR-06, FR-07, NFR-03, NFR-05)
-- ─────────────────────────────────────────────
CREATE TABLE voter_verifications (
  verification_id  SERIAL PRIMARY KEY,
  election_id      INT NOT NULL REFERENCES elections(election_id) ON DELETE CASCADE,
  full_name        VARCHAR(255) NOT NULL,
  department       VARCHAR(255) NOT NULL,
  l_number         VARCHAR(20) NOT NULL,
  email            VARCHAR(255) NOT NULL,
  verification_code CHAR(6) NOT NULL,
  code_expires_at  TIMESTAMPTZ NOT NULL,                -- NFR-05: expires after 10 min
  is_verified      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (election_id, email)                           -- one verification attempt per election
);

-- ─────────────────────────────────────────────
-- VOTES (FR-10, FR-11, FR-12)
-- ─────────────────────────────────────────────
CREATE TABLE votes (
  vote_id       SERIAL PRIMARY KEY,
  election_id   INT NOT NULL REFERENCES elections(election_id) ON DELETE CASCADE,
  position_id   INT NOT NULL REFERENCES positions(position_id) ON DELETE CASCADE,
  candidate_id  INT NOT NULL REFERENCES candidates(candidate_id) ON DELETE CASCADE,
  voter_email   VARCHAR(255) NOT NULL,
  voted_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- FR-12: One vote per voter per position
  UNIQUE (election_id, position_id, voter_email)
);

-- ─────────────────────────────────────────────
-- INDEXES for performance (NFR-01, NFR-02)
-- ─────────────────────────────────────────────
CREATE INDEX idx_elections_times ON elections(start_time, end_time);
CREATE INDEX idx_votes_election ON votes(election_id);
CREATE INDEX idx_votes_position ON votes(position_id);
CREATE INDEX idx_verifications_email ON voter_verifications(email, election_id);
