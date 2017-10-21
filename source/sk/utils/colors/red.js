const assertColor = require('sk/utils/colors/_common').assertColor

/**
 * Returns the red channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function red(color) {
  assertColor(color, `red`)

  return (color & 0xff0000) >> 16
}


module.exports = red
