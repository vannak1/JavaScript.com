var db = require('./db');
var Akismetor = require('../services/akismetor');

var Comments = {
  // Returns all comments by article
  byFlow(flowID, cb) {
    db.query('SELECT * FROM comments WHERE article_id = $1', [ flowID ], cb)
  },
  // Creates a new comment
  create(newComment, req, cb) {
    // Check for spam
    Akismetor.checkSpam(req, newComment, createAfterSpamCheck, cb);
  }
}

// TODO - the cb is coming all the way from services/db, through routes/flow,
// #create, #checkSpam, and finally here. Is this normal for node? Seems like
// it'd be waaaay too easy to lose track of it.
function createAfterSpamCheck(isSpam, comment, cb){
    db.query(
      "INSERT INTO comments (article_id, approved, email, username, avatar_url, body) VALUES ($1, $2, $3, $4, $5, $6);",
      [comment.article_id, isSpam, comment.email, comment.username, comment.avatar_url, comment.body],
      cb
    )
}

module.exports = Comments;
