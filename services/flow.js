var db = require('./db');

var Flow = {
  // Returns the most recent Flow items for display on the index page
  recent: function (cb) {
    db.query('SELECT * FROM articles WHERE news = false ORDER BY created_at DESC LIMIT 10', [], cb)
  },

  // Returns all Flow items, no pagination
  all: function (cb) {
    db.query('SELECT * FROM articles WHERE news = false', [], cb)
  },

  byID: function(id, cb) {
    db.query('SELECT * FROM articles WHERE news = false and id = $1', [id], cb)
  },

  // Creates a new Flow item
  create: function (newFlow, cb) {
    var title = newFlow.title;
    var body = newFlow.body;
    var url = newFlow.url;

    db.query(
      "INSERT INTO articles (title, body, url, news) VALUES ($1, $2, $3, false);",
      [title, body, url],
      cb
    )
  }
}

module.exports = Flow;
