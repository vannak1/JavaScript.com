BEGIN;

-- DROP TABLE users
CREATE TABLE users (
  id         SERIAL PRIMARY KEY,
  github_id  INTEGER NOT NULL,
  name       TEXT NOT NULL,
  email      TEXT,
  avatar_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT statement_timestamp()
);

-- DROP TABLE articles;
CREATE TABLE articles (
  id         SERIAL PRIMARY KEY,
  approved   BOOLEAN NOT NULL DEFAULT FALSE,
  slug       TEXT NOT NULL,
  title      TEXT NOT NULL,
  body       TEXT,
  url        TEXT,
  news       BOOLEAN NOT NULL DEFAULT FALSE,
  user_id    INTEGER,
  flagged    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT statement_timestamp(),
  published_at TIMESTAMP DEFAULT statement_timestamp()
);
-- DROP TABLE comments

CREATE TABLE comments (
  id          SERIAL PRIMARY KEY,
  approved    BOOLEAN NOT NULL DEFAULT FALSE,
  user_id     INTEGER REFERENCES users(id) NOT NULL,
  article_id  INTEGER REFERENCES articles(id) NOT NULL,
  email       TEXT,
  username    TEXT,
  avatar_url  TEXT,
  body        TEXT,
  flagged     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP DEFAULT statement_timestamp()
);

CREATE INDEX ON comments(article_id);

COMMIT;
