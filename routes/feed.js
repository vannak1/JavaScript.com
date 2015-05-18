var express = require('express');
var router  = express.Router();
var path    = require('path');

var News = require('./../services/news');


router.get('/rss', function(req, res, next) {
  var options = {
      title: 'feed title',
      description: 'feed description',
      link: 'http://example.org/rss.xml',
      language: 'en'
  };
  News.published(25, function(news) {
    news.map(function(story){
      if (story.new){
        story.link = story.url
      }else{
        story.link = "https://javascript.com/news/" + story.slug
      }
    });
    res.set('Content-Type', 'text/xml');
    res.render('feed/rss', { options: options, news: news });
  })
});

module.exports = router;
