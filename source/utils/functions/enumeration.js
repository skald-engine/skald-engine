/**
 * Creates an enumeration.
 */
export default function enumeration(map) {
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

  return Object.freeze(enumeration)
}