// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
//   Modules
// -------------------------------------

var gulp      = require('gulp');
var watch     = require('gulp-watch');
var sass      = require('gulp-sass');
var minifycss = require('gulp-minify-css');
var rename    = require('gulp-rename');

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
      .pipe(minifycss())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(options.css.destination));
});

// -------------------------------------
//   Task: Sass
// -------------------------------------

gulp.task('sass', function () {
  gulp.src(options.sass.files)
      .pipe(sass({ indentedSyntax: true }))
      .pipe(gulp.dest(options.sass.destination));
});
