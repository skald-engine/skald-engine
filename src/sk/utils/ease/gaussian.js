/**
 * Generic gaussian function without the normalization factor (thus, its limit
 * goes from 0 to 1 in the Y axis).
 *
 * @param {Number} x
 * @param {Number} [m=.5] - The gaussian mean.
 * @param {Number} [v=.1] - The gaussian variance.
 * @return {Number} The converted value.
 */
function gaussian(x, m=.5, v=.02) {
  let d = x-m
  return Math.pow(Math.E, -((d*d)/(2*v)))
}


module.exports = {
  gaussian
}