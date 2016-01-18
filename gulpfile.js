// Gulp Dependencies
var gulp = require('gulp');
var rename = require('rename');

// Build Dependencies
var browserify = require('gulp-browserify');
var uglify = require('gulp-uglify');

// Style Dependencies
var less = require('gulp-less');
var prefix = require('gulp-autoprefixer');
var minifyCSS = require('gulp-minify-css');

// Development Dependencies
var jshint = require('gulp-jshint');

// Test Dependencies
var mochaPhantomjs = require('gulp-mocha-phantomjs');

gulp.task('lint-client', function() {
  return gulp.src('./client/**/*.js')
                                .pipe(jshint())
                                .pipe(jshint.reporter('default'));
});


gulp.task('lint-test', function() {
  return gulp.src('./test/**/*.js')
                                .pipe(jshint())
                                .pipe(jshint.reporter('default'));
});
