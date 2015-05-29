var request = require('request');

var GithubApi = {
  fetchEmail(profile, token, cb) {
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

      console.log(error);
      console.log(response);
      console.log(body);

      var emails = body.filter(function(email) {
        return (email.verified && email.primary);
        return email.verified;
      });

      profile.email = emails[0].email;
      cb(profile);
    });
  }
}
module.exports = GithubApi;
