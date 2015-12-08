var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();

var authorizeAdmin = require("../services/authenticator").authorizeAdmin;
var Articles  = require(path.join(__dirname, '..', 'models', 'articles'));
var Akismetor = require(path.join(__dirname, '..', 'services', 'akismetor'));
var Mailer = require(path.join(__dirname, '..', 'services', 'mailer'));

var csrfProtection = csrf();
var parsePost = bodyParser.urlencoded({ extended: false });

var debug = require('debug')('JavaScript.com:server');

router.
  get('/', cookieParser, authorizeAdmin, csrfProtection, function(req, res){
    Articles.pending(function(err, docs){
      console.log(docs);
      res.render('admin/index', {docs: docs, token: req.csrfToken()});
    });
  }).

  post('/news/:id/approve', authorizeAdmin, csrfProtection, parsePost, function(req, res) {
    var storyId = req.params.id;
    var slug = req.body.slug;
    var userEmail = req.body.userEmail;

    console.log(slug, userEmail);
    Articles.approve(storyId, function(err) {
      Mailer.postAccepted(slug, userEmail);
      res.send(true);
    });
  }).

  post('/news/:id/deny', authorizeAdmin, csrfProtection, parsePost, function(req, res) {
    var storyId = req.params.id;
    var slug = req.body.slug;
    var userEmail = req.body.userEmail;

    Articles.deny(storyID, function () {
      Mailer.postDenied(slug, userEmail, reasonDenied);
      res.send(true);
    });
  });


module.exports = router;
