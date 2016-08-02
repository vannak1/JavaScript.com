var express = require('express');
var router = express.Router();

/* GET /try page */
router.get('/', function(req, res) {
  res.render('tryJavascript/index');
});

module.exports = router;
