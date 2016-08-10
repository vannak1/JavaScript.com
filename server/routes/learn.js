// *************************************
//
//   Routes - Learn
//   -> Lesson pages
//
// *************************************

// -------------------------------------
//   Dependencies
// -------------------------------------

var express = require('express');
var router = express.Router();

// -------------------------------------
//   Routes
// -------------------------------------

// ----- Index ----- //

router.get('/', function(req, res) {
  res.redirect('/learn/javascript/functions');
});

// ----- Lessons ----- //

var subjects = {
  'javascript': [
    'functions',
    'string-functions',
    'variables',
    'numbers',
    'combining-numbers',
    'combining-strings',
    'events',
    'objects',
    'dates'
  ]
};

var createSubjectRoute = function(subject) {
  router.get(`/${subject}`, function(req, res) {
    res.redirect('/learn/javascript/functions');
  });
};

var createLessonRoute = function(subject, lesson) {
  router.get(`/${subject}/${lesson}`, function(req, res) {
    res.render(`learn/${subject}/${lesson}`);
  });
};

for (var subject in subjects) {
  createSubjectRoute(subject);

  for (var i = 0; i < subject.length; i++) {
    createLessonRoute(subject, subjects[subject][i]);
  }
}


// -------------------------------------
//   Exports
// -------------------------------------

module.exports = router;
