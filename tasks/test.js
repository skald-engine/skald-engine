const gulp = require('gulp')
const mocha = require('gulp-mocha')
const argv = require('yargs').argv

gulp.task('_test', () => {
  let file = argv.files || argv.file || '*'
  let dir = argv.dir? `**/${argv.dir}/**` : `**`

  let src = `source/${dir}/${file}.test.js`
  console.log('> Looking for tests: ', src)

  return gulp.src(src, {read: false})
    .pipe(mocha({
      ui        : 'bdd',
      reporter  : argv.style||'dot',
      require   : ['./tests/unit/common.js'],
      compilers : 'js:babel-core/register'
    }))
    .once('error', () => {
      process.exit(1);
    })
  }
);