var akismet = require('akismet-api');

// I'm sure there is a better way to fetch this?
// This won't work since we don't have the request
// var fullURL = req.protocol + '://' + req.get('host');
var client = akismet.client({
  key  : process.env.AKISMET_API,                   // Required!
  blog : baseURL                                    // Required!
});

var Akismetor = {
  verifyKey() {
    client.verifyKey(function(err, valid) {
      if (valid) {
        console.log('Valid key!');
      } else {
        console.log('Key validation failed...');
        console.log(err.message);
      }
    });
  },

  checkSpam(req, comment, dbCallback, cb) {
    client.checkSpam({
      // Not sure if this is the correct way to fetch the IP
      user_ip : req.ip,                         // Required!
      user_agent : req.get('User-Agent'),       // Required!
      referrer : req.get('Referrer'),           // Required!
      permalink : baseURL + '/flow/' + comment.article_id,
      comment_type : 'comment',
      comment_author : comment.author,
      comment_author_email : comment.email,
      comment_content : comment.body
    }, function(err, spam) {
      dbCallback(spam, comment, cb);
    });
  }
};

module.exports = Akismetor;
