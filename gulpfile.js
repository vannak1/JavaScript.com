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
var gutil        = require('gulp-util');
var browserify   = require('browserify');
var transform    = require('vinyl-transform');

// -------------------------------------
//   Variables
// -------------------------------------

var options = {

  css: {
    files: 'public/stylesheets',
    file: 'public/stylesheets/application.css',
    destination: 'public/stylesheets'
  },

  sass: {
    files: ['public/stylesheets/*.sass', 'public/stylesheets/**/*.sass'],
    destination: 'public/stylesheets'
  },

  js: {
    files: ['bower_components/angular/angular.js',
            'bower_components/jquery/dist/jquery.js',
            'bower_components/codemirror/lib/codemirror.js',
            'bower_components/cs_console/compiled/cs_console.js',
            'bower_components/mocha/mocha.js',
            'bower_components/abecedary/dist/abecedary.js',
            'bower_components/abecedary/dist/runner.js',
            'public/javascripts/**/*.js'],

    destFile: 'application.js',
    destDir:  'public/javascripts'
  },

  browserify: {
    files: ['node_modules/chai/index.js',
            'node_modules/javascript-sandbox/lib/index.js'],

    destFile: 'browserify.js',
    destDir:  'public/javascripts'
  }
};

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task('default', function() {
  watch(options.sass.files, function(files) {
    gulp.start('sass');
    gulp.start('minify-css');
  });

  watch(options.js.files, function(files) {
    gulp.start(uglify);
  });
});

// -------------------------------------
//   Task: CSS Minify
// -------------------------------------

gulp.task('minify-css', function () {
  gulp.src(options.css.file)
      .pipe(minifycss({ advanced: false }))
      .on('error', function(error) { console.log(error.message); })
      .pipe(rename({ suffix: '.min' }))
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
  var browserified = transform(function(filename) {
    var b = browserify(filename);

    return b.bundle();
  });

  return gulp.src(options.browserify.files)
    .pipe(browserified)
    .pipe(concat(options.browserify.destFile))
    .pipe(gulp.dest(options.browserify.destDir));
});

// -------------------------------------
//   Task: JavaScript Uglify
// -------------------------------------

gulp.task('uglify', function() {
  options.js.files.push('!public/javascripts/application.js');

  gulp.src(options.js.files)
    .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destFile))
    .pipe(gulp.dest(options.js.destDir));
});
