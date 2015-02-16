var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var Flow = require('../services/flow');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

router.
  get('/', function(req, res) {
    Flow.all(function(flow_collection) {
      res.render('flow/index', { flow_collection: flow_collection });
    });
  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    var csrfToken = req.csrfToken();
    res.render('flow/new', { csrfToken: csrfToken });
  }).

  post('/', cookieParser, parseForm, csrfProtection, function(req, res) {
    var newFlow = req.body;
    Flow.create(newFlow, function() {
      res.redirect('/flow');
    });
  });

module.exports = router;

