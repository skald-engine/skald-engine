/**
 * Keeps a value between a `min` and `max`, inclusive.
 *
 * Example:
 *
 *     skald.utils.clip(5, 0, 10) // returns 5
 *     skald.utils.clip(-5, 0, 10) // returns 0
 *     skald.utils.clip(15, 0, 10) // returns 10
 *
 * @param {Number} value - The base number.
 * @param {Number} min - The minimum value.
 * @param {Number} max - The maximum value.
 * @return {Number} A clipped value.
 */
function clip(value, min, max) {
  return Math.max(Math.min(value, max), min)
}

module.exports = clip