const gulp = require('gulp');
const mocha = require('gulp-mocha');

gulp.task('_test', () =>
  gulp.src('tests/**/*.test.js', {read: false})
    .pipe(mocha({
      ui        : 'bdd',
      reporter  : 'spec',
      require   : ['./tests/unit/common.js'],
      compilers : 'js:babel-core/register'
    }))
);