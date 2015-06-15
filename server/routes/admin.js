var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();

var Articles  = require(path.join(__dirname, '..', 'services', 'articles'));
var Users = require(path.join(__dirname, '..', 'services', 'users'));
var Comments = require(path.join(__dirname, '..', 'services', 'comments'));
var Akismetor = require(path.join(__dirname, '..', 'services', 'akismetor'));
var Mailer = require(path.join(__dirname, '..', 'services', 'mailer'));

var csrfProtection = csrf();
var parsePost = bodyParser.urlencoded({ extended: false });

var debug = require('debug')('JavaScript.com:server');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  req.flash('Please log in.');
  res.redirect('/')
}

/* Admin role */
function ensureAdmin(req, res, next) {
  Users.byId(req.user.userId, function(user){
    if (user[0].admin) {
      return next();
    } else {
      res.status(403);
      req.flash("You shall not pass!");
      res.redirect('/');
    }
  });
}
/* End Admin role */

function buildMailerOptions(req, res, next) {
  req.storyID = req.params.id;
  Articles.getMailerInfo(req.storyID, function(result) {
    req.storyURL = baseURL + 'news/' + result[0].slug;
    req.userEmail = result[0].email;
    next();
  });
}

router.
  get('/', cookieParser, ensureAuthenticated, ensureAdmin, csrfProtection, function(req, res){
    Articles.pending(function(stories){
      res.render('admin/index', {stories: stories, token: req.csrfToken()});
    });
  }).

  post('/news/:id/approve', ensureAuthenticated, ensureAdmin, csrfProtection, parsePost, buildMailerOptions, function(req, res) {
    var url = req.storyURL
    var userEmail = req.userEmail;

    Articles.approve(req.storyID, function () {
      Mailer.postAccepted(url, userEmail);
      res.send(true);
    });
  }).

  post('/news/:id/deny', ensureAuthenticated, ensureAdmin, csrfProtection, parsePost, buildMailerOptions, function(req, res) {
    var url = req.storyURL
    var userEmail = req.userEmail;
    var reasonDenied = req.body.reason;

    Articles.deny(req.storyID, function () {
      Mailer.postDenied(url, userEmail, reasonDenied);
      res.send(true);
    });
  });


module.exports = router;
