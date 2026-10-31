-- Cedwyn artifact lane schema v1.
-- Apply only to a dedicated sandbox/production artifact D1 database, never cedwyn-apps.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS artifacts (
  project_id TEXT NOT NULL,
  sha256 TEXT NOT NULL CHECK (length(sha256) = 64),
  artifact_type TEXT NOT NULL,
  title TEXT NOT NULL,
  file_name TEXT NOT NULL,
  content_type TEXT NOT NULL,
  size_bytes INTEGER NOT NULL CHECK (size_bytes > 0),
  source_commit TEXT NOT NULL,
  source_path TEXT NOT NULL,
  provenance_json TEXT NOT NULL DEFAULT '{}',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  created_at TEXT NOT NULL,
  published_at TEXT,
  published_by TEXT,
  published_reason TEXT,
  PRIMARY KEY (project_id, sha256)
);
CREATE TABLE IF NOT EXISTS artifact_events (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  sha256 TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('published')),
  actor_id TEXT NOT NULL,
  reason TEXT NOT NULL,
  created_at TEXT NOT NULL,
  FOREIGN KEY (project_id, sha256) REFERENCES artifacts(project_id, sha256)
);
CREATE UNIQUE INDEX IF NOT EXISTS artifact_single_publication
  ON artifact_events (project_id, sha256) WHERE event_type = 'published';
CREATE INDEX IF NOT EXISTS artifacts_project_created
  ON artifacts (project_id, created_at DESC, sha256 DESC);
CREATE INDEX IF NOT EXISTS artifacts_public_project_created
  ON artifacts (project_id, created_at DESC, sha256 DESC) WHERE visibility = 'public';
