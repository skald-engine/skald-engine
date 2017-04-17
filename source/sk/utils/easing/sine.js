const PI = Math.PI
const HALF_PI = Math.PI/2

/**
 * Sine in easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function sineIn(x) {
  return 1-Math.cos(x*HALF_PI)
}

/**
 * Sine out easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function sineOut(x) {
  return Math.sin(x*HALF_PI)
}

/**
 * Sine inOut easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function sineInOut(x) {
  return (1 - Math.cos(PI*x))/2
}