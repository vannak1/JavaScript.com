var db = require('./db');

var Users = {
  // Returns all Flow items, no pagination
  all(cb) {
    db.query('SELECT * FROM users', [], cb)
  },

   byID(id, cb) {
    db.query('SELECT * FROM users WHERE id = $1', [id], cb)
   },

  byGithubId(id, cb) {
    db.query('SELECT * FROM users WHERE github_id = $1', [id], cb)
  },

  // Creates a new user
  create(newUser, cb) {
    var github_id = newUser.id;
    var email = newUser.emails[0].value;
    var name = newUser.displayName || newUser.username;
    var avatar_url = newUser['_json'].avatar_url;

    db.query(
      "INSERT INTO users (github_id, email, name, avatar_url) VALUES ($1, $2, $3, $4);",
      [github_id, email, name, avatar_url],
      cb
    )
  },

  findOrCreate(user_id, cb){
    Users.byGithubId(user_id, function(result){
      if (result){
        cb(null, result[0]);
      }else{
        cb(null, null);
      }
    });

      
    // }
    // cb(null, user);
  }
}

module.exports = Users;
