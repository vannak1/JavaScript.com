var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var Articles = require('../services/articles');
var Users = require('../services/users');
var Comments = require('../services/comments');
var Akismetor = require('../services/akismetor');
var moment = require('moment');
var pluralize = require('pluralize');
var expressValidator = require('express-validator');
var _ = require('lodash');


var csrfProtection = csrf();
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
  callbackURL: (baseURL + "news/auth/github/callback"),
  scope: ['user:email']
},
function(accessToken, refreshToken, profile, done) {
  // asynchronous verification, for effect...
  process.nextTick(function () {
    Users.findOrCreate(profile.id, function (err, user) {
      if(err) throw err;

      if (user){
        // Store internal ID along with passport user info
        profile.userId = user.id;
        return done(null, profile);
      }else{
        Users.createWithEmail(profile, accessToken, function(err, user, id){
          if(err) throw err;
          // Store internal ID along with passport user info
          user.userId = id[0].id;
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
  newComment.slug = request.params.slug;
  newComment.isSpam = false;

  request.newComment = newComment;

  Akismetor.checkSpam(request, newComment, isSpam, function() {
    next();
  });

  function isSpam(){
    request.newComment.isSpam = true;
  }
}

// TODO move this into a module. Better yet, I'd like to get the custom
// sanitizers to start working.
function addhttp(url) {
  if(!url.match(/^(http|https):\/\//)){
        url = "http://" + url;
    }
    return url;
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
    res.redirect(req.session.returnTo || '/news');
   }).
  get('/signout', function(req, res){
    req.logout();
    res.redirect('/news');
  }).

  get('/', parseForm, function(req, res) {
    var offset = req.query.page;
    var more;
    if (offset) {
      Articles.paginated(offset, function(all) {
        Articles.totalPublished(function(total) {
          var lastDay;
          // TODO: Move date functionality into a serivce. It'll be used practically
          // everywhere. Oh, and refactor this blasphemy.
          //
          // TODO: We shouldn't be needing to use moment in order to make the time
          // UTC. There's an issue with pg and it's parsing the dates from the db
          // incorrectly. This is a temporary fix until I can snipe the bug.
          all.map(function(item){
            item.date = moment.utc(item.published_at).format('LL');
            if (item.date == moment.utc(Date.now()).format('LL')){
              item.date = 'Today'
            } else if (item.date == moment.utc(Date.now()).subtract(1, 'days').format('LL')){
              item.date = 'Yesterday'
            }else{
              item.date = moment(item.date).format('dddd, LL');
            }
          });
          // There are strings and integers here - not so good.
          if (all.length) {
            lastDay = all[all.length - 1].date;
          }
          more = (all.length == (total[0].count - offset )) ? false : true;
          all = _.groupBy(all, 'date');
          res.json({flow: all, more: more, lastDay: lastDay});
        });
      });
    }else{
      Articles.recent(function(all) {
        Articles.totalPublished(function(total) {
          var flow = [], news = [], lastDay;
          // TODO: Move date functionality into a serivce. It'll be used practically
          // everywhere. Oh, and refactor this blasphemy.
          //
          // TODO: We shouldn't be needing to use moment in order to make the time
          // UTC. There's an issue with pg and it's parsing the dates from the db
          // incorrectly. This is a temporary fix until I can snipe the bug.
          all.map(function(item){
            item.date = moment.utc(item.published_at).format('LL');
            if (item.date == moment.utc(Date.now()).format('LL')){
              item.date = 'Today'
            } else if (item.date == moment.utc(Date.now()).subtract(1, 'days').format('LL')){
              item.date = 'Yesterday'
            }else{
              item.date = moment(item.date).format('dddd, LL');
            }
            if (item.news){
              news.push(item);
            }else{
              flow.push(item);
            }
          });
          if(flow.length){
            lastDay = flow[flow.length - 1].date;
          }
          more = (flow.length === parseInt(total[0].count)) ? false : true;
          flow = _.groupBy(flow, 'date');
          res.render('news/index', {flow_collection: flow, news_collection: news, more: more, lastDay: lastDay });
        });
      });
    }
  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    if(!req.isAuthenticated()){
      req.session.returnTo = '/news' + req.path
      res.redirect('/news/sign_in');
    }else{
      var csrfToken = req.csrfToken();
      var login = req.user['_json']['login'];
      var avatar = req.user['_json']['avatar_url'];

      res.render('news/new', { login: login, avatar: avatar, token: csrfToken });
    }
  }).

  get('/pending', function(req, res) {
    res.render('news/pending');
  }).

  get('/sign_in', function(req, res) {
    req.session.returnTo = req.session.returnTo || req.headers.referer;
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

    Articles.findBySlug(req.params.slug, function(flow) {
      Comments.findByArticleId(flow[0].id, function(comments) {
        if (flow.length > 0){
          res.render('news/show', { flow: flow[0], comments: comments, user: user, token: req.csrfToken(), moment: moment, pluralize: pluralize });
        }else{
          res.render('404');
        }
      });
    });
  }).

  post('/:slug([a-zA-Z0-9_.-]+)/comment', cookieParser, ensureAuthenticated, parseForm, expressValidator(),  csrfProtection, buildComment, function(req, res) {
    // TODO: Perhaps this should be done in the buildComment()?
    req.sanitize('body').trim();
    req.check('body').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.json({error: "Comment cannot be empty"});
    }else{
      var newComment = req.newComment;

      newComment.userId = req.session.passport.user.userId;
      Comments.create(newComment, function(comment) {
        if(newComment.isSpam){
          comment[0].isSpam = true;
          res.json({comment: comment[0]});
        }else{
          Comments.findByCommentId(comment[0].id, function(comment) {
            res.json({comment: comment[0]});
          });
        }
      });
    }
  }).

   post('/update', passport.authenticate('basic', { session: false }), parseJson, function(req, res) {
    var stories = req.body;
    for (i=0; i < stories.length; i++) {
      var story = stories[i];
      // I'm sure there's a better way to do this.
      if(i === stories.length-1){
        Articles.createNews(story, function(){res.sendStatus(201);});
      }else{
        Articles.createNews(story, function(){});
      }
    }
  }).

  post('/', cookieParser, ensureAuthenticated, parseForm, expressValidator(), csrfProtection, function(req, res) {

    // Validations
    req.check('title','Title is required' ).notEmpty();
    req.check('url', 'URL is required').notEmpty();
    req.check('url', 'URL is not valid').isURL();
    req.check('body', 'Description is required').notEmpty();
    req.check('body', 'Description must be between 100 and 300 characters').len(100,300);

    req.sanitize('body').escape();
    req.sanitize('title').escape();

    var errors = req.validationErrors();

    if (errors) {
      errors.map(function(error) {
        res.flash('error', error.msg);
      });
      res.status(400).render('news/new', {token: req.csrfToken(), title: req.body.title, url: req.body.url, body: req.body.body});
    }else{

      var newFlow = req.body;
      newFlow.url = addhttp(newFlow.url);
      newFlow.userId = req.session.passport.user.userId;

      Articles.createFlow(newFlow, function() {
        res.redirect('/news/pending');
      });
    }
  });

module.exports = router;

