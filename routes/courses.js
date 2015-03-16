var express = require('express');
var router  = express.Router();
var path    = require('path');
var Course  = require(path.join(__dirname, '..', 'services', 'course'));

router
  .get('/list.json', function(req, res) {
    res.json(Course.all());
  })
  .get('/:id.json', function(req, res) {
    res.json(Course.find(req.params.id));
  });

module.exports = router;
