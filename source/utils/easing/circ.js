const sqrt = Math.sqrt

/**
 * Circ in easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function circIn(x) {
  return -(sqrt(1-x*x) - 1)
}

/**
 * Circ out easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function circOut(x) {
  return sqrt(1 - (--x)*x)
}

/**
 * Circ inOut easing.
 *
 * @param {Number} x
 * @return {Number} The converted value.
 */
export function circInOut(x) {
  if ((x*=2) < 1) return -0.5*(sqrt(1-x*x)-1);
  return 0.5*(sqrt(1-(x-=2)*x)+1);
}