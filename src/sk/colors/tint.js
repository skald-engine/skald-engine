const assertColor = require('sk/colors/_common').assertColor
const assertFloat = require('sk/colors/_common').assertFloat
const colorToRgb = require('sk/colors/colorToRgb')
const rgbToColor = require('sk/colors/rgbToColor')

/**
 * Shortcut for `blend(0xFFFFFF, color2, amount)`.
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - Weight of the blend.
 */
function tint(color, amount) {
  assertColor(color, `tint`)
  assertFloat(amount, `amount`, `tint`)

  let c2 = colorToRgb(color)

  return rgbToColor(
    Math.round(255 + ((c2.red-255) * amount)),
    Math.round(255 + ((c2.green-255) * amount)),
    Math.round(255 + ((c2.blue-255) * amount))
  )
}


module.exports = tint