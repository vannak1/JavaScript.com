"use strict"

var twit = require('twit');

class Twitter {
  constructor(article) {
    this.article = article;
  }

  status() {
    return "\"" + this.article.title + "\": " + this.article.url;
  }

  twitCaller() {
    return new twit({
      consumer_key:        process.env.TWITTER_CONSUMER_KEY,
      consumer_secret:     process.env.TWITTER_CONSUMER_SECRET,
      access_token:        process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
    });
  }

  publish() {
    var client = this.twitCaller();

    client.post('statuses/update', { status: this.status() }, function(err, data, response) {
      if (err) throw err;
    });
  }
}

module.exports = Twitter
