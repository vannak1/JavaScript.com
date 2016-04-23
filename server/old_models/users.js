var mongo = require("mongodb");
var GithubApi = require('../services/github-api');

var Users= {
  findOrCreate(profile, token, cb) {
    var collection = mongo.DB.collection('users');
    var query = {'github_id': profile.id};
    var user =
      {
        'github_id' : profile.id,
        'email' : null,
        'name' : profile.displayName || profile.username,
        'avatar_url' : profile['_json'].avatar_url
      }

    var findCb = function(err, doc){
      if(doc){
        cb(err, doc)
      }else{
        GithubApi.fetchEmail(profile, token, function(response){
          user.email = response.email
          collection.insertOne(user, findCb);
        });
      }
    }

    // First we check for user
    collection.findOne(query, findCb);
  },

  findByGithub(githubID, cb){
    var collection = mongo.DB.collection('users');
    var query = {'github_id': githubID };

    collection.findOne(query, function(err, doc){
      cb(err, doc);
    });
  }
}

module.exports = Users;
