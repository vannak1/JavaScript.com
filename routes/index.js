var express = require('express');
var router  = express.Router();
var path    = require('path');
var bodyParser = require('body-parser');
var mcapi = require('mailchimp-api');

var parseForm = bodyParser.urlencoded({ extended: false });

mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API);

var News = require('./../services/news');
var Fivejs = require(path.join(__dirname, '..', 'services', 'fivejs'))

/* GET home page. */
router.get('/', function(req, res, next) {
  Fivejs.get( function(news) {
    res.render('index', { news: news, title: 'Express' });
  })
});

/* POST subscribe an email to JS5 list. */
router.post('/subscribe', parseForm, function(req, res) {
  mc.lists.subscribe({id: process.env.LIST_ID, email:{email:req.body.email}}, function(data) {
      res.redirect('/');
    },
    function(error) {
      res.redirect('/');
    });
});

module.exports = router;
