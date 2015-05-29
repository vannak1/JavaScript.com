var request = require('request');

var GithubApi = {
  fetchEmail(profile, token, cb) {
    //TODO: Find out why this call doesn't work 
    //
    // var options = {
    //   headers: {
    //     'User-Agent':    baseURL,
    //     'Authorization': 'token ' + token,
    //     'x-oauth-scopes': 'user:email'
    //   },
    //   json:    true,
    //   url:     'https://api.github.com/user/emails'
    // };

    // // get emails using oauth token
    // request(options, function(error, response, body) {
    //   var emails = body.filter(function(email) {
    //     return (email.verified && email.primary);
    //     return email.verified;
    //   });

    //   profile.email = emails[0].email;
    //   cb(profile);
    // });
    profile.email = 'example@email.com';
    cb(profile);
  }
}
module.exports = GithubApi;
