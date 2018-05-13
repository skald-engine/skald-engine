const assertColor = require('sk/colors/_common').assertColor
const assertFloat = require('sk/colors/_common').assertFloat
const colorToHsl = require('sk/colors/colorToHsl')
const hslToColor = require('sk/colors/hslToColor')

/**
 * Spin the hue color by a given amount, changing from -360 to 360
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of spin.
 * @return {Number}
 */
function spin(color, amount) {
  assertColor(color, `spin`)
  assertFloat(amount, `amount`, `spin`, -360, 360)
  
  let hsl = colorToHsl(color)
  let hue = (hsl.hue + amount)%360
  hue = hue < 0 ? 360+hue : hue

  return hslToColor(hue, hsl.saturation, hsl.lightness)
}


module.exports = spin