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

var csrfProtection = csrf({ cookie: true });
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
  get('/', ensureAuthenticated, ensureAdmin, function(req, res){
    News.pendingApproval(function(stories){
      res.render('admin/index', {stories: stories});
    });
  }).

  post('/moderate', ensureAuthenticated, ensureAdmin, parsePost, function(req, res){
    var storyId = req.body.storyId;
    var isApproved = req.body.approved;
    console.log(req.body);
    console.log(isApproved);
    // TODO: send mailers and figure out what to do with denyed posts
    if (isApproved === 'true') {
      News.approve(storyId, function(){
        res.send(true);
      });
    }else{
      res.send(true);
    }
  });

module.exports = router;
