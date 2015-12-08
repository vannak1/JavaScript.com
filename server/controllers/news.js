var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')();
var moment = require('moment');
var pluralize = require('pluralize');
var expressValidator = require('express-validator');
var Articles = require(path.join(__dirname, '..', 'models', 'articles'));
var Users = require(path.join(__dirname, '..', 'models', 'users'));
var Akismetor = require(path.join(__dirname, '..', 'services', 'akismetor'));

var csrfProtection = csrf();
var parseForm = bodyParser.urlencoded({ extended: false });
var parseJson = bodyParser.json();
var authenticator = require("../services/authenticator")

var debug = require('debug')('JavaScript.com:server');

// -------------------------------------
//  Middleware
// -------------------------------------

function buildComment(request, response, next){

  var newComment = request.body;
  newComment.slug = request.params.slug;
  newComment.isSpam = false;
  newComment.date = new Date();

  request.newComment = newComment;

  Akismetor.checkSpam(request, newComment, isSpam, function() {
    next();
  });

  function isSpam(){
    request.newComment.isSpam = true;
    request.newComment.date = null;
  }
}

function addhttp(req, res, next) {
  var url = req.body.url
  if(!url.match(/^(http|https):\/\//)){
        req.body.url = "http://" + url;
  }
  next();
}

// -------------------------------------
//  Routes
// -------------------------------------

router.
  get('/', parseForm, function(req, res) {
    var lastArticleDate = req.query.pub_date;
    Articles.paginate(lastArticleDate, function(err, docs, more){
      if(lastArticleDate) {
        res.json({docs: docs, more: more})
      }else{
        res.render('news/index', {docs: docs, more: more})
      }
    });
  }).

  get('/new', cookieParser, csrfProtection, function(req, res) {
    if(!req.isAuthenticated()){
      req.session.returnTo = '/news' + req.path
      res.redirect('/users/sign_in');
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

  get('/:slug([a-zA-Z0-9_.-]+)', cookieParser, csrfProtection, function(req, res) {
    var user = {
      "authenticated": req.isAuthenticated(),
    }

    if (user.authenticated) {
      user.login      = req.user['_json']['login'];
      user.avatar_url = req.user['_json']['avatar_url'];
      user.id         = req.user.uid;
    }

    Articles.findBySlug(req.params.slug, function(err, doc) {
      if(doc){
        res.render('news/show', { doc: doc, user: user, token: req.csrfToken(), moment: moment, pluralize: pluralize });
      }else{
        res.render('404');
      }
    });
  }).

  post('/:slug([a-zA-Z0-9_.-]+)/comment', cookieParser, authenticator.authorize, parseForm, expressValidator(),  csrfProtection, buildComment, function(req, res) {
    req.sanitize('body').trim();
    req.check('body').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
      res.json({error: "Comment cannot be empty"});
    }else{
      var comment = req.newComment;
      var user = req.session.passport.user;
      Articles.addComment(comment, user, function(err, doc) {
        res.json({doc: doc.value});
      });
    }
  }).

  put('/:slug([a-zA-Z0-9_.-]+)/comment/:id([a-zA-Z0-9_.-]+)', cookieParser, authenticator.authorize, parseForm, csrfProtection, function(req, res) {
    var args = {
      updatedComment : req.body.body,
      commentId      : req.params.id,
      userId         : req.session.passport.user.uid
    }

    Articles.editComment(args, function(err, doc){
      if(doc){
        res.json({comment: doc})
      }else{
        res.send(404)
      }
    });
  }).

  delete('/:slug([a-zA-Z0-9_.-]+)/comment/:id([a-zA-Z0-9_.-]+)', cookieParser, authenticator.authorize, csrfProtection, function(req, res) {
    var args = {
      commentId      : req.params.id,
      userId         : req.session.passport.user.uid
    };

    Articles.deleteComment(args, function(err, response){
      if(!err){
        res.send(204)
      }else{
        res.send(403)
      }
    });
  }).

  post('/', cookieParser, authenticator.authorize, parseForm, addhttp, expressValidator(), csrfProtection, function(req, res) {

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
      var args = {}
      args.title = req.body.title;
      args.body = req.body.body;
      args.url = req.body.url;
      args.user = req.session.passport.user;
      console.log(args)
      Articles.create(args, function(err) {
        if(err) { throw err };
        res.redirect('/news/pending');
      });
    }
  });

module.exports = router;
