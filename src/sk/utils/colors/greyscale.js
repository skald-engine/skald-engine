const assertColor = require('sk/utils/colors/_common').assertColor
const colorToHsl = require('sk/utils/colors/colorToHsl')
const hslToColor = require('sk/utils/colors/hslToColor')

/**
 * Covert a color to greyscale. 
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function greyscale(color) {
  assertColor(color, `greyscale`)
  
  let hsl = colorToHsl(color)
  return hslToColor(hsl.hue, 0, hsl.lightness)
}


module.exports = greyscale