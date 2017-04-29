import Entity from 'sk/core/Entity'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates a new entity.
 *
 * Usage example:
 *
 *     sk.entity({
 *       name: 'Hero',
 *       display: 'sprite',
 *       components: ['HeroCollider', 'Gravity', 'SimpleInventory'],
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
  const reservedData = [
    'name', 'access', 'components', 'display', 'initialize', 'destroy', 
    'toJson', 'fromJson', '$data', '$components', '$display', '$methods',
    '$attributes'
  ]
  const reservedMethods = [
    'name', 'access', 'components', 'display', 'toJson', 'fromJson', '$data', 
    '$methods', '$attributes', '$components', '$display'
  ]

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
    if (typeof spec.data !== 'object')
      throws(`Methods for entity "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (reservedMethods.indexOf(key) >= 0 || spec.data[key] !== undefined)
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
  for (let i=0; i<spec.components.length; i++) {
    let name = spec.components[i]
    components[name] = $.components[name]
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