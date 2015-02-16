var db = require('./db');

/* Our curated news section. Mostly fivejs at the moment. Note that in the very near
 * future, we will be saving fivejs feeds to news items.
 */
var News = {
  // Returns the most recent news items for display on the index page
  recent: function (cb) {
    db.query('SELECT * FROM articles ORDER BY created_at DESC LIMIT 10', [], cb)
  },

  // Returns all news items, no pagination
  all: function (cb) {
    db.query('SELECT * FROM articles', [], cb)
  },

  // Creates a new news item
  create: function (title, body, url, cb) {
    db.query(
      "INSERT INTO articles (title, body, url, news) VALUES ($1, $2, $3, true);",
      [title, body, url],
      cb
    )
  }
}

module.exports = News;