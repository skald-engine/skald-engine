const assertColor = require('sk/utils/colors/_common').assertColor

/**
 * Returns the RGB value from an int color. The return value is in the format
 * `{red:255, green:255, blue:255}.
 *
 * @param {Number} color - The color value.
 * @return {Object}
 */
function colorToRgb(color) {
  assertColor(color, `colorToRgb`)

  return {
    red   : (color & 0xff0000) >> 16, 
    green : (color & 0x00ff00) >> 8, 
    blue  : (color & 0x0000ff)
  }
}


module.exports = colorToRgb