const assertColor = require('sk/utils/colors/_common').assertColor
const assertFloat = require('sk/utils/colors/_common').assertFloat
const colorToRgb = require('sk/utils/colors/colorToRgb')
const rgbToColor = require('sk/utils/colors/rgbToColor')

/**
 * Blends two colors by a given amount.
 *
 * @param {Number} color1 - The first int color.
 * @param {Number} color2 - The second int color.
 * @param {Number} amount - Weight of the blend.
 */
function blend(color1, color2, amount) {
  assertColor(color1, `blend`)
  assertColor(color2, `blend`)
  assertFloat(amount, `amount`, `blend`)

  let c1 = colorToRgb(color1)
  let c2 = colorToRgb(color2)

  return rgbToColor(
    Math.round(c1.red + ((c2.red-c1.red) * amount)),
    Math.round(c1.green + ((c2.green-c1.green) * amount)),
    Math.round(c1.blue + ((c2.blue-c1.blue) * amount))
  )
}


module.exports = blend