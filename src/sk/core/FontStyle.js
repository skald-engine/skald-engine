const pixi = require('pixi.js')
const C = require('sk/constants')

const DEFAULT = {
  align              : 'left',
  breakWords         : false,
  dropShadow         : false,
  dropShadowAngle    : Math.PI/6,
  dropShadowBlur     : 0,
  dropShadowColor    : '#000000',
  dropShadowDistance : 5,
  fill               : '#FFFFFF',
  fillGradientType   : C.TEXT_GRADIENT.LINEAR_VERTICAL,
  fontFamily         : 'Arial',
  fontSize           : 26,
  fontStyle          : 'normal',
  fontVariant        : 'normal',
  fontWeight         : 'normal',
  letterSpacing      : 0,
  lineHeight         : 0,
  lineJoin           : 'miter',
  miterLimit         : 10,
  padding            : 0,
  stroke             : 'black',
  strokeThickness    : 0,
  textBaseline       : 'alphabetic',
  wordWrap           : false,
  wordWrapWidth      : 100,
}

class FontStyle extends pixi.TextStyle {
  constructor(style) {
    super(Object.assign({}, DEFAULT, style || {}))
  }
}

module.exports = FontStyle