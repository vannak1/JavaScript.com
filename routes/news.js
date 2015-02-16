var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

var debug = require('debug')('JavaScript.com:server');

router.
  get('/', function(req, res) {
    debug('Fetching and listing news');

    res.render('news/index', { today: new Date() });
  }).
  get('/:update', function(req, res) {
    debug('Updating news items from rss');

    // Not implemented yet

    res.redirect('/');
  });

module.exports = router;

