module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sass: {
      dist: {
        files: {
          'public/css/src/style.css': 'public/sass/style.sass'
        }
      }
    },
    concat: {
      js: {
        files: {
          'public/js/dashboard.js': [
            'public/vendor/jquery/jquery.min.js',
            'public/vendor/bootstrap/js/bootstrap.min.js',
            'public/vendor/datepicker/js/bootstrap-datepicker.min.js',
            'public/vendor/floatthead/jquery.floatThead.min.js',
            'public/vendor/angular/angular.js',
            'public/vendor/angular/angular-route.js',
            'public/vendor/angular/angular-floatThead.js',
            'public/js/dashboard/*.js'
          ],
          'public/js/public.js': [
            'public/vendor/jquery/jquery.min.js',
            'public/vendor/bootstrap/js/bootstrap.min.js',
            'public/vendor/floatthead/jquery.floatThead.min.js',
            'public/vendor/angular/angular.js',
            'public/vendor/angular/angular-route.js',
            'public/vendor/angular/angular-floatThead.js',
            'public/js/public/*.js'
          ]
        }
      },
      css: {
        files: {
          'public/css/style.css': [
            'public/vendor/datepicker/css/bootstrap-datepicker3.min.css',
            'public/css/src/*.css'
          ],
        }
      }
    },
    uglify: {
      js: {
        files: {
          'public/js/dashboard.min.js': ['public/js/dashboard.js'],
          'public/js/public.min.js': ['public/js/public.js']
        }
      }
    },
    cssmin: {
      css: {
        src: 'public/css/style.css',
        dest: 'public/css/style.min.css'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.registerTask('default', ['sass:dist', 'concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
  grunt.registerTask('css', ['sass:dist', 'concat:css', 'cssmin:css']);
  grunt.registerTask('js', ['concat:js', 'uglify:js']);
};