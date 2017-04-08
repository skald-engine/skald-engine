var gulp = require('gulp')
var requiredir = require('requiredir')
var config = require('./gulpconfig.js')
requiredir('tasks')

gulp.task('serve', ['_serve'])
gulp.task('test', ['_test'])
gulp.task('build', ['_build'])
gulp.task('api', ['_api'])
