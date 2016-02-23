'use strict';

// Gulp Dependencies
let gulp = require('gulp');
let rename = require('gulp-rename');

// Build Dependencies
let browserify = require('gulp-browserify');
let uglify = require('gulp-uglify');
let hbsfy = require('hbsfy').configure({
  extensions: ['html', 'hbs']
});

// Style Dependencies
let less = require('gulp-less');
let prefix = require('gulp-autoprefixer');
let minifyCSS = require('gulp-minify-css');

// Development Dependencies
let jshint = require('gulp-jshint');

// Test Dependencies
let mochaPhantomjs = require('gulp-mocha-phantomjs');

// development server
let connect = require('gulp-connect');

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

gulp.task('browserify-client', ['lint-client'], function() {
  return gulp.src('client/index.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: [hbsfy, 'babelify']
    }))
    .pipe(rename('iterate-timeline.js'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/javascripts'))
});

gulp.task('browserify-test', ['lint-test'], function() {
  return gulp.src('test/client/index.js')
    .pipe(browserify({
      insertGlobals: true,
      transform: ['babelify']
    }))
    .pipe(rename('client-test.js'))
    .pipe(gulp.dest('build'))
});

gulp.task('test', ['lint-test', 'browserify-test'], function() {
  return gulp.src('test/client/index.html')
    .pipe(mochaPhantomjs());
});

gulp.task('styles', function() {
  return gulp.src('client/less/index.less')
    .pipe(less())
    .pipe(prefix({ cascade: true }))
    .pipe(rename('iterate-timeline.css'))
    .pipe(gulp.dest('build'))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('minify', ['styles'], function() {
  return gulp.src('build/iterate-timeline.css')
    .pipe(minifyCSS())
    .pipe(rename('iterate-timeline.min.css'))
    .pipe(gulp.dest('public/stylesheets'));
});

gulp.task('uglify', ['browserify-client'], function() {
  return gulp.src('build/iterate-timeline.js')
    .pipe(uglify())
    .pipe(rename('iterate-timeline.min.js'))
    .pipe(gulp.dest('public/javascripts'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'public'
  });
});

gulp.task('watch', function() {
  gulp.watch('client/**/*.less', ['minify']);
  gulp.watch('client/**/*.js', ['browserify-client']);
  gulp.watch('test/client/**/*.js', ['test']);
});

gulp.task('build', ['browserify-client', 'minify']);

gulp.task('default', ['build', 'connect', 'watch']);

gulp.task('serveprod', function() {
  connect.server({
    root: 'public',
    port: process.env.PORT || 5000,
    livereload: false
  });
});
