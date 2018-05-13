const assertColor = require('sk/colors/_common').assertColor

/**
 * Returns the hex value from an int color. The return value is in the format
 * '#FFFFFF'.
 *
 * @param {Number} color - The color value.
 * @return {String}
 */
function colorToHex(color) {
  assertColor(color, `colorToHex`)

  let c = '000000' + color.toString(16)
  c = c.substring(c.length - 6, c.length)
  return '#'+c.toUpperCase()
}


module.exports = colorToHex