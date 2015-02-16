var express = require('express');
var router  = express.Router();
var path    = require('path');

var News = require('./../services/news');
var Fivejs = require(path.join(__dirname, '..', 'services', 'fivejs'))

/* GET home page. */
router.get('/', function(req, res, next) {
  Fivejs.get( function(news) {
    res.render('index', { news: news, title: 'Express' });
  })
});

module.exports = router;
