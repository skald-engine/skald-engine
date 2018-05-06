const express = require('express')
const nunjucks = require('nunjucks')
const walkSync = require('./helpers/walkSync')

// INITIALIZATION -------------------------------------------------------------
let app = express()

// CONFIGURATION --------------------------------------------------------------
let jucks = nunjucks.configure(__dirname, {
  autoescape : true,
  express    : app
})
app.set('view engine', 'nunjucks')

app.use('/static', express.static(__dirname+'/assets/'))
app.use('/static', express.static(__dirname+'/../build/dist/'))

// GLOBALS --------------------------------------------------------------------
const all_tests = walkSync(__dirname+'/source/tests/')
                      .map(x => x.substring(0, x.length-5))
console.log('all_tests', __dirname+'/source/tests/', all_tests)

// ROUTES ---------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('source/index.html', {all_tests})
})

app.get('/test/:name', (req, res) => {
  let current_test = req.params.name.replace(/--/g, '/')
  res.render(`source/tests/${current_test}.html`, {current_test, all_tests})
})


// INITIALIZATION -------------------------------------------------------------
app.listen(7878, () => {
  console.log('Listening on 7878')
})


