// The code of this module is based on several sources:
// 
// - http://lesscss.org/functions/#color-definition
// - http://lesscss.org/functions/#color-channel
// - http://lesscss.org/functions/#color-operations
// - http://lesscss.org/functions/#color-blending
// - https://github.com/bgrins/TinyColor/
// - https://stackoverflow.com/questions/8468855/convert-a-rgb-colour-value-to-decimal
module.exports = {
  hexToColor : require('sk/utils/colors/hexToColor'),
  rgbToColor : require('sk/utils/colors/rgbToColor'),
  hslToColor : require('sk/utils/colors/hslToColor'),
  colorToHex : require('sk/utils/colors/colorToHex'),
  colorToRgb : require('sk/utils/colors/colorToRgb'),
  colorToHsl : require('sk/utils/colors/colorToHsl'),
  red        : require('sk/utils/colors/red'),
  green      : require('sk/utils/colors/green'),
  blue       : require('sk/utils/colors/blue'),
  hue        : require('sk/utils/colors/hue'),
  saturation : require('sk/utils/colors/saturation'),
  lightness  : require('sk/utils/colors/lightness'),
  saturate   : require('sk/utils/colors/saturate'),
  desaturate : require('sk/utils/colors/desaturate'),
  greyscale  : require('sk/utils/colors/greyscale'),
  lighten    : require('sk/utils/colors/lighten'),
  darken     : require('sk/utils/colors/darken'),
  spin       : require('sk/utils/colors/spin'),
  blend      : require('sk/utils/colors/blend'),
  tint       : require('sk/utils/colors/tint'),
  shade      : require('sk/utils/colors/shade'),

  // alias
  grayscale: require('sk/utils/colors/greyscale'),
}
