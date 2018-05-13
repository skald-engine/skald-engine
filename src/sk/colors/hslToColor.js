const assertFloat = require('sk/colors/_common').assertFloat
const hue2rgb = require('sk/colors/_common').hue2rgb

/**
 * Converts an HSL color to an int color. The hue value must be between 0 and
 * 360, incluse, and saturation and lightness must be a percentange described
 * as a float between 0 and 1 (i.e, 0.5=50% and 1=100%). Any value out of 
 * these ranges will throw a type error.
 * 
 * @param {Number} hue - The hue value.
 * @param {Number} saturation - The saturation value.
 * @param {Number} lightness - The lightness value.
 * @return {Number} The color as integer.
 */
function hslToColor(hue, saturation, lightness) {
  assertFloat(hue, 'hue', 'hslToColor', 0, 360)
  assertFloat(saturation, 'saturation', 'hslToColor')
  assertFloat(lightness, 'lightness', 'hslToColor')

  hue = hue/360

  let red, green, blue

  if (saturation === 0) {
      red = green = blue = parseInt(lightness*255)
  
  } else {
    let q = lightness < 0.5 ?
              lightness*(1 + saturation) :
              lightness + saturation - lightness*saturation;
    let p = 2*lightness - q
    red = hue2rgb(p, q, hue + 1/3)
    green = hue2rgb(p, q, hue)
    blue = hue2rgb(p, q, hue - 1/3)
  }

  return (red<<16) + (green<<8) + (blue)
}


module.exports = hslToColor