/**
 * Recursively merge two object, returning a new one.
 *
 * Example:
 *
 *     let a = {foo:true, bar:false}
 *     let b = {bar:true, qux:false}
 *     let result = skald.utils.deepMerge(a, b)
 *     // returns {foo:true, bar:true, qux:false}
 *
 * @param {Object} target - The base object containing the "default" values.
 * @param {Object} source - The object that will replace the "default" values.
 * @return {Object} The merged object.
 */
function deepMerge(target, source) {
  let array = Array.isArray(source)
  let dst = array && [] || {}

  if (array) {
    target = target || []
    dst = dst.concat(target)
    source.forEach(function(e, i) {
      if (typeof dst[i] === 'undefined') {
        dst[i] = e
      } else if (typeof e === 'object') {
        dst[i] = deepMerge(target[i], e)
      } else {
        if (target.indexOf(e) === -1) {
          dst.push(e)
        }
      }
    });
  } else {
    if (target && typeof target === 'object') {
      Object.keys(target).forEach(function(key) {
        dst[key] = target[key]
      });
    }
    Object.keys(source).forEach(function(key) {
      if (typeof source[key] !== 'object' || !source[key]) {
        dst[key] = source[key]
      } else {
        if (!target[key]) {
          dst[key] = source[key]
        } else {
          dst[key] = deepMerge(target[key], source[key])
        }
      }
    });
  }

  return dst
}


module.exports = deepMerge