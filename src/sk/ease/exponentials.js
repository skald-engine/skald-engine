/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
function getPowIn(pow) { return x => Math.pow(x, pow) }

/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
function getPowOut(pow) { return x => 1-Math.pow(1-x, pow) }

/**
 * Creates an exponential easing function with `pow` factor.
 *
 * @param {Number} pow - The exponent to use (e.g., 3 will return a cubic 
 *        easing).
 * @return {Function} The easing functions.
 */
function getPowInOut(pow) {
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
const quadIn = getPowIn(2)

/**
 * Quadratic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quadOut = getPowOut(2)

/**
 * Quadratic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quadInOut = getPowInOut(2)


/**
 * Cubic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const cubicIn = getPowIn(3)

/**
 * Cubic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const cubicOut = getPowOut(3)

/**
 * Cubic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const cubicInOut = getPowInOut(3)


/**
 * Quartic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quartIn = getPowIn(4)

/**
 * Quartic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quartOut = getPowOut(4)

/**
 * Quartic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quartInOut = getPowInOut(4)

/**
 * Quintic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quintIn = getPowIn(5)

/**
 * Quintic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quintOut = getPowOut(5)

/**
 * Quintic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const quintInOut = getPowInOut(5)

/**
 * Sextic in easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const expoIn = getPowIn(6)

/**
 * Sextic out easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const expoOut = getPowOut(6)

/**
 * Sextic inOut easing.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const expoInOut = getPowInOut(6)


module.exports = {
  getPowIn,
  getPowOut,
  getPowInOut,
  quadIn,
  quadOut,
  quadInOut,
  cubicIn,
  cubicOut,
  cubicInOut,
  quartIn,
  quartOut,
  quartInOut,
  quintIn,
  quintOut,
  quintInOut,
  expoIn,
  expoOut,
  expoInOut
}