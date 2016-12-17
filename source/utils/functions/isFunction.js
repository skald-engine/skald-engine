/**
 * Verify if the parameter is a function.
 *
 * Example:
 *
 *     skald.utils.isFunction(() => {}) // true
 *     skald.utils.isFunction({}) // false
 *     skald.utils.isFunction(4) // false
 *
 *
 * @param {Object} target - A value to be verified.
 * @return {Boolean} Wheter the target is a function or not.
 */
export default function isFunction(target) {
 return target && {}.toString.call(target) === '[object Function]'
}
