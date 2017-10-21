const colorToHsl = require('sk/utils/colors/colorToHsl')

/**
 * Returns the lightness channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function lightness(color) {
  return colorToHsl(color).lightness
}


module.exports = lightness