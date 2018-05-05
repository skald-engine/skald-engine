const assertColor = require('sk/utils/colors/_common').assertColor

/**
 * Returns the hex value from an int color. The return value is in the format
 * '#FFFFFF'.
 *
 * @param {Number} color - The color value.
 * @return {String}
 */
function colorToHex(color) {
  assertColor(color, `colorToHex`)

  let c = (color.toString(16) + '000000').slice(0, 6)
  return '#'+c.toUpperCase()
}


module.exports = colorToHex