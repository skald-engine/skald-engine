import Component from 'sk/core/Component'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates a new component.
 * 
 * Usage example:
 *
 *     sk.component({
 *       name: 'SquareCollider',
 *       access: 'collider',
 *       data: {
 *         radius: 10,
 *         mass: 0.5
 *       },
 *       methods: {
 *         testCollision: function(other) {
 *           ...
 *         }
 *       }
 *     })
 *
 * In the entity declarion you will use the component `name`:
 *
 *     sk.entity({
 *       ...
 *       components: [
 *         'SquareCollider'
 *       ]
 *     })
 *
 * Finally, you can use the component in the entity object like this:
 *
 *     heroEntity.components.collider.radius = 3
 *     heroEntity.components.collider.testCollision(otherEntity)
 * 
 *
 * @param {Object} spec
 * @param {String} spec.name - The ID of the component.
 * @param {String} spec.access - The name as component will be accessed in the
 *        entity
 * @param {Function} spec.initialize - The initialization function.
 * @param {Object} spec.data - Pairs of <attributes:default value> which will
 *        be inserted into the component. They will be accessed as usual 
 *        attributes.
 * @param {Object} spec.methods Pairs of <method:function> which will be
 *        inserted into the component. The methods will be accessed as common
 *        object methods.
 */
export function component(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let values = _process(spec)

  // Create the component class
  let Class = _create(spec, values)

  // Register
  $.components[spec.name] = Class
}



// Validates the spec
function _validate(spec) {
  const reserved = [
    'name', 'access', 'initialize', 'toJson', 'fromJson', '$data', '$methods', 
    '$attributes'
  ]

  // Empty spec
  if (!spec) {
    throw new TypeError(`Empty component specification. Please provide an `
                        `object with the component declaration.`)
  }

  // Spec with no name
  if (!spec.name) {
    throw new Error(`You must provide an component name.`)
  }

  // Duplicated component name
  if ($.components[spec.name]) {
    throw new Error(`A component "${spec.name}" has been already registered.`)
  }

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec[name])) {
    throw new TypeError(`Parameter "${name}" must be a function.`)
  }

  // Data items
  if (spec.data) {
    for (let key in spec.data) {
      // Reserved names
      if (reserved.indexOf(key) >= 0) {
        throw new Error(`Attribute "${key}" for component "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Is a function
      if (utils.isFunction(spec.data[key])) {
        throw new Error(`Attribute "${key}" for component "${spec.name}" `+
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
        throw new Error(`Method "${key}" for component "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Not function
      if (!utils.isFunction(spec.methods[key])) {
        throw new Error(`Method "${key}" for component "${spec.name}" must `+
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

// Create the component class
function _create(spec, values) {
  class Other extends Component {}
  let p = Other.prototype

  // Insert the internal values which will be used by the factory function
  Other.$spec = p._$spec = values.$spec
  Other.$data = p._$data = values.$data
  Other.$methods = p._$methods = values.$methods
  Other.$attributes = p._$attributes = values.$attributes

  // Set base values
  p._name = spec.name
  p._access = spec.access

  // Sets the initialize function
  if (spec.initialize) p.initialize = spec.initialize

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