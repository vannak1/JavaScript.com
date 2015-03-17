var express = require('express');
var router  = express.Router();
var path    = require('path');
var Course  = require(path.join(__dirname, '..', 'services', 'course'));

router
  .get('/list.json', function(req, res) {
    res.json(Course.all());
  })
  .get('/:id.json', function(req, res) {
    var course = Course.find(req.params.id);

    if (course.error) {
      res.status(404).json(course);
    } else {
      res.json(course);
    }
  });

module.exports = router;
