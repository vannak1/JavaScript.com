var db = require('./db');

/* Our curated news section. Mostly fivejs at the moment. Note that in the very near
 * future, we will be saving fivejs feeds to news items.
 */
var News = {
  // Returns the most recent news items for display on the index page
  recent(cb) {
    db.query('SELECT * FROM articles ORDER BY created_at DESC LIMIT 10', [], cb)
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
      db.query(
        "INSERT INTO articles (title, body, url, news) VALUES ($1, $2, $3, true);",
        [story.title, story.summary, story.url],
        function(){} // Is there anything to be done here?
      )
    }
    cb();
  }
}

module.exports = News;
