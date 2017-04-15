import * as utils from 'utils'
import Scene from 'core/Scene'

/**
 * Dict of all registered scenes.
 */
export let _scenes = {}

/**
 * 
 */
export function scene(spec) {
  // Spec validation
  if (!spec) {
    throw new TypeError(`Empty scene specification. Please provide an object.`)
  }

  if (!spec.name) {
    throw new Error(`You must provide a scene name.`)
  }

  if (_scenes[spec.name]) {
    throw new Error(`A scene "${spec.name}" has been already registered.`)
  }

  _validateFunction(spec, 'initialize')
  _validateFunction(spec, 'enter')
  _validateFunction(spec, 'start')
  _validateFunction(spec, 'pause')
  _validateFunction(spec, 'resume')
  _validateFunction(spec, 'update')
  _validateFunction(spec, 'stop')
  _validateFunction(spec, 'leave')
  _validateFunction(spec, 'destroy')

  // Create the scene sub class
  class Other extends Scene {}
  Other.spec = spec
  Other.prototype.spec = spec
  Other.prototype.name = spec.name
  if (spec.initialize) Other.prototype.initialize = spec.initialize
  if (spec.enter) Other.prototype.enter = spec.enter
  if (spec.start) Other.prototype.start = spec.start
  if (spec.pause) Other.prototype.pause = spec.pause
  if (spec.resume) Other.prototype.resume = spec.resume
  if (spec.update) Other.prototype.update = spec.update
  if (spec.stop) Other.prototype.stop = spec.stop
  if (spec.leave) Other.prototype.leave = spec.leave
  if (spec.destroy) Other.prototype.destroy = spec.destroy

  _scenes[spec.name] = Other
}

/**
 * Validates if spec value is a function
 */
function _validateFunction(spec, name) {
  if (spec[name] && !utils.isFunction(spec[name])) {
    throw new TypeError(`Parameter "${name}" must be a function.`)
  }
}