/**
 * Creates an enumeration. It receives a map `<key, value>` and returns a 
 * freezed object with the final enumeration. 
 *
 * Usage example:
 *
 *     const BROKEN_COMPASS = skald.utils.enumeration({
 *       NORTH: 'north',
 *       SOUTH: 'south'
 *     })
 *     console.log(BROKEN_COMPASS.NORTH) // prints 'north'
 *
 * You may inverse lookup a key on the enumeration:
 *
 *     console.log(BROKEN_COMPASS('north')) // prints 'NORTH'
 *
 * 
 * @param {Object} map - The dict containing the `<key, value>` pairs of the 
 *        enumeration.
 * @return {Object} a freezed object with the enumeration.
 */
function enumeration(map) {
  // list of keys
  let keys = Object.keys(map)

  // create the inverse mapping (ie. value=>map)
  let inverseMap = keys
    .reduce(
      (obj, key) => (obj[map[key]]=key, obj),
      {}
    )

  // create the resulting function object
  let enumeration = keys
    .reduce(
      (obj, key) => (obj[key]=map[key], obj),
      (value => inverseMap[value]) // initial value for the enumeration
    )

  // utility methods
  enumeration.toString = enumeration.valueOf = () => `[${keys.join(', ')}]`
  enumeration.values = () => keys.map(key=>map[key])
  enumeration.keys = () => keys.map(x=>x)

  return Object.freeze(enumeration)
}


module.exports = enumeration