var express = require('express');
var router = express.Router();

router
  .get('/signout', function(req, res){
    req.logout();
    res.redirect('/news');
  })

  .get('/sign_in', function(req, res) {
    req.session.returnTo = req.session.returnTo || req.headers.referer;
    res.render('users/sign_in');
  });

module.exports = router;
