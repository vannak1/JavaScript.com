var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var Flow = require('../services/flow');
var Comments = require('../services/comments');
var Akismetor = require('../services/akismetor');


var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });

var path   = require('path');
var Fivejs = require(path.join(__dirname, '..', 'services', 'fivejs'))

var debug = require('debug')('JavaScript.com:server');

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
      "http://javascriptcom.herokuapp.com/news/auth/github/callback" : "http://localhost:3000/news/auth/github/callback")
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
  res.redirect('/news/new')
}
/* End GitHub Auth */
function buildComment(request, response, next){

  var newComment = request.body;
  newComment.article_id = request.params.id;
  newComment.isSpam = false;

  request.newComment = newComment;

  Akismetor.checkSpam(request, newComment, isSpam, function() {
    next();
  });

  function isSpam(){
    request.newComment.isSpam = true;
  }
}


router.
  get('/auth/github', passport.authenticate('github'), function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  }).
  get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/news/new' }), function(req, res) {
    // TODO: Fetch image and save it to S3
    // req.user['_json']['avatar_url']
    // req.user['_json']['login']
    res.redirect('/news');
   }).
  get('/signout', function(req, res){
    req.logout();
    res.redirect('/news');
  }).

  get('/', function(req, res) {
    debug('Fetching and listing news');
    var locales = {};

    Flow.all(function(flow_collection) {
      console.log("in fc " + flow_collection);
     locales.flow_collection = flow_collection;
    });

    Fivejs.get( function(news) {
     locales.news = news;
    });

    res.render('news/index', {flow_collection: locales.flow_collection, news: locales.news, today: new Date()});
  }).
  get('/update', function(req, res) {
    debug('Updating news items from rss');

    // Not implemented yet

  }).

  get('/:id([1-9]+)', cookieParser, csrfProtection, function(req, res) {
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
          res.render('news/show', { flow: flow[0], comments: comments, user: user, token: req.csrfToken() });
      });
    });
  }).

  post('/:id([0-9]+)/comment', cookieParser, ensureAuthenticated, parseForm, csrfProtection, buildComment, function(req, res) {

    var newComment = req.newComment;

    Comments.create(newComment, function() {
      if(newComment.isSpam){
        req.flash('info', 'Whoops! Your comment will need to be moderated.')
      }
      res.redirect('/news');
    });
  }).

  get('/sign_in', function(req, res) {
    res.render('news/sign_in');
  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    if(!req.isAuthenticated()){
      res.redirect('/news/sign_in');
    }else{
      var csrfToken = req.csrfToken();
      var login = req.user['_json']['login'];
      var avatar = req.user['_json']['avatar_url'];

      res.render('news/new', { login: login, avatar: avatar, token: csrfToken });
    }
  }).

  post('/', cookieParser, ensureAuthenticated, parseForm, csrfProtection, function(req, res) {
    var newFlow = req.body;
    Flow.create(newFlow, function() {
      res.redirect('/news');
    });
  });

module.exports = router;

