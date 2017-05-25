import Component from 'sk/core/Component'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates a new component.
 *
 * This function receives an object with the component specification, and 
 * register a new component into the engine if the specification is valid.
 *
 * You must provide a name for the component, which will be used to link the
 * component on the entities. Check the user guide for a suggestion of how to
 * name the component. Additionally to the name, you should provide an access
 * name. The access will be used to access the component after it is created. 
 * See the examples below to have an idea of how this will work. Notice that,
 * if you don't provide an access name, the access will be by its name.
 *
 * It is important to also notice that names cannot be duplicated in the engine
 * (you can't have two components with the same name), however, you may have
 * multiple components with the same access name. In this case, when adding
 * components with duplicated access to the entity, only the last component 
 * will be added.
 * 
 * A component accepts a map with custom `data` values. All content of the data
 * map can be accessed just like an attribute in the component, and it will be
 * used to serialize and deserialize the object, so keep it limited to 
 * JSON-compatible data.
 *
 * Similarly to the data map, the component also accepts a map of `methods`,
 * which can be accessed directly as common methods. If you are using es6, 
 * remember that you **cannot** use arrow functions here, due to how it treats
 * the `this` value (if you use the arrow function, this will be the current
 * scope, e.g., the window). Check below for usage examples.
 *
 * It is strongly recommended that the component methods be used only to change
 * or return the component state, without access to any external resource 
 * (including the entity itself). This is important in order to create 
 * independent and reusable components.
 *
 * 
 * Usage example:
 *
 *     sk.component({
 *       name: 'sample.square_collider',
 *       access: 'collider',
 *       data: {
 *         radius: 10,
 *         mass: 0.5
 *       },
 *       methods: {
 *         testCollision: function(other) { ... }
 *       }
 *     })
 *
 * In the entity declaration you will use the component `name`:
 *
 *     sk.entity({
 *       ...
 *       components: [
 *         // reference by the component name
 *         'sample.square_collider'
 *       ]
 *     })
 *
 * Finally, you can use the component in the entity object like this:
 *
 *     // reference by the component access name
 *     heroEntity.components.collider.radius = 3
 *     heroEntity.components.collider.testCollision(otherEntity)
 * 
 *
 * @param {Object} spec
 * @param {String} spec.name - The ID of the component.
 * @param {String} spec.access - The name as component will be accessed in the
 *        entity
 * @param {Function} spec.initialize - The initialization function, called when
 *        the component is created (probably together with the entity).
 * @param {Function} spec.destroy - The destroy function.
 * @param {Object} spec.data - Pairs of <attributes:default value> which will
 *        be inserted into the component. They will be accessed as usual 
 *        attributes and will be used to serialize and deserialize the 
 *        component.
 * @param {Object} spec.methods Pairs of <method:function> which will be
 *        inserted into the component. The methods will be accessed as common
 *        methods.
 */
export function component(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let {c, p} = _process(spec)

  // Create the component class
  let Class = utils.createClass(Component, c, p)

  // Return
  return Class
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
    throws(`Empty component specification. Please provide an object with the
            component declaration.`)

  // Spec type
  if (typeof spec !== 'object')
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
      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for component "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.methods !== 'object')
      throws(`Methods for component "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (data[key] !== undefined)
        throws(`Method "${key}" for component "${spec.name}" is using a `+
               `duplicated name, please change the method name.`)

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