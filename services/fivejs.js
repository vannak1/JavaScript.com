var FeedParser = require('feedparser');
var Request    = require('request');

var Fivejs = {
  get: function(cb) {
    var req  = Request('https://fivejs.codeschool.com/feed.rss');
    var feed = new FeedParser();

    req.on('response', function(res) {
      res.pipe(feed);
    });

    var stories = [];
    feed.on('readable', function() {
      var post;

      while (post = this.read()) {
        stories.push({
          "title": post.title,
          "url": post.link,
          "body": post.description
        });
      }
    });

    feed.on('end', function() {
      cb(stories.slice(0,3));
    })
  }
};

module.exports = Fivejs;
