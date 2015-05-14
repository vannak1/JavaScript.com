var db = require('./db');
var request = require('request');

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
    var email = newUser.email;
    var name = newUser.displayName || newUser.username;
    var avatar_url = newUser['_json'].avatar_url;

    db.query(
      "INSERT INTO users (github_id, email, name, avatar_url) VALUES ($1, $2, $3, $4);",
      [github_id, email, name, avatar_url],
      cb
    )
  },

  createWithEmail(profile, token, cb) {
    Users.fetchEmail(profile, token, function(profile){
      Users.create(profile, function(){})
    });
    cb(null, profile);
  },

  findOrCreate(user_id, cb){
    Users.byGithubId(user_id, function(result){
      if (result){
        cb(null, result[0]);
      }else{
        cb(null, null);
      }
    });

  },

  fetchEmail(profile, token, cb){
    var options = {
      headers: {
        'User-Agent':    baseURL,
        'Authorization': 'token ' + token
      },
      json:    true,
      url:     'https://api.github.com/user/emails'
    };

    // get emails using oauth token
    request(options, function(error, response, body) {

      var emails = body.filter(function(email) {
        return (email.verified && email.primary);
        return email.verified;
      });

      profile.email = emails[0].email;
      cb(profile);
    });
  }

}

module.exports = Users;
