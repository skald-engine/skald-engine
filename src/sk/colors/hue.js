const colorToHsl = require('sk/colors/colorToHsl')

/**
 * Returns the hue channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function hue(color) {
  return colorToHsl(color).hue
}


module.exports = hue