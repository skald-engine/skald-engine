var gulp    = require('gulp')
var config  = require('../gulpconfig.js')

var connect = require('gulp-connect');


gulp.task('_serve', [
  '_build',
  '_watch'
])


gulp.task('_livereload', function() {
  connect.server({
    livereload : true,
    root       : '.',
    port       : config.server.port,
  });
});


gulp.task('_watch', ['_livereload'], function() {
  gulp.watch('source/**/*', ['_build']);
  gulp.watch('ignore-tests/**/*', ['_build']);
  // gulp.watch('tests/**/*',  ['_build_tests']);
});
