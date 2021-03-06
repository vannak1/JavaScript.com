var db = require(path.join(__dirname, 'db'));
var Akismetor = require(path.join(__dirname, '..', 'services', 'akismetor'));

var Comments = {
  // Returns all comments by article with user information.
  findByArticleId(id, cb) {
    db.query('SELECT c.id, c.created_at, c.body, c.user_id, u.avatar_url, u.name FROM comments as c JOIN users as u on u.id = c.user_id WHERE c.article_id = $1 AND approved = true ORDER BY created_at ASC;', [ id ], cb)
  },

  findByCommentId(id, cb) {
    db.query('SELECT c.id, c.created_at, c.body, c.user_id, u.avatar_url, u.name FROM comments as c JOIN users as u on u.id = c.user_id WHERE c.id = $1 AND approved = true ORDER BY created_at ASC;', [ id ], cb)
  },

  checkOwnership(commentId, userId, cb) {
    db.query(
      "SELECT c.id FROM comments AS c WHERE c.id = $1 AND c.user_id = $2",
      [commentId, userId],
      cb
    );
  },

  update(id, body, cb) {
    db.query(
      "UPDATE comments SET body = $1 where id = $2 RETURNING id;",
      [body, id],
      cb
    );
  },

  delete(id, cb) {
    db.query("DELETE FROM comments where id = $1;", [id], cb);
  },

  // Creates a new comment
  create(newComment, cb) {

    var approved = newComment.isSpam ? false : true;
    db.query(
      "INSERT INTO comments (user_id, approved, body, article_id) VALUES ($1, $2, $3, (SELECT id FROM articles WHERE slug = $4)) RETURNING id;",
      [newComment.userId, approved, newComment.body, newComment.slug],
      cb
    );
  }
}

module.exports = Comments;
