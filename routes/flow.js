var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var cookieParser = require('cookie-parser')();
var bodyParser = require('body-parser');
var Flow = require('../services/flow');
var Comments = require('../services/comments');

var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

/* GitHub Auth */
var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;

passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(obj, done) {
    done(null, obj);
});
passport.use(new GitHubStrategy({
    clientID: process.env.GH_CLIENT_ID,
    clientSecret: process.env.GH_CLIENT_SECRET,
    callbackURL: (process.env.NODE_ENV === 'production' ?
      "http://javascriptcom.herokuapp.com/flow/auth/github/callback" : "http://localhost:3000/flow/auth/github/callback")
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/flow/new')
}
/* End GitHub Auth */

router.

  get('/auth/github', passport.authenticate('github'), function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }).
  get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/flow/new' }), function(req, res) {
    // TODO: Fetch image and save it to S3
    // req.user['_json']['avatar_url']
    // req.user['_json']['login']
    res.redirect('/flow');
  }).
  get('/signout', function(req, res){
    req.logout();
    res.redirect('/flow');
  }).

  get('/', function(req, res) {
    Flow.all(function(flow_collection) {
      res.render('flow/index', { flow_collection: flow_collection });
    });
  }).

  get('/:id([0-9]+)', cookieParser, csrfProtection, function(req, res) {
    var user = {
      "authenticated": req.isAuthenticated(),
    }

    if (user.authenticated) {
      user.login      = req.user['_json']['login'];
      user.avatar_url = req.user['_json']['avatar_url'];
    }

    Flow.byID(req.params.id, function(flow) {
      Comments.byFlow(req.params.id, function(comments) {
        console.log(comments)
        res.render('flow/show', { flow: flow[0], comments: comments, user: user, token: req.csrfToken() });
      });
    });
  }).

  post('/:id([0-9]+)/comment', cookieParser, ensureAuthenticated, parseForm, csrfProtection, function(req, res) {
    var newComment = req.body;
    newComment["article_id"] = req.params.id

    Comments.create(newComment, function() {
      res.redirect('/flow');
    });
  }).

  get('/sign_in', function(req, res) {
    res.render('flow/sign_in');
  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    if(!req.isAuthenticated()){
      res.redirect('/flow/sign_in');
    }else{
      var csrfToken = req.csrfToken();
      var login = req.user['_json']['login'];
      var avatar = req.user['_json']['avatar_url'];

      res.render('flow/new', { login: login, avatar: avatar, token: csrfToken });
    }
  }).

  post('/', cookieParser, ensureAuthenticated, parseForm, csrfProtection, function(req, res) {
    var newFlow = req.body;
    Flow.create(newFlow, function() {
      res.redirect('/flow');
    });
  });

module.exports = router;

