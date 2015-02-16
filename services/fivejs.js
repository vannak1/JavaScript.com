var FivejsParser = require('feedparser');
var Request      = require('request');

var Fivejs = {
  get: function(cb) {
    var req  = Request('https://fivejs.codeschool.com/feed.rss');
    var feed = new FivejsParser();

    req.on('response', function(res) {
      res.pipe(feed);
    });

    feed.on('readable', function() {
      var post;
      var stories = [];

      while (post = this.read()) {
        stories.push({
          "title": post.title,
          "url": post.link,
          "body": post.description
        })
      }

      cb(stories);
    });
  }
};

module.exports = Fivejs;
