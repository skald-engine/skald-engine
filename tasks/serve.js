var gulp    = require('gulp')
var config  = require('../gulpconfig.js')

var connect = require('gulp-connect')
var open = require('gulp-open')


gulp.task('_serve', [
  '_build',
  '_watch'
])


gulp.task('_livereload', function() {
  connect.server({
    livereload : true,
    root       : '.',
    port       : config.server.port,
  })

  return gulp.src('')
    .pipe(open({uri: `http://127.0.0.1:${config.server.port}/tests/features`}))
})


gulp.task('_watch', ['_livereload'], function() {
  gulp.watch('source/**/*', ['_build'])
  gulp.watch('tests/features/**/*', ['_build'])
})