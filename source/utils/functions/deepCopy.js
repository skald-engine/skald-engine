/**
 * Recursively copies the provided object. This functions is a shortcut for:
 *
 *     JSON.parse(JSON.stringify(object))
 *
 * @param {Object} object - The source object.
 * @return {Object} The copied object.
 */
export default function deepCopy(object) {
  return JSON.parse(JSON.stringify(object))
}