import {enumeration} from 'utils'

/** Skald engine version (we use semantic versioning). */
export const VERSION = '%VERSION%'

/** Build date of the library. */
export const DATE = '%DATE%'

/** Revision of the build (we use the current commit of git). */
export const REVISION = '%REVISION%'

/**
 * Position enum, it holds the following values:
 *
 * - TOP_LEFT
 * - TOP_RIGHT
 * - BOTTOM_LEFT
 * - BOTTOM_RIGHT
 * - TOP
 * - BOTTOM
 * - LEFT
 * - RIGHT
 * - CENTER
 */
export const POSITION = enumeration({
  TOP_LEFT     : 'top_left',
  TOP_RIGHT    : 'top_right',
  BOTTOM_LEFT  : 'bottom_left',
  BOTTOM_RIGHT : 'bottom_right',
  TOP          : 'top',
  BOTTOM       : 'bottom',
  LEFT         : 'left',
  RIGHT        : 'right',
  CENTER       : 'center',
})

/**
 * Direction enum, it holds the following values:
 *
 * - TOP_LEFT
 * - TOP_RIGHT
 * - BOTTOM_LEFT
 * - BOTTOM_RIGHT
 * - TOP
 * - BOTTOM
 * - LEFT
 * - RIGHT
 */
export const DIRECTION = enumeration({
  TOP_LEFT     : 'top_left',
  TOP_RIGHT    : 'top_right',
  BOTTOM_LEFT  : 'bottom_left',
  BOTTOM_RIGHT : 'bottom_right',
  TOP          : 'top',
  BOTTOM       : 'bottom',
  LEFT         : 'left',
  RIGHT        : 'right',
})

/**
 * Enumeration of Pixi renderers types:
 *
 * - AUTO
 * - WEBGL
 * - CANVAS
 */
export const RENDERER = enumeration({
  AUTO   : 'auto',
  WEBGL  : 'webgl',
  CANVAS : 'canvas',
})

/**
 * Screen orientation enumeration:
 *
 * - PORTRAIT
 * - LANDSCAPE
 */
export const ORIENTATION = enumeration({
  PORTRAIT  : 'portrait',
  LANDSCAPE : 'landscape',
})

/**
 * Enumeration for automatic resizing:
 *
 * - STRETCH - rescale width and height to full possible size, without keeping
 *   the aspect ratio.
 * - FIT - rescale the canvas to the maximum width OR height, keeping the 
 *   aspect ratio and without cutting any part of the canvas.
 * - FILL - rescale the canvas to fill the whole screen but keeping the aspect
 *   ratio, thus, part of the game will be cut off the screen.
 * - NOSCALE - no automatic scale.
 */
export const SCALE_MODE = enumeration({
  STRETCH : 'stretch',
  FIT     : 'fit',
  FILL    : 'fill',
  NOSCALE : 'noscale',
})

/**
 * Enumeration of mathematical constants:
 * 
 * - PI
 * - PI_2 - pi*2
 * - HALF_PI - pi/2
 * - INV_PI - 1/pi
 * - E
 * - INV_E - 1/e
 */
export const MATH = enumeration({
  PI      : 3.14159265359,
  PI2     : 6.28318530718,
  HALF_PI : 1.57079632679,
  INV_PI  : 0.31830988618,
  E       : 2.71828182846,
  INV_E   : 0.36787944117,
})

/**
 * Logger levels enum:
 *
 * - TRACE - for very detailed (and possibly with performance impact) debug 
 *   information.
 * - DEBUG - for debug information.
 * - INFO - to register that everything is running as expected.
 * - WARN - potentially harmful situation, without stopping the execution.
 * - ERROR - an error has occurred but it wont need to stop the execution.
 * - FATAL - should be used to log errors that will abort the execution of the
 *   game.
 */
export const LOGGER_LEVEL = enumeration({
  TRACE  : 'trace',
  DEBUG  : 'debug',
  INFO   : 'info',
  WARN   : 'warn',
  ERROR  : 'error',
  FATAL  : 'fatal',
})