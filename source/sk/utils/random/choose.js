/**
 * Chooses a value from the provided array or string.
 *
 * @param {Array} array - An array.
 * @return {Object}
 */
export default function choose(array) {
  if (!Array.isArray(array) && typeof array !== 'string')
    throw new Error(`The choose function only accepts arrays or strings, you `+
                    `provided "${array}" instead.`)

  return array[Math.floor(Math.random()*array.length)]
}
