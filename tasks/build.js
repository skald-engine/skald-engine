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
var addsrc     = require('gulp-add-src')

gulp.task('_build', function() {
  // Merge all files from the `source/index.js`, imports will be relative to source/
  return browserify({
      debug   : true,
      entries : 'source/index.js',
      paths   : ['./source/']
    })

    // Tranform ES6 to ES5
    .transform(babelify.configure({
      presets            : ['es2015'],
      sourceMapsAbsolute : true,
      sourceMaps         : true
    }))
    .bundle()

    // Create temp file in memory
    .pipe(source(config.build.file+'_temp'))
    .pipe(buffer())

    // Open source map
    .pipe(sourcemaps.init({loadMaps: true}))

      // Uglify the file
      .pipe(uglify({preserveComments:'license'})
        .on('error', e => {
        console.error(`Error: ${e.message}\nLine: ${e.lineNumber}`)
      }))

    // Close and save source map
    .pipe(sourcemaps.write('.', {
      sourceRoot: 'source/',
    }))

    // Concat with dependencies
    .pipe(addsrc.prepend(config.build.dependencies))
    .pipe(concat(config.build.file, {newLine: '\n\n\n'}))

    // Replace variables
    .pipe(replace('%VERSION%', config.build.version))
    .pipe(replace('%DATE%', config.build.date))
    .pipe(replace('%REVISION%', config.build.revision))

    // Save the file
    .pipe(gulp.dest('build/lib/'))
})