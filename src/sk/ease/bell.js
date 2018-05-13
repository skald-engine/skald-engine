/**
 * Creates a generalized bell-shaped function.
 *
 * The function uses the following formula:
 *
 *      f(x) = 1/(1 + (abs((x-c)/a))^(2*b))
 * 
 * @param {Number} [a=.5]
 * @param {Number} [b=1]
 * @param {Number} [c=.5]
 * @return {Function} The easing functions.
 */
function getBell(a=.5, b=1, c=.5) {
  return x => 1/(1 + Math.pow(Math.abs((x-c)/a), (2*b)))
}


/**
 * Gaussian-like bell function.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const bellGaussian = getBell(.2, 1.5, .5)

/**
 * Thin bell function.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const bellThin = getBell(.05, 1, .5)

/**
 * Fat bell function.
 *
 * @function
 * @param {Number} x
 * @return {Number} The converted value.
 */
const bellFat = getBell(.3, 3, .5)

module.exports = {
  getBell,
  bellGaussian,
  bellThin,
  bellFat
}