var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var User = require('./../../server/models').User;
var GithubApi = require('../services/github-api');
var sequelize = require('sequelize');

authenticator = {
  init: function(){
    passport.serializeUser(function(user, done) {
      done(null, user);
    });
    passport.deserializeUser(function(obj, done) {
      done(null, obj);
    });

    var githubClientArgs = {
      clientID: process.env.GH_CLIENT_ID,
      clientSecret: process.env.GH_CLIENT_SECRET,
      callbackURL: (baseURL + "sessions/auth/github/callback"),
      scope: ['user:email']
    };

    passport.use(new GitHubStrategy(githubClientArgs, function(accessToken, refreshToken, profile, done) {
      // asynchronous verification, for effect...
      process.nextTick(function () {
        var query = { 'github_id': profile.id }
        var user =
         {
           'github_id' : profile.id,
           'name' : profile.displayName || profile.username,
           'avatar_url' : profile['_json'].avatar_url
         };

        // TODO: There is probably a more sane way of handling this.
        User.afterCreate(function(_user, options ){
          GithubApi.fetchEmail(accessToken, function(email){
            _user.email = email
            _user.save();
          });
        });

        User.findOrCreate({where: query, defaults: user})
        .spread(function(_user, created) {
          profile.uid = _user.id;
          return done(null, profile);
        })
        .catch(function(err){
          return done(err, profile);
        });
      });
    }));


    /* End GitHub Auth */

    /* Basic Auth*/
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

  },

  authorize: function (req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/sessions/sign_in')
  },

  authorizeAdmin: function(req, res, next) {
    Users.findByGithub(req.user.id, function(err, user){
      if (user.admin && req.isAuthenticated()) {
        return next();
      } else {
        res.status(403);
        req.flash("You shall not pass!");
        res.redirect('/');
      }
    });
  }

}

module.exports = authenticator;
