var db = require('./db');
var slugGenerator = require('./slug-generator');

var Flow = {
  // Returns the most recent Flow items for display on the index page
  recent(cb) {
    db.query('SELECT * FROM articles WHERE news = false ORDER BY created_at DESC LIMIT 10', [], cb)
  },

  // Returns all Flow items, no pagination
  all(cb) {
    db.query('SELECT * FROM articles WHERE news = false', [], cb)
  },

  bySlug(slug, cb) {
    console.log(slug);
    db.query('SELECT articles.title, articles.slug, articles.body, articles.url, users.name, users.avatar_url FROM articles JOIN users ON users.id = articles.user_id WHERE news = false and articles.slug = $1', [slug], cb)
  },

  // Creates a new Flow item
  create(newFlow, cb) {
    var title = newFlow.title;
    var slugTitle = slugGenerator.createSlug(title);
    var body = newFlow.body;
    var userId = newFlow.userId;
    var url = newFlow.url;

    db.query(
      "INSERT INTO articles (title, slug, body, url, user_id, news) VALUES ($1, $2, $3, $4, $5, false);",
      [title, slugTitle, body, url, userId],
      cb
    )
  }
}

module.exports = Flow;
