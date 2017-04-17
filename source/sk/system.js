import System from 'sk/core/System'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates a new system.
 *
 * Usage example:
 *
 *     sk.system({
 *       name: 'Collision',
 *       access: 'collision',
 *       check: function(entity) {
 *         return entity.has('Collider')
 *       }
 *     })
 * 
 *
 * @param {Object} spec
 * @param {String} spec.name - The system name, which will be used in the scene
 *        declaration.
 * @param {String} spec.access - The access name of the system which will be 
 *        used to access the system in the scene object.
 * @param {Function} spec.initialize - The initialization function.
 * @param {Function} spec.check - The check function.
 * @param {Function} spec.update - The update function.
 * @param {Object} spec.data - The attributes of the system.
 * @param {Object} spec.methods - The methods of the system.
 */
export function system(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let values = _process(spec)

  // Create the system class
  let Class = _create(spec, values)

  // Register
  $.systems[spec.name] = Class
}



// Validates the spec
function _validate(spec) {
  const reserved = [
    'name', 'access', 'initialize', 'check', 'update', 'toJson', 'fromJson',
    '$data', '$methods', '$attributes'
  ]

  // Empty spec
  if (!spec) {
    throw new TypeError(`Empty system specification. Please provide an `+
                        `object with the system declaration.`)
  }

  // Spec with no name
  if (!spec.name) {
    throw new Error(`You must provide the system name.`)
  }

  // Duplicated system name
  if ($.systems[spec.name]) {
    throw new Error(`A system "${spec.name}" has been already registered.`)
  }

  // Check function not provided
  if (!spec.check) {
    throw new Error(`The system "${spec.name}" must have a check function.`)
  }

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize)) {
    throw new TypeError(`Initialize function for "${spec.name}" system `+
                        `must be a function.`)
  }

  // Check is a function
  if (!utils.isFunction(spec.check)) {
    throw new TypeError(`Check function for "${spec.name}" system must be a `+
                        `function.`)
  }

  // Update is a function
  if (spec.update && !utils.isFunction(spec.update)) {
    throw new TypeError(`Update function for "${spec.name}" system must be a `+
                        `function.`)
  }

  // Data items
  if (spec.data) {
    for (let key in spec.data) {
      // Reserved names
      if (reserved.indexOf(key) >= 0) {
        throw new Error(`Attribute "${key}" for system "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Is a function
      if (utils.isFunction(spec.data[key])) {
        throw new Error(`Attribute "${key}" for system "${spec.name}" `+
                        `can't be a function, use the *method* option if `+
                        `you want to include a method.`)
      }
    }
  }

  // Method items
  if (spec.methods) {
    for (let key in spec.methods) {
      // Reserved names
      if (reserved.indexOf(key) >= 0) {
        throw new Error(`Method "${key}" for system "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Not function
      if (!utils.isFunction(spec.methods[key])) {
        throw new Error(`Method "${key}" for system "${spec.name}" must `+
                        `be a function.`)
      }
    }
  }
}

// Process values
function _process(spec) {
  spec.access = spec.access || spec.name

  let $spec = Object.freeze(spec)
  let $data = Object.freeze(spec.data || {})
  let $methods = Object.freeze(spec.methods || {})
  let $attributes = Object.freeze(Object.getOwnPropertyNames($data))

  return {$spec, $data, $methods, $attributes}
}

// Create the system class
function _create(spec, values) {
  class Other extends System {}
  let p = Other.prototype

  // Insert the internal values which will be used by the factory function
  Other.$spec = p._$spec = values.$spec
  Other.$data = p._$data = values.$data
  Other.$methods = p._$methods = values.$methods
  Other.$attributes = p._$attributes = values.$attributes

  // Set base values
  p._name = spec.name
  p._access = spec.access

  // Sets the functions
  if (spec.initialize) p.initialize = spec.initialize
  if (spec.check) p.check = spec.check
  if (spec.update) p.update = spec.update

  // Set the attributes
  for (let key in values.$data) {
    p[key] = values.$data[key]
  }

  // Set the methods
  for (let key in values.$methods) {
    p[key] = values.$methods[key]
  }

  return Other
}