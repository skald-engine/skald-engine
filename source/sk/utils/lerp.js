/**
 * Linear interpolation function.
 *
 * This functions uses the precise method to compute the linear interpolation.
 *
 * Example:
 *
 *     sk.utils.lerp(0, 1, 0.5) // 0.5
 *     sk.utils.lerp(0, 10, 0.7) // 7
 *     sk.utils.lerp(100, 200, 0.1) // 110
 *
 * References:
 *
 * - https://en.wikipedia.org/wiki/Linear_interpolation
 * 
 *
 * @param {Number} a - The lower limit.
 * @param {Number} b - The upper limit.
 * @param {Number} t - The threshould (usually between 0 and 1, inclusive).
 * @return {Number} The result of the linear interpolation.
 */
export default function lerp(a, b, t) {
  return (1-t)*a + t*b
}