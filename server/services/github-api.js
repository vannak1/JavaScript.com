var request = require('request');

var GithubApi = {
  fetchEmail(token, cb) {
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
      var email = body.filter(function(email) {
        return (email.verified && email.primary);
        return email.verified;
      });
      cb(email[0].email);
    });
  }
}
module.exports = GithubApi;
