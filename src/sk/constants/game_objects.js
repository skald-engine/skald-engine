import {enumeration} from 'sk/utils'

/**
 * Enumeration of Pixi renderers types:
 *
 * - AUTO
 * - WEBGL
 * - CANVAS
 */
export const EMITTER_MODE = enumeration({
  EMISSION : 'emission',
  BURST    : 'burst',
  BOTH     : 'both',
})
