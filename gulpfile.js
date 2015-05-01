var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function () {
  return gulp.src(['server/**/*.js',
            'client/app/dashboard/**/*.js',
            'client/app/public/**/*.js',
            'client/assets/js/*.js'])
          .pipe(jshint())
          .pipe(jshint.reporter());
});

gulp.task('sass', function () {
  return gulp.src('client/assets/src/sass/style.sass')
          .pipe(sass())
          .pipe(gulp.dest('client/assets/css'));
});

gulp.task('concat-minify-css', ['sass'], function () {
  return gulp.src(['client/assets/vendor/datepicker/css/bootstrap-datepicker3.min.css',
            'client/assets/css/style.css'])
          .pipe(concat('main.css'))
          .pipe(gulp.dest('client/assets/css'))
          .pipe(rename('main.min.css'))
          .pipe(cssmin())
          .pipe(gulp.dest('client/assets/css'));
});

gulp.task('concat-uglify-js', ['lint'], function () {
  var dashboard = gulp.src(['client/assets/vendor/jquery/jquery.min.js',
                            'client/assets/vendor/bootstrap/js/bootstrap.min.js',
                            'client/assets/vendor/datepicker/js/bootstrap-datepicker.min.js',
                            'client/assets/vendor/floatthead/jquery.floatThead.min.js',
                            'client/assets/vendor/angular/angular.js',
                            'client/assets/vendor/angular/angular-route.js',
                            'client/assets/vendor/angular/angular-floatThead.js',
                            'client/app/dashboard/**/*.js'])
                      .pipe(concat('dashboard.js'))
                      .pipe(gulp.dest('client/app'))
                      .pipe(rename('dashboard.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('client/app'));

  var publicCalendar = gulp.src(['client/assets/vendor/jquery/jquery.min.js',
                                 'client/assets/vendor/bootstrap/js/bootstrap.min.js',
                                 'client/assets/vendor/floatthead/jquery.floatThead.min.js',
                                 'client/assets/vendor/angular/angular.js',
                                 'client/assets/vendor/angular/angular-route.js',
                                 'client/assets/vendor/angular/angular-floatThead.js',
                                 'client/app/public/**/*.js'])
                      .pipe(concat('public.js'))
                      .pipe(gulp.dest('client/app'))
                      .pipe(rename('public.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('client/app'));

  return [dashboard, publicCalendar];
});

gulp.task('watch', function () {
  gulp.watch('client/app/**/*.js', ['js']);
  gulp.watch('client/assets/src/sass/**/*.sass', ['css']);
});

gulp.task('css', ['concat-minify-css']);
gulp.task('js', ['concat-uglify-js']);

gulp.task('default', ['css', 'js', 'watch']);
