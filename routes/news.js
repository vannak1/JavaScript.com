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

    res.send('List news');
  }).
  get('/new', csrfProtection, function(req, res) {
    debug('Rendering form for submission');

    var csrfToken = req.csrfToken();
    // TODO render template with csrfToken
    res.send(csrfToken);
  }).
  post('/', parseForm, csrfProtection, function(req, res) {
    debug('Creating news');

    res.redirect('/');
  });

module.exports = router;

