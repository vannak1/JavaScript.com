var db = require('./db');
var Akismetor = require('../services/akismetor');

var Comments = {
  // Returns all comments by article
  byFlow(articleId, cb) {
    db.query('SELECT * FROM comments JOIN users on users.id = comments.user_id WHERE article_id = $1', [ articleId ], cb)
  },
  // Creates a new comment
  create(newComment, cb) {

    var approved = newComment.isSpam ? false : true;

    db.query(
      "INSERT INTO comments (user_id, approved, body, article_id) VALUES ($1, $2, $3, (SELECT id FROM articles WHERE slug = $4));",
      [newComment.userId, approved, newComment.body, newComment.slug],
      cb
    );
  }
}

module.exports = Comments;
