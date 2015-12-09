var express = require('express');
var router  = express.Router();
var bodyParser = require('body-parser');
var parseForm = bodyParser.urlencoded({ extended: false });
var mailchimpApi = require(path.join(__dirname, '..', 'services', 'mailchimpApi'));

/* GET home page. */
router.
  get('/', function(req, res, next) {
    res.render('index');
  }).

  post('/subscribe', parseForm, function(req, res) {
    mailchimpApi.subscribe(req.body.email, function(err, data){
      res.json({error: err, data: data});
    });
  })

module.exports = router;
