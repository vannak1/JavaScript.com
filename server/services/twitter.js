"use strict"

var twit = require('twit');
var path = require('path');
var config = require(path.join(__dirname, '..', '..', 'config'));

class Twitter {
  constructor(article) {
    this.article = article;
  }

  status() {
    return "\"" + this.article.title + "\": " + this.article.url;
  }

  twitCaller() {
    return new twit({
      consumer_key:        config.apiKeys.twitter.consumerKey,
      consumer_secret:     config.apiKeys.twitter.consumerSecret,
      access_token:        config.apiKeys.twitter.accessToken,
      access_token_secret: config.apiKeys.twitter.accessTokenSecret
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
