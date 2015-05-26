// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
//   Modules
// -------------------------------------

var gulp         = require('gulp');
var watch        = require('gulp-watch');
var sass         = require('gulp-sass');
var minifycss    = require('gulp-minify-css');
var rename       = require('gulp-rename');
var autoprefixer = require('gulp-autoprefixer');
var uglify       = require('gulp-uglify');
var concat       = require('gulp-concat');
var shell        = require('gulp-shell');
var svgmin       = require('gulp-svgmin');
var svgstore     = require('gulp-svgstore');
var _            = require('lodash');
var run          = require('run-sequence');
var Chance       = require('chance');
var db           = require('./services/db');

// -------------------------------------
//   Variables
// -------------------------------------

var options = {

  build: {
    tasks: ['sass', 'abecedary', 'javascript']
  },

  css: {
    file: 'public/stylesheets/application.css',
    destination: 'public/stylesheets'
  },

  sass: {
    files: [
      'client/stylesheets/*.{sass,scss}',
      'client/stylesheets/**/*.{sass,scss}'
    ],
    destination: 'public/stylesheets'
  },

  js: {
    files: [
      'client/javascripts/application.js',
      'client/javascripts/**/*.js'
    ],
    vendorFiles: ['bower_components/jquery/dist/jquery.js', 'bower_components/bootstrap/js/tooltip.js'],
    vendorCourseFiles: [
      'bower_components/angular/angular.js',
      'bower_components/angular-resource/angular-resource.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/lodash/lodash.js',
      'bower_components/marked/marked.min.js',
      'bower_components/codemirror/lib/codemirror.js',
      'bower_components/cs_console/dist/cs_console.js',
      'bower_components/abecedary/dist/abecedary.js',
    ],
    courseFiles: ['client/javascriptcom/**/*.js',],
    destFile: 'application.js',
    destVendorFile: 'vendor.js',
    destVendorCourseFile: 'vendor-course.js',
    destCourseFile: 'course.js',
    destDir: 'public/javascripts'
  },

  browserify: {
    files: ['chai',
            'javascript-sandbox',
            'jshint',
            './courses/helper/index.js'
    ],
    destFile: 'vendor.js',
    destDir:  'bower_components/abecedary/dist'
  },

  abecedary: {
    files: [
      'bower_components/abecedary/dist/vendor.js',
      'node_modules/mocha/mocha.js',
      'bower_components/abecedary/dist/reporter.js',
    ],
    destFile: 'abecedary-javascript-com.js',
    destDir:  'public/javascripts'
  },

  icons: {
    files: 'public/images/icons/icon-*.svg',
    destDir: 'public/images/icons'
  }

};


// -------------------------------------
//   Task: build
// -------------------------------------

gulp.task('build', function() {
  run(options.build.tasks);
});

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task('default', function() {
  watch(options.sass.files, function(files) {
    gulp.start('sass');
  });

  watch(options.js.files, function(files) {
    gulp.start('javascript');
  });
  watch(options.js.courseFiles, function(files) {
    gulp.start('javascript');
  });

  watch(options.icons.files, function(files) {
    gulp.start('icons');
  });

  watch(options.browserify.files, function(files) {
    gulp.start('browserify');
  });

  watch(options.abecedary.files, function(files) {
    gulp.start('abecedary');
  });
});

// -------------------------------------
//   Task: CSS Minify
// -------------------------------------

gulp.task('minify-css', function () {
  gulp.src(options.css.file)
      .pipe(minifycss({ advanced: false }))
      .on('error', function(error) { console.log(error.message); })
      .pipe(gulp.dest(options.css.destination));
});

// -------------------------------------
//   Task: Sass
// -------------------------------------

gulp.task('sass', function () {
  gulp.src(options.sass.files)
      .pipe(sass({ indentedSyntax: true }))
      .on('error', function(error) { console.log(error.message); })
      .pipe(autoprefixer({
        browsers: [ 'last 2 versions', 'Explorer >= 9' ],
        cascade: false
      }))
      .pipe(gulp.dest(options.sass.destination));
});

// -------------------------------------
//   Task: Browserify
// -------------------------------------

gulp.task('browserify', function() {
  var files = _.collect(options.browserify.files, function(file) {
    return '-r ' + file;
  }).join(' ');

  var output = options.browserify.destDir + '/' + options.browserify.destFile;

  return gulp.task('browserify', shell.task(['node_modules/browserify/bin/cmd.js '+files+' -o ' + output]));
});

// -------------------------------------
//   Task: Abecedary
// -------------------------------------

gulp.task('abecedary', ['browserify'], function() {
  // Combine the non-browserified files and the browserified ones
  // to create the runner script, included in the test iframe.
  gulp.src(options.abecedary.files)
    .pipe(concat(options.abecedary.destFile))
    .pipe(gulp.dest(options.abecedary.destDir));
});

// -------------------------------------
//   Task: JavaScript
// -------------------------------------

gulp.task('javascript', function() {
  // application.js
  gulp.src(options.js.files)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destFile))
    .pipe(gulp.dest(options.js.destDir));

  // vendor.js
  gulp.src(options.js.vendorFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destVendorFile))
    .pipe(gulp.dest(options.js.destDir));

  // vendor-course.js
  gulp.src(options.js.vendorCourseFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destVendorCourseFile))
    .pipe(gulp.dest(options.js.destDir));

  // course.js
  gulp.src(options.js.courseFiles)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destCourseFile))
    .pipe(gulp.dest(options.js.destDir));
});

// -------------------------------------
//   Task: Icons
// -------------------------------------

gulp.task('icons', function() {
  gulp.src(options.icons.files)
    .pipe(svgmin())
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(gulp.dest(options.icons.destDir));
});

// -------------------------------------
//   Task: Seeds
// -------------------------------------
gulp.task('seeds', function() {
  var chance = new Chance();
  for(i = 0; i < 50; i++) {
    var title = chance.sentence({words: 5});
    var slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,"").replace(/\s/g,'-');
    var body = chance.paragraph();
    var url = chance.url();
    var published_at = chance.date({year: 2014});
    db.query('INSERT INTO articles (title, slug, body, url, published_at, news, approved) VALUES ($1, $2, $3, $4, $5, true, true);',
      [title, slug, body, url, published_at],
      function(){}
    );
  }
  for (i = 0; i < 7; i++) {
    var githubId = chance.integer({min: 1, max: 6000});
    var email = chance.email();
    var name = chance.name();
    var avatarUrl = 'https://avatars.githubusercontent.com/u/' + chance.pick([6965062,3412,10722,6797535,2618,30208]) + '?v=3';
    db.query('INSERT INTO users (github_id, email, name, avatar_url) VALUES ($1, $2, $3, $4);',
      [githubId, email, name, avatarUrl],
      function(){}
    );
  }

  for(i = 0; i < 50; i++) {
    var title = chance.sentence({words: 5});
    var slug = title.toLowerCase().replace(/[^a-zA-Z0-9\s]/g,"").replace(/\s/g,'-');
    var body = chance.paragraph();
    var url = chance.url();
    var published_at = chance.date({year: 2014});
    var userId = chance.d6();
    db.query('INSERT INTO articles (user_id, title, slug, body, url, published_at, news, approved) VALUES ($1, $2, $3, $4, $5, $6, false, true);',
      [userId, title, slug, body, url, published_at],
      function(){}
    );
  }

   for(i = 0; i < 50; i++) {
    var userId = chance.d6();
    var body = chance.paragraph();
    var articleId = chance.integer({min: 51, max: 100});
    db.query('INSERT INTO comments (user_id, approved, body, article_id) VALUES ($1, true, $2, $3);',
      [userId, body, articleId],
      function(){}
    );
  }

});
