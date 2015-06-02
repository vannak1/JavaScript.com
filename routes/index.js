var express = require('express');
var router  = express.Router();
var path    = require('path');
var bodyParser = require('body-parser');
var mcapi = require('mailchimp-api');

mc = new mcapi.Mailchimp(process.env.MAILCHIMP_API);
var parseForm = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* POST subscribe an email to JS5 list. */
router.post('/subscribe', parseForm, function(req, res) {
  mc.lists.subscribe(
    {
      id: process.env.LIST_ID,
      email: {email:req.body.email},
      double_optin: false,
      send_welcome: true
    },
    function(data) {
      res.json({data: data});
    },
    function(error) {
      res.json({error: error});
    });
});

module.exports = router;
