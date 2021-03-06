var db = require(path.join(__dirname, 'db'));
var GithubApi = require('./github-api');

var Users = {
  // Returns all Flow items, no pagination
  all(cb) {
    db.query('SELECT * FROM users', [], cb)
  },

   byId(id, cb) {
    db.query('SELECT * FROM users WHERE id = $1', [id], cb)
   },

  byGithubId(id, cb) {
    db.query('SELECT * FROM users WHERE github_id = $1', [id], cb)
  },

  // Creates a new user
  create(newUser, cb) {
    var github_id = newUser.id;
    var email = newUser.email;
    var name = newUser.displayName || newUser.username;
    var avatar_url = newUser['_json'].avatar_url;

    db.query(
      "INSERT INTO users (github_id, email, name, avatar_url) VALUES ($1, $2, $3, $4) RETURNING id;",
      [github_id, email, name, avatar_url],
      cb
    )
  },

  createWithEmail(profile, token, cb) {
    GithubApi.fetchEmail(profile, token, function(profile){
      Users.create(profile, function(userId){ cb(null, profile, userId);})
    });
  },

  findOrCreate(userGithubId, cb){
    Users.byGithubId(userGithubId, function(result){
      if (result){
        cb(null, result[0]);
      }else{
        cb(null, null);
      }
    });
  }
}

module.exports = Users;
