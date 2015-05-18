var db = require('./db');
var slugGenerator = require('./slug-generator');

/* Our curated news section. Mostly fivejs at the moment. Note that in the very near
 * future, we will be saving fivejs feeds to news items.
 */
var News = {
  // Returns the most recent news items for display on the index page
  recent(cb) {
    db.query('SELECT * FROM articles ORDER BY created_at DESC LIMIT 10', [], cb)
  },
  
  published(limit, cb) {
    db.query('SELECT * FROM articles WHERE approved = true ORDER BY published_at DESC LIMIT $1',
      [limit],
      cb)
  },

  // Returns all news items, no pagination
  all(cb) {
    db.query('SELECT * FROM articles', [], cb)
  },

  paginated(offset, cb){
        db.query('SELECT a.news, a.url, a.title, a.id, a.body, u.name, u.avatar_url FROM articles as a LEFT JOIN users as u on a.user_id = u.id where a.id IN (select id from articles where news = true limit 10 offset $1) OR a.id IN (select id from articles where news = false limit 10 offset $1)',
        [offset],
        cb
    )
  },

  // Creates a new news item
  create(title, body, url, cb) {
    db.query(
      "INSERT INTO articles (title, body, url, news) VALUES ($1, $2, $3, true);",
      [title, body, url],
      cb
    )
  },

  // Creates stories from a JSON object sent form FiveJS
  createFromEpisode(episodes, cb) {
    for(var i in episodes) {
      var story = episodes[i];
      story.slug = slugGenerator.createSlug(story.title);
      db.query(
        "INSERT INTO articles (title, slug, body, url, published_at, news, approved) VALUES ($1, $2, $3, $4, current_timestamp, true, true);",
        [story.title, story.slug, story.summary, story.url],
        function(){} // Is there anything to be done here?
      )
    }
    cb();
  },

    findBySlug(slug, cb) {
      db.query('SELECT id FROM articles WHERE slug = $1', [slug], cb)
    }
}

module.exports = News;
