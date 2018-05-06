import {enumeration} from 'sk/utils'

/**
 * Enumeration of Pixi renderers types:
 *
 * - AUTO
 * - WEBGL
 * - CANVAS
 */
export const RENDERERS = enumeration({
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
export const ORIENTATIONS = enumeration({
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
export const SCALE_MODES = enumeration({
  STRETCH : 'stretch',
  FIT     : 'fit',
  FILL    : 'fill',
  NOSCALE : 'noscale',
})