// The code of this module is based on several sources:
// 
// - http://lesscss.org/functions/#color-definition
// - http://lesscss.org/functions/#color-channel
// - http://lesscss.org/functions/#color-operations
// - http://lesscss.org/functions/#color-blending
// - https://github.com/bgrins/TinyColor/
// - https://stackoverflow.com/questions/8468855/convert-a-rgb-colour-value-to-decimal
module.exports = {
  hexToColor : require('sk/colors/hexToColor'),
  rgbToColor : require('sk/colors/rgbToColor'),
  hslToColor : require('sk/colors/hslToColor'),
  colorToHex : require('sk/colors/colorToHex'),
  colorToRgb : require('sk/colors/colorToRgb'),
  colorToHsl : require('sk/colors/colorToHsl'),
  red        : require('sk/colors/red'),
  green      : require('sk/colors/green'),
  blue       : require('sk/colors/blue'),
  hue        : require('sk/colors/hue'),
  saturation : require('sk/colors/saturation'),
  lightness  : require('sk/colors/lightness'),
  saturate   : require('sk/colors/saturate'),
  desaturate : require('sk/colors/desaturate'),
  greyscale  : require('sk/colors/greyscale'),
  lighten    : require('sk/colors/lighten'),
  darken     : require('sk/colors/darken'),
  spin       : require('sk/colors/spin'),
  blend      : require('sk/colors/blend'),
  tint       : require('sk/colors/tint'),
  shade      : require('sk/colors/shade'),

  // alias
  grayscale: require('sk/colors/greyscale'),
}
