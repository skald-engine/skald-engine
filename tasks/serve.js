var gulp = require('gulp')
var connect = require('gulp-connect')
var config = require('../gulpconfig.js')
var connect = require('gulp-connect');

gulp.task('_serve', ['_build', '_watch'])

gulp.task('_livereload', function() {
  connect.server({
    livereload : true,
    root       : 'build',
    port       : config.serverPort,
  });
});

gulp.task('_do_reload', function() {
  return gulp.src('').pipe(connect.reload())
})

gulp.task('_watch', ['_livereload'], function() {
  gulp.watch('source/**/*', ['_build_library_js']);
  gulp.watch('tests/**/*', ['_build_tests']);
});
