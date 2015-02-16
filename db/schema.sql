BEGIN;

-- DROP TABLE articles;
CREATE TABLE articles (
  id         SERIAL PRIMARY KEY,
  title      TEXT NOT NULL,
  body       TEXT,
  url        TEXT,
  news       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT statement_timestamp()
);

COMMIT;
