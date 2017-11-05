const express = require('express')
const nunjucks = require('nunjucks')

const walkSync = require('./helpers/walkSync')

let app = express()

// CONFIGURATION --------------------------------------------------------------
nunjucks.configure(__dirname, {
  autoescape: true,
  express: app
})
app.set('view engine', 'nunjucks')

app.use('/static', express.static(__dirname+'/assets/'))
app.use('/static', express.static(__dirname+'/../../build/dist/'))


// GLOBALS --------------------------------------------------------------------
const all_tests = walkSync(__dirname+'/source/')
                    .map(x => x.substring(0, x.length-5))
                    .splice(1)


// ROUTES ---------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('source/index.html', {all_tests})
})

app.get('/test/:name', (req, res) => {
  let current_test = req.params.name.replace(/--/g, '/')
  res.render(`source/${current_test}.html`, {current_test, all_tests})
})


// INITIALIZATION -------------------------------------------------------------
app.listen(7878, () => {
  console.log('Listening on 7878')
})


