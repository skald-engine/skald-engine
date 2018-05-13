const assertColor = require('sk/colors/_common').assertColor

/**
 * Returns the blue channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function blue(color) {
  assertColor(color, `blue`)

  return (color & 0x0000ff)
}


module.exports = blue