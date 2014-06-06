/*global module, require*/
module.exports = function(grunt) {
  'use strict';

  // Load all grunt tasks matching the `grunt-*` pattern
  require('load-grunt-tasks')(grunt);

  // Project configuration
  grunt.initConfig({

    cssmin : {
      combine : {
        options : {
          keepSpecialComments : 0
        },
        files : {
          'styles/styles.min.css' : ['styles/bootstrap.css', 'styles/styles.css']
        }
      }
    }
  });

  grunt.registerTask('default', ['cssmin']);
};
