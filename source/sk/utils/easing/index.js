const back = require('sk/utils/easing/back.js')
const bell = require('sk/utils/easing/bell.js')
const bounce = require('sk/utils/easing/bounce.js')
const circ = require('sk/utils/easing/circ.js')
const elastic = require('sk/utils/easing/elastic.js')
const exponentials = require('sk/utils/easing/exponentials.js')
const gaussian = require('sk/utils/easing/gaussian.js')
const linear = require('sk/utils/easing/linear.js')
const sine = require('sk/utils/easing/sine.js')
const modifiers = require('sk/utils/easing/modifiers.js')

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
  sine,
  modifiers
)