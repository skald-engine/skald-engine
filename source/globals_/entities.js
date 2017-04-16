import _components from 'globals_/components'
import _displayObjects from 'globals_/displayObjects'
import Entity from 'core/Entity'

/**
 * Dict of all registered entities.
 */
export let _entities = {}

/**
 * Register an entity.
 *
 * @param {String} name - The ID of the display object.
 * @param {Object} spec - The display object class.
 */
export function entity(spec) {
  // Spec validation
  if (!spec) {
    throw new TypeError(`Empty entity specification. Please provide an object.`)
  }

  if (!spec.name) {
    throw new Error(`You must provide an entity name.`)
  }

  if (_entities[spec.name]) {
    throw new Error(`An entity "${spec.name}" has been already registered.`)
  }

  _validateFunction(spec, 'initialize')
  _validateComponents(spec)
  _validateDisplayObject(spec)

  // Create the entity sub class
  class Other extends Entity {}
  Other.$spec = Object.freeze(spec)
  Other.prototype.$spec = Other.$spec
  Other.prototype.name = spec.name
  if (spec.initialize) Other.prototype.initialize = spec.initialize

  _entities[spec.name] = Other
}

/**
 * Validates if spec value is a function.
 */
function _validateFunction(spec, name) {
  if (spec[name] && !utils.isFunction(spec[name])) {
    throw new TypeError(`Parameter "${name}" must be a function.`)
  }
}

/**
 * Validates if the provided components exists.
 */
function _validateComponents(spec) {
  if (!spec.components) return

  for (let i=0; i<spec.components.length; i++) {
    let name = spec.components[i]

    if (!_components[name]) {
      throw new Error(`Component "${name}" is not registered.`)
    }
  }
}

/**
 * Validates if the provided display object exists.
 */
function _validateDisplayObject(spec) {
  if (!spec.display) {
    throw new Error(`You must provide a display object in the `+
                    `"${spec.name}" entity declaration.`)
  }

  if (!_displayObjects[spec.display]) {
    throw new Error(`Display object "${_spec.display}" is not registered.`)
  }
}