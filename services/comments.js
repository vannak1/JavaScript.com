var db = require('./db');

var Comments = {
  // Returns all comments by article
  byArticle: function (articleID, cb) {
    db.query('SELECT * FROM comments WHERE article_id = $1', [ articleID ], cb)
  },
  // Creates a new comment
  create: function (newComment, cb) {
    db.query(
      "INSERT INTO comments (article_id, email, username, avatar_url, body) VALUES ($1, $2, $3, $4, $5);",
      [newComment.article_id, newComment.email, newComment.username, newComment.avatar_url, newComment.body],
      cb
    )
  }
}

module.exports = Comments;
