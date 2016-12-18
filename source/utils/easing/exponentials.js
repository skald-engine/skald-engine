/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
export function getPowIn(pow) { return x => Math.pow(x, pow) }

/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
export function getPowOut(pow) { return x => 1-Math.pow(1-x, pow) }

/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
export function getPowInOut(pow) {
  return function(x) {
    if ((x*=2) < 1) return 0.5*Math.pow(x, pow)
    return 1-0.5*Math.abs(Math.pow(2-x, pow))
  }
}


/**
 * Quadratic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quadIn = getPowIn(2)

/**
 * Quadratic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quadOut = getPowOut(2)

/**
 * Quadratic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quadInOut = getPowInOut(2)


/**
 * Cubic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let cubicIn = getPowIn(3)

/**
 * Cubic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let cubicOut = getPowOut(3)

/**
 * Cubic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let cubicInOut = getPowInOut(3)


/**
 * Quartic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quartIn = getPowIn(4)

/**
 * Quartic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quartOut = getPowOut(4)

/**
 * Quartic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quartInOut = getPowInOut(4)

/**
 * Quintic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quintIn = getPowIn(5)

/**
 * Quintic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quintOut = getPowOut(5)

/**
 * Quintic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let quintInOut = getPowInOut(5)

/**
 * Sextic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let expoIn = getPowIn(6)

/**
 * Sextic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let expoOut = getPowOut(6)

/**
 * Sextic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
export let expoInOut = getPowInOut(6)
