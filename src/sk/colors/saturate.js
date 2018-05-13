const assertColor = require('sk/colors/_common').assertColor
const assertFloat = require('sk/colors/_common').assertFloat
const colorToHsl = require('sk/colors/colorToHsl')
const hslToColor = require('sk/colors/hslToColor')

/**
 * Saturates a color by a given amount (in percentage as 0 to 1).
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of saturation.
 * @return {Number}
 */
function saturate(color, amount) {
  assertColor(color, `saturate`)
  assertFloat(amount, `amount`, `saturate`)
  
  let hsl = colorToHsl(color)
  hsl.saturation = Math.max(Math.min(hsl.saturation+amount, 1), 0)
  return hslToColor(hsl.hue, hsl.saturation, hsl.lightness)
}


module.exports = saturate