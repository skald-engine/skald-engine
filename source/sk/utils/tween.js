// export default function tween(spec) {
//   _validate(spec)

//   if (!spec.target) throws(`error`)
//   if (typeof spec.duration !== 'number') throws(`error`)
//   if (typeof spec.delay !== 'undefined' && typeof spec.delay !== 'number') throws(`error`)
//   if (typeof to !== 'object') throws(`error`) 

// }


import Tween from 'sk/utils/tweens/Tween'
import * as utils from 'sk/utils'

/**
 * Creates and return a new tween.
 *
 * @param {Object} spec
 *
 * @param {Object} spec.target - The target objects (which will receive the 
 *        modifications).
 * @param {Number} spec.duration - The duration of the tween, in milliseconds.
 * @param {Number} spec.delay - The delay of the tween. If set, the total 
 *        execution time of the tween will be `delay + duration`.
 * @param {Object} spec.to - The map of properties to be changed, the key
 *        is the name of the property and the value is the target value of 
 *        that property at time `1`.
 * @param {Boolean} spec.loop - If the tween should repeat or not. If true, 
 *        the tween `hasFinished` method will only return true when the tween 
 *        is manually stop. Notice that, the tween will pause for the delay 
 *        time every iteration.
 * @param {Function} spec.ease - The easing function. Defaults to linear.
 */
export default function tween(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  return _create(spec)
}


// Shortcut for throwing an error
function throws(message, error) {
  error = error || Error
  throw new error(message)
}

// Validates the spec
function _validate(spec) {
  // Empty spec
  if (!spec)
    throws(`Empty tween specification. Please provide an object with the tween
            declaration.`)

  // Empty target
  if (!spec.target)
    throws(`Empty tween target. Please provide an object.`)

  // Empty to
  if (!spec.to)
    throws(`Empty tween to specification. Please provide an object with the 
            tween properties.`)

  // Duration is not a number
  if (typeof spec.duration !== 'undefined' && typeof spec.duration !== 'number')
    throws(`Tween duration must be a number.`)

  // Duration is equal (or less than zero)
  if (spec.duration <= 0)
    throws(`Tween duration must be bigger than 0.`)

  // Delay is not a number
  if (typeof spec.delay !== 'undefined' && typeof spec.delay !== 'number')
    throws(`Tween delay must be a number.`)

  // Delay is equal (or less than zero)
  if (spec.delay < 0)
    throws(`Tween delay must be bigger or equal to 0.`)

  // Ease is not a function
  if (spec.ease && !utils.isFunction(spec.ease))
    throws(`Tween ease must be an easing function.`)

  // Validate each property value (must be a number)
  for (let k in spec.to) {
    if (typeof spec.to[k] !== 'number')
      throws(`Value for the target property "${k}" must be a number.`)
  }
}

// Process values
function _create(spec) {
  let properties = {}
  for (let k in spec.to) {
    properties[k] = [spec.target[k], spec.to[k]]
  }

  let tween = new Tween(
    spec.target,
    spec.duration,
    properties,
    spec.delay,
    spec.loop,
    spec.ease
  )

  return tween
}