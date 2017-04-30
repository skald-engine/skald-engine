import Entity from 'sk/core/Entity'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

// Reserved names for the data input
const reservedData = [
  // base
  'name', 'display', 'components', 'c', 'game', 'type',

  // shortcuts
  'initialize', 'destroy',

  // inherited methods
  'toJson', 'fromJson', 'addEventListener', 'getEventNames', 'emit',
  'removeEventListener', 'removeAllEventListeners', '_imediateEmit',
  'hasComponent', 'has', 

  // internal and accessors values
  '_$data', '_$methods', '_$attributes', '_$name', '_$components', '_$display',
  '_$type'
]

// Reserved names for the methods input
const reservedMethods = [
  // base
  'name', 'display', 'components', 'c', 'game', 'type',

  // inherited methods
  'toJson', 'fromJson', 'addEventListener', 'getEventNames', 'emit',
  'removeEventListener', 'removeAllEventListeners', '_imediateEmit',
  'hasComponent', 'has', 

  // internal and accessors values
  '_$data', '_$methods', '_$attributes', '_$name', '_$components', '_$display',
  '_$type'
]

/**
 * Creates a new entity.
 *
 * This function receives an object with the entity specification, and 
 * register a new entity into the engine if the specification is valid.
 *
 * You must provide a name for the entity, which will be used to add it on the
 * scenes. Check the user guide for a suggestion of how to name the entities. 
 * Notice that names cannot be duplicated in the engine, so you can't have two
 * entities with the same name.
 *
 * You also must provide a display object type of the entity, for example 
 * `sprite` or `text`. The display object will be created during the 
 * construction of the entity and can be accessed via `entity.display`.
 * 
 * An entity accepts a map with custom `data` values. All content of the data
 * map can be accessed just like an attribute in the entity, and it will be
 * used to serialize and deserialize the object, so keep it limited to 
 * JSON-compatible data.
 *
 * Similarly to the data map, the entity also accepts a map of `methods`,
 * which can be accessed directly as common methods. If you are using es6, 
 * remember that you **cannot** use arrow functions here, due to how it treats
 * the `this` value (if you use the arrow function, this will be the current
 * scope, e.g., the window). Check below for usage examples.
 *
 * The data and methods input were added to provide flexibility and freedom of
 * how to use the entities, however, we suggest that you keep the entity empty,
 * adding data on components and logic on systems.
 * 
 * Usage example:
 *
 *     sk.entity({
 *       name: 'Hero',
 *       display: 'sprite',
 *       components: [
 *         'sample.hero_collider',
 *         'sample.gravity',
 *         'sample.simple_inventory'
 *       ],
 *       initialize: function() {
 *          this.display.image = this.game.resources.get('hero_image')
 *       }
 *     })
 *     
 * 
 * @param {Object} spec
 * @param {String} spec.name - The entity unique ID.
 * @param {String} spec.display - The display name which must be registered in
 *        the engine (using registerDisplayObjects).
 * @param {Array<String>} spec.components - The component list. You must 
 *        provide the component name in this (not the component access).
 * @param {Function} spec.initialize - The initialization function.
 * @param {Object} spec.data - Pairs of <attributes:default value> which will
 *        be inserted into the component. They will be accessed as usual 
 *        attributes and will be used to serialize and deserialize the entity.
 * @param {Object} spec.methods Pairs of <method:function> which will be
 *        inserted into the component. The methods will be accessed as common
 *        methods.
 */
export function entity(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let {c, p} = _process(spec)

  // Create the component class
  let Class = utils.createClass(Entity, c, p)

  // Register
  $.entities[spec.name] = Class
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
    throws(`Empty entity specification. Please provide an object with the `+
           `entity declaration.`)

  // Spec with no name
  if (!spec.name)
    throws(`You must provide the entity name.`)

  // Duplicated entity name
  if ($.entities[spec.name])
    throws(`A entity "${spec.name}" has been already registered.`)

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize))
    throws(`Initialize function for "${spec.name}" entity must be a function.`)

  // Destroy is a function
  if (spec.destroy && !utils.isFunction(spec.destroy))
    throws(`Destroy function for "${spec.name}" entity must be a function.`)

  // Display
  if (!spec.display)
    throws(`You must provide the display for entity "${spec.name}".`)

  if (!$.displayObjects[spec.display])
    throws(`Entity "${spec.name}" trying to use a non-existing display `+
           `object "${spec.display}".`)
  
  // Components
  if (spec.components) {
    for (let i=0; i<spec.components.length; i++) {
      let name = spec.components[i]

      if (!$.components[name])
        throws(`Entity "${spec.name}" trying to use a non-existing `+
               `component "${name}".`)
    }
  }

  // Data items
  if (spec.data) {
    if (typeof spec.data !== 'object')
      throws(`Data for entity "${spec.name}" must be an object. You `+
             `provided "${spec.data}" instead.`)

    for (let key in spec.data) {
      if (reservedData.indexOf(key) >= 0)
        throws(`Attribute "${key}" for entity "${spec.name}" is using a `+
               `reserved or duplicated name, please change the attribute `+
               `name.`)

      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for entity "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.methods !== 'object')
      throws(`Methods for entity "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (reservedMethods.indexOf(key) >= 0 || data[key] !== undefined)
        throws(`Method "${key}" for entity "${spec.name}" is using a `+
               `reserved or duplicated name, please change the method name.`)

      if (!utils.isFunction(spec.methods[key]))
        throws(`Method "${key}" for entity "${spec.name}" must be a `+
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
  p._$type = c._$type = spec.display

  // Display
  p._$display = c._$display = $.displayObjects[spec.display]

  // Components
  let components = {}
  if (spec.components) {
    for (let i=0; i<spec.components.length; i++) {
      let name = spec.components[i]
      components[name] = $.components[name]
    }
  }
  p._$components = c._$components = Object.freeze(components)

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