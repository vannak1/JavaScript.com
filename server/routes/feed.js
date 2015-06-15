var express = require('express');
var router  = express.Router();
var path    = require('path');

var Articles = require(path.join(__dirname, '..', 'services', 'articles'));


router.get('/rss', function(req, res, next) {
  var options = {
      title: 'JavaScript.com',
      description: 'Learn JavaScript and stay connected with the latest news created and curated by the JavaScript community.',
      link: 'http://javascript.com/rss',
      language: 'en'
  };
  Articles.rss(function(news) {
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
