const choose = require('sk/utils/random/choose')

function color(array) {
  const COLOR = require('sk/constants/colors').COLOR
  return choose(COLOR.values())
}

module.exports = color