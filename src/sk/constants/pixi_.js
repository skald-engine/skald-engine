import {enumeration} from 'sk/utils'

/**
 * Blend modes.
 */
export const BLEND_MODE = enumeration({
  NORMAL      : 0,
  ADD         : 1,
  MULTIPLY    : 2,
  SCREEN      : 3,
  OVERLAY     : 4,
  DARKEN      : 5,
  LIGHTEN     : 6,
  COLOR_DODGE : 7,
  COLOR_BURN  : 8,
  HARD_LIGHT  : 9,
  SOFT_LIGHT  : 10,
  DIFFERENCE  : 11,
  EXCLUSION   : 12,
  HUE         : 13,
  SATURATION  : 14,
  COLOR       : 15,
  LUMINOSITY  : 16,
  NORMAL_NPM  : 17,
  ADD_NPM     : 18,
  SCREEN_NPM  : 19,
})

/**
 * Draw modes.
 */
export const DRAW_MODE = enumeration({
  POINTS         : 0,
  LINES          : 1,
  LINE_LOOP      : 2,
  LINE_STRIP     : 3,
  TRIANGLES      : 4,
  TRIANGLE_STRIP : 5,
  TRIANGLE_FAN   : 6,
})

/**
 * Scale modes.
 */
export const PIXI_SCALE_MODE = enumeration({
  LINEAR  : 0,
  NEAREST : 1,
})

/**
 * Wrap modes.
 */
export const WRAP_MODE = enumeration({
  CLAMP           : 0,
  REPEAT          : 1,
  MIRRORED_REPEAT : 2,
})

/**
 * Text gradient modes.
 */
export const TEXT_GRADIENT = enumeration({
  LINEAR_VERTICAL   : 0,
  LINEAR_HORIZONTAL : 1,
})