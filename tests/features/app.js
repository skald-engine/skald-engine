const express = require('express')
const nunjucks = require('nunjucks')

let app = express()

// CONFIGURATION --------------------------------------------------------------
nunjucks.configure(__dirname+'/source', {
  autoescape: true,
  express: app
})
app.set('view engine', 'nunjucks')

app.use('/static', express.static(__dirname+'/assets/'))
app.use('/static', express.static(__dirname+'/../../build/dist/'))

// ROUTES ---------------------------------------------------------------------
app.get('/', (req, res) => {
  res.render('index.html', {
    testing: 'yeah'
  })
})

app.get('/test/:name')


// INITIALIZATION -------------------------------------------------------------
app.listen(7878, () => {
  console.log('Listerning on 7878')
})
