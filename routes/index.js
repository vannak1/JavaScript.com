var express = require('express');
var router = express.Router();

var News = require('./../services/news');

/* GET home page. */
router.get('/', function(req, res, next) {
  News.create("Hi", "Hi", "H", function() {})
  News.all( function(news) {
    res.render('index', { news: news, title: 'Express' });
  })
});

module.exports = router;
