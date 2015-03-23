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
var shell        = require('gulp-shell');
var _            = require('lodash');

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
            'bower_components/lodash/lodash.js',
            'bower_components/codemirror/lib/codemirror.js',
            'bower_components/cs_console/compiled/cs_console.js',
            'bower_components/abecedary/dist/abecedary.js',
            'client/**/*.js'],

    destFile: 'application.js',
    destDir:  'public/javascripts'
  },

  browserify: {
    files: ['chai',
            'javascript-sandbox',
            'esprima',
            'estraverse',
            './courses/helper/index.js'],
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
    gulp.start('javascript');
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
  var files = _.collect(options.browserify.files, function(file) {
    return '-r ' + file;
  }).join(' ');

  var output = options.browserify.destDir + '/' + options.browserify.destFile;


  return gulp.task('browserify', shell.task(['node_modules/browserify/bin/cmd.js '+files+' -o ' + output]));
});



// -------------------------------------
//   Task: Abecedary
// -------------------------------------

gulp.task('abecedary', function() {
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
  gulp.src(options.js.files)
    // .pipe(uglify({ mangle: false }))
    .pipe(concat(options.js.destFile))
    .pipe(gulp.dest(options.js.destDir));
});
