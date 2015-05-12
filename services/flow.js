var db = require('./db');

var Flow = {
  // Returns the most recent Flow items for display on the index page
  recent(cb) {
    db.query('SELECT * FROM articles WHERE news = false ORDER BY created_at DESC LIMIT 10', [], cb)
  },

  // Returns all Flow items, no pagination
  all(cb) {
    db.query('SELECT * FROM articles WHERE news = false', [], cb)
  },

  byID(id, cb) {
    db.query('SELECT articles.title, articles.id, articles.body, articles.url, users.name, users.avatar_url FROM articles JOIN users ON users.id = articles.user_id WHERE news = false and articles.id = $1', [id], cb)
  },

  // Creates a new Flow item
  create(newFlow, cb) {
    var title = newFlow.title;
    var body = newFlow.body;
    var user_id = newFlow.user_id;
    var url = newFlow.url;

    db.query(
      "INSERT INTO articles (title, body, url, user_id, news) VALUES ($1, $2, $3, $4, false);",
      [title, body, url, user_id],
      cb
    )
  }
}

module.exports = Flow;
