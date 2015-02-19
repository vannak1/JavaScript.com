// *************************************
//
//   Gulpfile
//
// *************************************

// -------------------------------------
//   Modules
// -------------------------------------

var gulp       = require( 'gulp' );
    watch      = require( 'gulp-watch' ),
    sass       = require('gulp-sass');

// -------------------------------------
//   Variables
// -------------------------------------

var sassFiles       = [ 'public/stylesheets/*.sass', 'public/stylesheets/**/*.sass' ];
var cssFiles        = 'public/stylesheets';

// -------------------------------------
//   Task: Default
// -------------------------------------

gulp.task( 'default', function() {

  watch( sassFiles, function( files ) {

    gulp.start( 'sass' );

  } );

} );

// -------------------------------------
//   Task: Sass
// -------------------------------------

gulp.task( 'sass', function () {

  gulp.src( sassFiles )
      .pipe( sass( { indentedSyntax: true } ) )
      .pipe( gulp.dest( cssFiles ) );

} );
