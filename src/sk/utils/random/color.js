const choose = require('sk/utils/random/choose')

function color(array) {
  const COLORS = require('sk/constants/colors').COLORS
  return choose(COLORS.values())
}

module.exports = color