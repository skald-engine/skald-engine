// The code of this module is based on several sources:
// 
// - http://lesscss.org/functions/#color-definition
// - http://lesscss.org/functions/#color-channel
// - http://lesscss.org/functions/#color-operations
// - http://lesscss.org/functions/#color-blending
// - https://github.com/bgrins/TinyColor/
// - https://stackoverflow.com/questions/8468855/convert-a-rgb-colour-value-to-decimal

/**
 * Converts a hex color string to the int color. The hex input must be in the 
 * format `#FFFFFF`, starting with the '#' character and folowing with 6 hex 
 * digits. Any value different from that, the function will throw a type error.
 *
 * @param {String} value - The hex value.
 * @return {Number} The color as integer.
 */
export function hexToColor(value) {
  if (!/#[0-9a-fA-F]{6}/.test(value))
    throw new TypeError(`Invalid hex value "${value}" on 'hexToColor' function.`)
  
  return parseInt(value.substring(1), 16)
}

/**
 * Converts an RGB color to an int color. The inputs must be numbers in the 
 * range of 0 to 255, inclusive. Any value out of this range will throw a
 * type error.
 * 
 * @param {Number} red - The red value.
 * @param {Number} green - The green value.
 * @param {Number} blue - The blue value.
 * @return {Number} The color as integer.
 */
export function rgbToColor(red, green, blue) {
  if (!Number.isInteger(red) || red < 0 || red > 255)
    throw new TypeError(`Invalid red value "${red}" on 'rgbToColor' function.`)

  if (!Number.isInteger(green) || green < 0 || green > 255)
    throw new TypeError(`Invalid green value "${green}" on 'rgbToColor' function.`)

  if (!Number.isInteger(blue) || blue < 0 || blue > 255)
    throw new TypeError(`Invalid blue value "${blue}" on 'rgbToColor' function.`)
  
  return (red<<16) + (green<<8) + (blue)
}

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
export function hslToColor(hue, saturation, lightness) {
  _assertFloat(hue, 'hue', 'hslToColor', 0, 360)
  _assertFloat(saturation, 'saturation', 'hslToColor')
  _assertFloat(lightness, 'lightness', 'hslToColor')

  hue = hue/360

  let red, green, blue

  if (saturation === 0) {
      red = green = blue = parseInt(lightness*255)
  
  } else {
    let q = lightness < 0.5 ?
              lightness*(1 + saturation) :
              lightness + saturation - lightness*saturation;
    let p = 2*lightness - q
    red = _hue2rgb(p, q, hue + 1/3)
    green = _hue2rgb(p, q, hue)
    blue = _hue2rgb(p, q, hue - 1/3)
  }

  return (red<<16) + (green<<8) + (blue)
}

/**
 * Returns the hex value from an int color. The return value is in the format
 * '#FFFFFF'.
 *
 * @param {Number} color - The color value.
 * @return {String}
 */
export function colorToHex(color) {
  _assertColor(color, `colorToHex`)

  let c = (color.toString(16) + '000000').slice(0, 6)
  return '#'+c.toUpperCase()
}

/**
 * Returns the RGB value from an int color. The return value is in the format
 * `{red:255, green:255, blue:255}.
 *
 * @param {Number} color - The color value.
 * @return {Object}
 */
export function colorToRgb(color) {
  _assertColor(color, `colorToRgb`)

  return {
    red   : (color & 0xff0000) >> 16, 
    green : (color & 0x00ff00) >> 8, 
    blue  : (color & 0x0000ff)
  }
}

/**
 * Returns the HSL value from an int color. The return value is in the format
 * `{red:255, green:255, blue:255}.
 *
 * @param {Number} color - The color value.
 * @return {Object}
 */
export function colorToHsl(color) {
  _assertColor(color, `colorToHsl`)

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


/**
 * Returns the red channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function red(color) {
  _assertColor(color, `red`)

  return (color & 0xff0000) >> 16
}

/**
 * Returns the green channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function green(color) {
  _assertColor(color, `green`)

  return (color & 0x00ff00) >> 8
}

/**
 * Returns the blue channel in the range [0, 255].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function blue(color) {
  _assertColor(color, `blue`)

  return (color & 0x0000ff)
}

/**
 * Returns the hue channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function hue(color) {
  return colorToHsl(color).hue
}

/**
 * Returns the saturation channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function saturation(color) {
  return colorToHsl(color).saturation
}

/**
 * Returns the lightness channel in the range [0, 359].
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function lightness(color) {
  return colorToHsl(color).lightness
}


/**
 * Saturates a color by a given amount (in percentage as 0 to 1).
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of saturation.
 * @return {Number}
 */
export function saturate(color, amount) {
  _assertColor(color, `saturate`)
  _assertFloat(amount, `amount`, `saturate`)
  
  let hsl = colorToHsl(color)
  hsl.saturation = Math.max(Math.min(hsl.saturation+amount, 1), 0)
  return hslToColor(hsl.hue, hsl.saturation, hsl.lightness)
}

/**
 * Desaturates a color by a given amount (in percentage as 0 to 1).
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of saturation.
 * @return {Number}
 */
export function desaturate(color, amount) {
  _assertColor(color, `desaturate`)
  _assertFloat(amount, `amount`, `desaturate`)
  
  let hsl = colorToHsl(color)
  hsl.saturation = Math.max(Math.min(hsl.saturation-amount, 1), 0)
  return hslToColor(hsl.hue, hsl.saturation, hsl.lightness)
}

/**
 * Covert a color to greyscale. 
 *
 * @param {Number} color - The int color.
 * @return {Number}
 */
export function greyscale(color,) {
  _assertColor(color, `greyscale`)
  _assertFloat(amount, `amount`, `greyscale`, -1, 1)
  
  let hsl = colorToHsl(color)
  return hslToColor(hsl.hue, 0, hsl.lightness)
}

/**
 * Alias for greyscale.
 */
export let grayscale = greyscale

/**
 * Lighten a color by a given amount (in percentage as 0 to 1).
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of saturation.
 * @return {Number}
 */
export function lighten(color, amount) {
  _assertColor(color, `lighten`)
  _assertFloat(amount, `amount`, `lighten`)
  
  let hsl = colorToHsl(color)
  hsl.lightness = Math.max(Math.min(hsl.lightness+amount, 1), 0)
  return hslToColor(hsl.hue, hsl.saturation, hsl.lightness)
}

/**
 * Darken a color by a given amount (in percentage as 0 to 1).
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of saturation.
 * @return {Number}
 */
export function darken(color, amount) {
  _assertColor(color, `darken`)
  _assertFloat(amount, `amount`, `darken`)
  
  let hsl = colorToHsl(color)
  hsl.lightness = Math.max(Math.min(hsl.lightness-amount, 1), 0)
  return hslToColor(hsl.hue, hsl.saturation, hsl.lightness)
}

/**
 * Spin the hue color by a given amount, changing from -360 to 360
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - The amount of spin.
 * @return {Number}
 */
export function spin(color, amount) {
  _assertColor(color, `spin`)
  _assertFloat(amount, `amount`, `spin`, -360, 360)
  
  let hsl = colorToHsl(color)
  let hue = (hsl.hue + amount)%360
  hue = hue < 0 ? 360+hue : hue

  return hslToColor(hue, hsl.saturation, hsl.lightness)
}

/**
 * Blends two colors by a given amount.
 *
 * @param {Number} color1 - The first int color.
 * @param {Number} color2 - The second int color.
 * @param {Number} amount - Weight of the blend.
 */
export function blend(color1, color2, amount) {
  _assertColor(color1, `blend`)
  _assertColor(color2, `blend`)
  _assertFloat(amount, `amount`, `blend`)

  let c1 = colorToRgb(color1)
  let c2 = colorToRgb(color2)

  return rgbToColor(
    Math.round(c1.red + ((c2.red-c1.red) * amount)),
    Math.round(c1.green + ((c2.green-c1.green) * amount)),
    Math.round(c1.blue + ((c2.blue-c1.blue) * amount))
  )
}

/**
 * Shortcut for `blend(0xFFFFFF, color2, amount)`.
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - Weight of the blend.
 */
export function tint(color, amount) {
  _assertColor(color, `tint`)
  _assertFloat(amount, `amount`, `tint`)

  let c2 = colorToRgb(color)

  return rgbToColor(
    Math.round(255 + ((c2.red-255) * amount)),
    Math.round(255 + ((c2.green-255) * amount)),
    Math.round(255 + ((c2.blue-255) * amount))
  )
}

/**
 * Shortcut for `blend(0x000000, color2, amount)`.
 *
 * @param {Number} color - The int color.
 * @param {Number} amount - Weight of the blend.
 */
export function shade(color, amount) {
  _assertColor(color, `shade`)
  _assertFloat(amount, `amount`, `shade`)

  let c2 = colorToRgb(color)

  return rgbToColor(
    Math.round(c2.red*amount),
    Math.round(c2.green*amount),
    Math.round(c2.blue*amount)
  )
}



// Internal functions ---------------------------------------------------------
function _hue2rgb(p, q, t) {
  let r
  if (t < 0) t += 1
  if (t > 1) t -= 1
  
  if (t < 1/6) r = p + (q - p) * 6 * t
  else if (t < 1/2) r = q
  else if (t < 2/3) r = p + (q - p) * (2/3 - t) * 6
  else r = p
  
  return Math.round(r*255)
}

function _assertColor(color, f) {
  if (!Number.isInteger(color) || color < 0 || color > 16777215)
    throw new TypeError(`Invalid color "${color}" for '${f}' function.`)
}

function _assertFloat(number, p, f, min=0, max=1) {
  if (isNaN(number) || !isFinite(number) || number < min || number > max)
    throw new TypeError(`Invalid ${p} value "${number}" on '${f}' function.`)
}