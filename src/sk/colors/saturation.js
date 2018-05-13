const colorToHsl = require('sk/colors/colorToHsl')

/**
 * Returns the saturation channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function saturation(color) {
  return colorToHsl(color).saturation
}


module.exports = saturation