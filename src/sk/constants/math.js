import {enumeration} from 'sk/utils'

/**
 * Enumeration of mathematical constants:
 * 
 * - PI
 * - PI_2 - pi*2
 * - HALF_PI - pi/2
 * - INV_PI - 1/pi
 * - E
 * - INV_E - 1/e
 * - DEGREES - to convert radians to dregrees
 * - RADIANS - to convert degree to radians
 */
export const MATH = enumeration({
  PI         : 3.14159265359,
  PI2        : 6.28318530718,
  HALF_PI    : 1.57079632679,
  INV_PI     : 0.31830988618,
  E          : 2.71828182846,
  INV_E      : 0.36787944117,
  RAD_TO_DEG : 180/Math.PI,
  DEG_TO_RAD : Math.PI/180,
})
