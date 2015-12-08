var express = require('express');
var passport = require('passport');
var router = express.Router();

router.
  get('/auth/github', passport.authenticate('github'), function(req, res){
    // The request will be redirected to GitHub for authentication, so this
    // function will not be called.
  })
  .get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/news/new' }), function(req, res) {
    // TODO: Fetch image and save it to S3
    // req.user['_json']['avatar_url']
    // req.user['_json']['login']
    res.redirect(req.session.returnTo || '/news');
  })

module.exports = router;
