const assertColor = require('sk/colors/_common').assertColor

/**
 * Returns the green channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
function green(color) {
  assertColor(color, `green`)

  return (color & 0x00ff00) >> 8
}


module.exports = green