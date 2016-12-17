var gulp   = require('gulp')
var config = require('../gulpconfig.js')

var sourcemaps = require('gulp-sourcemaps');
var uglify     = require('gulp-uglify')
var rename     = require('gulp-rename')
var replace    = require('gulp-replace')
var connect    = require('gulp-connect')
var concat     = require('gulp-concat')
var babelify   = require('babelify')
var browserify = require('browserify')
var source     = require('vinyl-source-stream')
var buffer     = require('vinyl-buffer')

gulp.task('_build', [
  '_build_lite_lib',
  '_build_full_lib'
])


gulp.task('_build_lite_lib', function() {
  // Merge all files from the `source/index.js`, imports will be relative to source/
  return browserify({
      debug   : true,
      entries : 'source/index.js',
      paths   : ['./source/']
    })

    // Tranform ES6 to ES5
    .transform(babelify.configure({
      presets: ['es2015'],
    }))
    .bundle()

    // Create temp file in memory
    .pipe(source(config.build.files.lite))
    .pipe(buffer())

    // Open source map
    .pipe(sourcemaps.init())

      // Uglify the file
      .pipe(uglify({preserveComments:'license'})
        .on('error', e => {
        console.error(`Error: ${e.message}\nLine: ${e.lineNumber}`)
      }))

    // Close and save source map
    .pipe(sourcemaps.write('.', {
      sourceRoot: 'source/',
    }))

    // Replace variables
    .pipe(replace('%VERSION%', config.build.version))
    .pipe(replace('%DATE%', config.build.date))
    .pipe(replace('%REVISION%', config.build.revision))

    // Save the file
    .pipe(gulp.dest('build/lib/'))
})


gulp.task('_build_full_lib', ['_build_lite_lib'], function() {
  let lite = [`build/lib/${config.build.files.lite}`]
  let files = config.build.dependencies.concat(lite)
  
  return gulp.src(files)
    .pipe(concat(config.build.files.full, {newLine: '\n\n\n'}))
    .pipe(gulp.dest('build/lib/'))
    .pipe(connect.reload())
})