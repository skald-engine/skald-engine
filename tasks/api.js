var gulp = require('gulp')
var config = require('../gulpconfig.js')
var esdoc = require('gulp-esdoc')

gulp.task('_api', () => {
  return gulp.src('source/')
    .pipe(esdoc({
      lint: false,
      destination: 'build/docs/api',
      plugins: [
        {name:'./tasks/custom/properMembers.js'},
        {name:'./tasks/custom/forceTags.js'},
      ]
    }))
});