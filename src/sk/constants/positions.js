import {enumeration} from 'sk/utils'

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
 * Direction is a vector going from center to the point. it holds the following values:
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
