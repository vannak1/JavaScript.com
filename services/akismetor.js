var akismet = require('akismet-api');

var client = akismet.client({
  key  : process.env.AKISMET_API,                   // Required!
  blog : baseURL                                    // Required!
});

var createAkismetHash = function(req, comment) {
  return {
            user_ip : req.ip,                         // Required!
            user_agent : req.get('User-Agent'),       // Required!
            referrer : req.get('Referrer'),           // Required!
            permalink : baseURL + 'flow/' + comment.article_id,
            comment_type : 'comment',
            comment_author : comment.author,
            comment_author_email : comment.email,
            comment_content : comment.body
         }
};

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

  checkSpam(req, comment, isSpam, done) {
    var akismetHash = createAkismetHash(req, comment);

    client.checkSpam(akismetHash, function(err, _isSpam) {
      if(err) throw err;

      if(_isSpam){
        isSpam();
      }

      done();
    });
  },

  // If Akismet reports something as not-spam, but it turns out to be spam anyways,
  // we can report this to Akismet via this API call
  submitSpam(req, comment, dbcallback, cb) {
    client.sumbitSpam( createAkismetHash(req, comment), function(err, spam) {
      // dbCallback(spam, comment, cb);
    });
  },

  // If Akismet reports something as spam, but it turns out to not be spam anyways,
  // we can report this to Akismet via this API call.
  submitHam(req, comment, dbcallback, cb) {
    client.sumbitHam( createAkismetHash(req, comment), function(err, spam) {
      // dbCallback(spam, comment, cb);
    });
  }

};

module.exports = Akismetor;
