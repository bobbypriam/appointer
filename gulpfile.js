var gulp = require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var cssmin = require('gulp-cssmin');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

gulp.task('lint', function () {
  return gulp.src(['app/**/*.js',
            'public/app/dashboard/*.js',
            'public/app/public/*.js',
            'public/assets/js/*.js'])
          .pipe(jshint())
          .pipe(jshint.reporter());
});

gulp.task('sass', function () {
  return gulp.src('public/assets/src/sass/style.sass')
          .pipe(sass())
          .pipe(gulp.dest('public/assets/css'));
});

gulp.task('concat-minify-css', ['sass'], function () {
  return gulp.src(['public/assets/vendor/datepicker/css/bootstrap-datepicker3.min.css',
            'public/assets/css/style.css'])
          .pipe(concat('main.css'))
          .pipe(gulp.dest('public/assets/css'))
          .pipe(rename('main.min.css'))
          .pipe(cssmin())
          .pipe(gulp.dest('public/assets/css'));
});

gulp.task('concat-uglify-js', ['lint'], function () {
  var dashboard = gulp.src(['public/assets/vendor/jquery/jquery.min.js',
                            'public/assets/vendor/bootstrap/js/bootstrap.min.js',
                            'public/assets/vendor/datepicker/js/bootstrap-datepicker.min.js',
                            'public/assets/vendor/floatthead/jquery.floatThead.min.js',
                            'public/assets/vendor/angular/angular.js',
                            'public/assets/vendor/angular/angular-route.js',
                            'public/assets/vendor/angular/angular-floatThead.js',
                            'public/app/dashboard/*.js'])
                      .pipe(concat('dashboard.js'))
                      .pipe(gulp.dest('public/app'))
                      .pipe(rename('dashboard.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('public/app'));

  var publicCalendar = gulp.src(['public/assets/vendor/jquery/jquery.min.js',
                                 'public/assets/vendor/bootstrap/js/bootstrap.min.js',
                                 'public/assets/vendor/floatthead/jquery.floatThead.min.js',
                                 'public/assets/vendor/angular/angular.js',
                                 'public/assets/vendor/angular/angular-route.js',
                                 'public/assets/vendor/angular/angular-floatThead.js',
                                 'public/app/public/*.js'])
                      .pipe(concat('public.js'))
                      .pipe(gulp.dest('public/app'))
                      .pipe(rename('public.min.js'))
                      .pipe(uglify())
                      .pipe(gulp.dest('public/app'));

  return [dashboard, publicCalendar];
});

gulp.task('css', ['concat-minify-css']);
gulp.task('js', ['concat-uglify-js']);

gulp.task('default', ['lint', 'sass']);
