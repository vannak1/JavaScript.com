BEGIN;

CREATE TABLE articles (
  id    integer PRIMARY KEY,
  title text NOT NULL,
  body  text NOT NULL,
  url   text,
  news  boolean NOT NULL DEFAULT FALSE,
  created_at timestamp DEFAULT statement_timestamp()
);

CREATE TABLE users (
  id    integer PRIMARY KEY,
  email text NOT NULL
);

COMMIT;
