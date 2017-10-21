// The code of this module is based on several sources:
// 
// - http://lesscss.org/functions/#color-definition
// - http://lesscss.org/functions/#color-channel
// - http://lesscss.org/functions/#color-operations
// - http://lesscss.org/functions/#color-blending
// - https://github.com/bgrins/TinyColor/
// - https://stackoverflow.com/questions/8468855/convert-a-rgb-colour-value-to-decimal

const hexToColor = require('sk/utils/colors/hexToColor')
const rgbToColor = require('sk/utils/colors/rgbToColor')
const hslToColor = require('sk/utils/colors/hslToColor')
const colorToHex = require('sk/utils/colors/colorToHex')
const colorToRgb = require('sk/utils/colors/colorToRgb')
const colorToHsl = require('sk/utils/colors/colorToHsl')
const red = require('sk/utils/colors/red')
const green = require('sk/utils/colors/green')
const blue = require('sk/utils/colors/blue')
const hue = require('sk/utils/colors/hue')
const saturation = require('sk/utils/colors/saturation')
const lightness = require('sk/utils/colors/lightness')
const saturate = require('sk/utils/colors/saturate')
const desaturate = require('sk/utils/colors/desaturate')
const greyscale = require('sk/utils/colors/greyscale')
const lighten = require('sk/utils/colors/lighten')
const darken = require('sk/utils/colors/darken')
const spin = require('sk/utils/colors/spin')
const blend = require('sk/utils/colors/blend')
const tint = require('sk/utils/colors/tint')
const shade = require('sk/utils/colors/shade')

module.exports = {
  hexToColor,
  rgbToColor,
  hslToColor,
  colorToHex,
  colorToRgb,
  colorToHsl,
  red,
  green,
  blue,
  hue,
  saturation,
  lightness,
  saturate,
  desaturate,
  greyscale,
  lighten,
  darken,
  spin,
  blend,
  tint,
  shade,
  
  // alias
  grayscale: greyscale,
}