const back         = require('sk/utils/ease/back.js')
const bell         = require('sk/utils/ease/bell.js')
const bounce       = require('sk/utils/ease/bounce.js')
const circ         = require('sk/utils/ease/circ.js')
const elastic      = require('sk/utils/ease/elastic.js')
const exponentials = require('sk/utils/ease/exponentials.js')
const gaussian     = require('sk/utils/ease/gaussian.js')
const linear       = require('sk/utils/ease/linear.js')
const sine         = require('sk/utils/ease/sine.js')

module.exports = Object.assign(
  {},
  back,
  bell,
  bounce,
  circ,
  elastic,
  exponentials,
  gaussian,
  linear,
  sine
)