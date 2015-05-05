var db = require('./db');
var Akismetor = require('../services/akismetor');

var Comments = {
  // Returns all comments by article
  byFlow(flowID, cb) {
    db.query('SELECT * FROM comments WHERE article_id = $1', [ flowID ], cb)
  },
  // Creates a new comment
  create(newComment, cb) {

    var approved = newComment.isSpam ? false : true;

    db.query(
      "INSERT INTO comments (article_id, approved, email, username, avatar_url, body) VALUES ($1, $2, $3, $4, $5, $6);",
      [newComment.article_id, approved, newComment.email, newComment.username, newComment.avatar_url, newComment.body],
      cb
    );
  }
}

module.exports = Comments;
