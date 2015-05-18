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
var parseForm = bodyParser.urlencoded({ extended: false });
var parseJson = bodyParser.json();

var debug = require('debug')('JavaScript.com:server');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/news/new')
}

/* Admin role */
function ensureAdmin(req, res, next) {
  Users.byId(req.user.userID, function(user){
    if (user.admin) {
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
  get('/', ensureAdmin, function(req, res){
    res.render('admin/index');
  });

module.exports = router;
