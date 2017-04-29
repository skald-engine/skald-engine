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
 * @param {Function} spec.destroy - The destroy function.
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
  let {c, p} = _process(spec)

  // Create the component class
  let Class = utils.createClass(Component, c, p)

  // Register
  $.components[spec.name] = Class
}


// Shortcut for throwing an error
function throws(message, error) {
  error = error || Error
  throw new error(message)
}

// Validates the spec
function _validate(spec) {
  const reservedData = [
    'name', 'access', 'initialize', 'destroy', 'toJson', 'fromJson', 
    '$data', '$methods', '$attributes'
  ]
  const reservedMethods = [
    'name', 'access', 'toJson', 'fromJson', '$data', '$methods', '$attributes'
  ]

  // Empty spec
  if (!spec)
    throws(`Empty component specification. Please provide an object with the
            component declaration.`)

  // Spec with no name
  if (!spec.name)
    throws(`You must provide the component name.`)

  // Duplicated component name
  if ($.components[spec.name])
    throws(`A component "${spec.name}" has been already registered.`)

  // Initialize must be a function
  if (spec.initialize && !utils.isFunction(spec.initialize))
    throws(`Initialize function for "${spec.name}" component must be a `+
           `function.`)

  // Destroy must be a function
  if (spec.destroy && !utils.isFunction(spec.destroy))
    throws(`Destroy function for "${spec.name}" component must be a function.`)

  // Data items
  if (spec.data) {
    if (typeof spec.data !== 'object')
      throws(`Data for component "${spec.name}" must be an object. You `+
             `provided "${spec.data}" instead.`)

    for (let key in spec.data) {
      if (reservedData.indexOf(key) >= 0)
        throws(`Attribute "${key}" for component "${spec.name}" is using a `+
               `reserved or duplicated name, please change the attribute `+
               `name.`)

      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for component "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.data !== 'object')
      throws(`Methods for component "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (reservedMethods.indexOf(key) >= 0 || spec.data[key] !== undefined)
        throws(`Method "${key}" for component "${spec.name}" is using a `+
               `reserved or duplicated name, please change the method name.`)

      if (!utils.isFunction(spec.methods[key]))
        throws(`Method "${key}" for component "${spec.name}" must be a `+
               `function.`)
    }
  }
}

// Process values
function _process(spec) {
  let c = {} // class namespace
  let p = {} // prototype

  // Base properties
  p._$name = spec.name
  p._$access = spec.access || spec.name

  // Static properties
  let data = Object.freeze(spec.data || {})
  let methods = Object.freeze(spec.methods || {})
  let attributes = Object.freeze(Object.keys(data))
  p._$data = c._$data = data
  p._$methods = c._$methods = methods
  p._$attributes = c._$attributes = attributes

  // Data and method values
  for (let k in data) p[k] = data[k]
  for (let k in methods) p[k] = methods[k]

  // Shortcuts (override methods)
  if (spec.initialize) p.initialize = spec.initialize
  if (spec.destroy) p.destroy = spec.destroy

  return {c, p}
}