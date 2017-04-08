var gulp = require('gulp')
var config = require('../gulpconfig.js')
var esdoc = require('gulp-esdoc')

gulp.task('_api', function() {
  return gulp.src('source/')
    .pipe(esdoc({
      lint: false,
      destination: 'build/docs/api',
      plugins: [
        {name:'./custom/esdoc-plugins/properMembers.js'},
        {name:'./custom/esdoc-plugins/forceTags.js'},
      ]
    }))
});