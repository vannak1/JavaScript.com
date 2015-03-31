var db = require('./db');
var Akismetor = require('../services/akismetor');

var Comments = {
  // Returns all comments by article
  byFlow(flowID, cb) {
    db.query('SELECT * FROM comments WHERE article_id = $1', [ flowID ], cb)
  },
  // Creates a new comment
  create(newComment, isSpam, cb) {
    var approved = isSpam;

    db.query(
      "INSERT INTO comments (article_id, approved, email, username, avatar_url, body) VALUES ($1, $2, $3, $4, $5, $6);",
      [comment.article_id, approved, comment.email, comment.username, comment.avatar_url, comment.body],
      cb
    );
  }
}

module.exports = Comments;
