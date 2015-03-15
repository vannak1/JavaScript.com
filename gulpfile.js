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
