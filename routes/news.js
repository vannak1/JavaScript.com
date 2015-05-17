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
var moment = require('moment');
var pluralize = require('pluralize');


var csrfProtection = csrf({ cookie: true });
var parseForm = bodyParser.urlencoded({ extended: false });
var parseJson = bodyParser.json();

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
      "http://javascript.preschool.io/news/auth/github/callback" : "http://localhost:3000/news/auth/github/callback")
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    Users.findOrCreate(profile.id, function (err, user) {
      if(err) throw err;

      if (user){
        return done(null, profile);
      }else{
        // TODO: make sure we save those emails
        Users.createWithEmail(profile, accessToken, function(err, user){
          if(err) throw err;
          return done(err, user)
        });
      }
    });
  });
}
));

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/news/new')
}
/* End GitHub Auth */

/* Basic Auth*/
var BasicStrategy = require('passport-http').BasicStrategy;
// Use the BasicStrategy within Passport.
//   Strategies in Passport require a `verify` function, which accept
//   credentials (in this case, a username and password), and invoke a callback
//   with a user object.
passport.use(new BasicStrategy({
  },
  function(username, password, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {

      // Check for username. If there is no username given or the password is
      // incorrect, set the user to 'false' to indicate failure. Otherwise,
      // return the authenticated 'user'.
      if (!username || username != process.env.BASICAUTH_USERNAME ) { return done(null, false); }
      if (password != process.env.BASICAUTH_PASSWORD) { return done(null, false); }
      return done(null, username);
    });
  }
));
/* End Basic Auth*/

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
    News.publishedWithUsers( function(all) {
      var flow = [], news = [];
      all.map(function(item){
        if (item.news){
          news.push(item);
        }else{
          flow.push(item);
        }
      });
      res.render('news/index', {flow_collection: flow, news_collection: news, moment: moment});
    });

  }).
  get('/update', function(req, res) {
    debug('Updating news items from rss');

    // Not implemented yet

  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    console.log(req);
    if(!req.isAuthenticated()){
      res.redirect('/news/sign_in');
    }else{
      var csrfToken = req.csrfToken();
      var login = req.user['_json']['login'];
      var avatar = req.user['_json']['avatar_url'];

      res.render('news/new', { login: login, avatar: avatar, token: csrfToken });
    }
  }).

  get('/sign_in', function(req, res) {
    res.render('news/sign_in');
  }).

  get('/:slug([a-zA-Z0-9_.-]+)', cookieParser, csrfProtection, function(req, res) {
    var user = {
      "authenticated": req.isAuthenticated(),
    }

    if (user.authenticated) {
      user.login      = req.user['_json']['login'];
      user.avatar_url = req.user['_json']['avatar_url'];
    }

    Flow.bySlug(req.params.slug, function(flow) {
      Comments.byFlow(flow.id, function(comments) {
        if (flow.length > 0){
          res.render('news/show', { flow: flow[0], comments: comments, user: user, token: req.csrfToken(), moment: moment, pluralize: pluralize });
        }else{
          res.render('404');
        }
      });
    });
  }).

  post('/:id([0-9]+)/comment', cookieParser, ensureAuthenticated, parseForm, csrfProtection, buildComment, function(req, res) {

    var newComment = req.newComment;

    Users.byGithubId(req.user.id, function(result){
      newComment.userId = result[0].id;
      Comments.create(newComment, function() {
        if(newComment.isSpam){
          req.flash('info', 'Whoops! Your comment will need to be moderated.')
        }
        res.redirect('/news');
      });
    });
  }).

   post('/update', passport.authenticate('basic', { session: false }), parseJson, function(req, res) {
    var newEpisode = req.body;
    News.createFromEpisode(newEpisode, function() {
      res.json({ message: "Episode successfully sent" });
    });
  }).

  post('/', cookieParser, ensureAuthenticated, parseForm, csrfProtection, function(req, res) {
    var newFlow = req.body;
    Users.byGithubId(req.user.id, function(result){
      newFlow.user_id = result[0].id;
      Flow.create(newFlow, function() {
        res.redirect('/news');
      });
    });
  });

module.exports = router;

