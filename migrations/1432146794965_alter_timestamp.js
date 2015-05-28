exports.up = function(pgm) {
  pgm.alterColumn('articles', 'published_at', { type: 'timestamptz' });
  pgm.alterColumn('comments', 'created_at', { type: 'timestamptz' });
};

exports.down = function(pgm) {

};
