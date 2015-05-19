var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var Flow = require('../services/flow');
var News = require('../services/news');
var Users = require('../services/users');
var Comments = require('../services/comments');
var Akismetor = require('../services/akismetor');

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

router.
  get('/', cookieParser, ensureAuthenticated, ensureAdmin, csrfProtection, function(req, res){
    News.pendingApproval(function(stories){
      res.render('admin/index', {stories: stories, token: req.csrfToken()});
    });
  }).

  post('/news/:id/approve', ensureAuthenticated, ensureAdmin, csrfProtection, parsePost, function(req, res) {
    var storyId = req.params.id;
    News.approve(storyId, function () { res.send(true); });
  }).

  post('/news/:id/deny', ensureAuthenticated, ensureAdmin, csrfProtection, parsePost, function(req, res) {
    var storyId = req.params.id;
    News.deny(storyId, function () { res.send(true); });
  });


module.exports = router;
