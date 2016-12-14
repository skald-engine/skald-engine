var gulp = require('gulp')
var config = require('../gulpconfig.js')

var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var connect = require('gulp-connect');
var babelify = require('babelify');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');

gulp.task('_build', [
  '_build_lite_js',
  // '_build_full_js',
  '_build_tests'
])

gulp.task('_build_lite_js', function() {
  return browserify({
      entries: 'source/batma.js',
      debug: true,
      paths: ['./source/']
    })
    .transform(babelify.configure({
      presets: ['es2015'],
    }))
    .bundle()
    .pipe(source('batma.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init())
      .pipe(uglify().on('error', function(error) {
        console.error('Error: '+error.message);
        console.error('Line: '+error.lineNumber);
      }))
      .pipe(rename({suffix: '.min'}))
    .pipe(sourcemaps.write('.', {
      sourceRoot: 'source/',
      sourceMappingURLPrefix: '/js'
    }))
    .pipe(replace('%VERSION%', config.version))
    .pipe(replace('%DATE%', config.date))
    .pipe(replace('%ENVIRONMENT%', config.environment))
    .pipe(replace('%REVISION%', config.revision))
    .pipe(gulp.dest('build/lib/'))
    .pipe(connect.reload())
})

gulp.task('_build_tests', function() {
  return gulp.src('tests/**/*')
    .pipe(gulp.dest('build/tests/'))
    .pipe(connect.reload())
})