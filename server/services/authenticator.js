var passport = require('passport');
var GitHubStrategy = require('passport-github').Strategy;
var BasicStrategy = require('passport-http').BasicStrategy;
var Users = require(path.join(__dirname, '..', 'models', 'users'));

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
        Users.findOrCreate(profile, accessToken, function (err, user) {
          if(err) throw err;

          profile.uid = user._id; // Storing intetnal user _id
          profile.email = user.email;
          return done(null, profile);
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
