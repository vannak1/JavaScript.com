var db = require('./db');
var Akismetor = require('../services/akismetor');

var Comments = {
  // Returns all comments by article
  byFlow(flowID, cb) {
    db.query('SELECT * FROM comments JOIN users on users.id = comments.user_id WHERE article_id = $1', [ flowID ], cb)
  },
  // Creates a new comment
  create(newComment, cb) {

    var approved = newComment.isSpam ? false : true;

    db.query(
      "INSERT INTO comments (user_id, article_id, approved, body) VALUES ($1, $2, $3, $4);",
      [newComment.userId, newComment.articleId, approved, newComment.body],
      cb
    );
  }
}

module.exports = Comments;
