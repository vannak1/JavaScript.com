var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var Articles = require(path.join(__dirname, '..', 'services', 'articles'));
var Users = require(path.join(__dirname, '..', 'services', 'users'));
var Comments = require(path.join(__dirname, '..', 'services', 'comments'));
var Akismetor = require(path.join(__dirname, '..', 'services', 'akismetor'));
var moment = require('moment');
var pluralize = require('pluralize');
var expressValidator = require('express-validator');
var config = require(path.join(__dirname, '..', '..', 'config'));

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
  clientID: config.apiKeys.github.clientId,
  clientSecret: config.apiKeys.github.clientSecret,
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
      if (!username || username != config.server.basicAuth.username ) { return done(null, false); }
      if (password != config.server.basicAuth.password) { return done(null, false); }
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
    res.redirect(req.session.returnTo || '/');
   }).
  get('/signout', function(req, res){
    req.logout();
    res.redirect('/');
  }).

  get('/', parseForm, function(req, res) {
    var offset = req.query.page;
    var more;
    if (offset) {
      Articles.paginated(offset, function(all) {
        Articles.totalPublished(function(total) {
          more = (all.length == (total[0].count - offset )) ? false : true;
          res.json({flow: all, more: more});
        });
      });
    }else{
      res.redirect('/');
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
      user.id         = req.user.userId;
    }

    Articles.findBySlug(req.params.slug, function(flow) {
      if (flow.length > 0){
        Comments.findByArticleId(flow[0].id, function(comments) {
          res.render('news/show', { flow: flow[0], comments: comments, user: user, token: req.csrfToken(), moment: moment, pluralize: pluralize });
        });
      }else{
          res.render('404');
      }
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

  put('/:slug([a-zA-Z0-9_.-]+)/comment/:id([0-9]+)', cookieParser, ensureAuthenticated, parseForm, csrfProtection, function(req, res) {
    var updatedComment = req.body.body;
    var commentId      = req.params.id;
    var userId         = req.user.userId;

    Comments.checkOwnership(commentId, userId, function(comment) {
      if(comment[0]){
        Comments.update(comment[0].id, updatedComment, function(comment) {
          Comments.findByCommentId(comment[0].id, function(comment) {
            res.json({comment: comment[0]});
          });
        });
      }else{
        res.send(403);
      }
    });
  }).

  delete('/:slug([a-zA-Z0-9_.-]+)/comment/:id([0-9]+)', cookieParser, ensureAuthenticated, csrfProtection, function(req, res) {
    var commentId = req.params.id;
    var userId = req.user.userId;
    Comments.checkOwnership(commentId, userId, function(comment) {
      if(comment[0]){
        Comments.delete(comment[0].id, function() { res.send(200 )});
      }else{
        res.send(403);
      }
    });
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
