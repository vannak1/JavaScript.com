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

-- DROPT TABLE users
CREATE TABLE users (
  id    SERIAL PRIMARY KEY,
  email text NOT NULL
);

COMMIT;
