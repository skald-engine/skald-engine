const C = require('sk/constants')
const choose = require('sk/random/choose')

function color(array) {
  return choose(C.COLORS.values())
}

module.exports = color