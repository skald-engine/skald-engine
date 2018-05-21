const back         = require('sk/ease/back.js')
const bounce       = require('sk/ease/bounce.js')
const circ         = require('sk/ease/circ.js')
const elastic      = require('sk/ease/elastic.js')
const exponentials = require('sk/ease/exponentials.js')
const slow         = require('sk/ease/slow.js')
const linear       = require('sk/ease/linear.js')
const sine         = require('sk/ease/sine.js')

module.exports = Object.assign(
  {},
  back,
  bounce,
  circ,
  elastic,
  exponentials,
  slow,
  linear,
  sine
)