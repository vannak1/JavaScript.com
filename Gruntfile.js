module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-svgstore');

  grunt.initConfig({

    svgstore: {
      'default': {
        options: {
          cleanup: ['fill'],
          includeTitleElement: false
        },
        files: {
          'public/images/icons/icons.svg': ['public/images/icons/icon-*.svg']
        }
      }
    }

  });

  grunt.registerTask('default', ['svgstore']);

};
