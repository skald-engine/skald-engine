const assertColor = require('sk/utils/colors/_common').assertColor

/**
 * Returns the HSL value from an int color. The return value is in the format
 * `{red:255, green:255, blue:255}.
 *
 * @param {Number} color - The color value.
 * @return {Object}
 */
function colorToHsl(color) {
  assertColor(color, `colorToHsl`)

  let red = ((color&0xff0000) >> 16)/255
  let green = ((color&0x00ff00) >> 8)/255
  let blue = (color&0x0000ff)/255

  let max = Math.max(red, green, blue)
  let min = Math.min(red, green, blue)
  let hue, saturation, lightness = (max+min)/2

  if (max === min) {
    hue = saturation = 0
  
  } else {
    let d = max - min
    saturation = lightness > 0.5?
                   d/(2 - max - min) :
                   d/(max + min)

    if (max === red) hue = (green - blue)/d + (green<blue?6:0)
    else if (max === green) hue = (blue - red)/d + 2
    else if (max === blue) hue = (red - green)/d + 4

    hue /= 6
    hue = Math.round(hue*360)%360
  }

  return {
    hue,
    saturation,
    lightness
  }
}


module.exports = colorToHsl