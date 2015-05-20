exports.up = function(pgm) {
  pgm.createTable('users', {
    id: 'id',
    admin: { type: 'boolean', notNull: true, default: false },
    github_id: { type: 'integer', notNull: true },
    name: { type: 'text', notNull: true },
    email: { type: 'text' },
    avatar_url: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('statement_timestamp()') }
  });

  pgm.createTable('articles', {
    id:           'id',
    approved:     { type: 'boolean' },
    slug:         { type: 'text', notNull: true },
    title:        { type: 'text', notNull: true },
    body:         { type: 'text' },
    url:          { type: 'text' },
    news:         { type: 'boolean', notNull: true, default: false },
    user_id:      { type: 'integer' },
    published_at: { type: 'timestamp' },
    created_at:   { type: 'timestamp', default: pgm.func('statement_timestamp()') }
  });

  pgm.createTable('comments', {
    id:           'id',
    approved:     { type: 'boolean', notNull: true, default: false },
    user_id:      { type: 'integer', references: 'users', notNull: true },
    article_id:   { type: 'integer', references: 'articles', notNull: true },
    body:         { type: 'text' },
    flagged:      { type: 'boolean', notNutll: true, default: true  },
    created_at:   { type: 'timestamp', default: pgm.func('statement_timestamp()') }
  });
};

exports.down = function(pgm) {

};
