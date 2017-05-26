import EventSheet from 'sk/core/EventSheet'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates an event sheet.
 *
 * This function receives an object with the event sheet specification, and 
 * register a new event sheet into the engine if the specification is valid.
 *
 * You must provide a name for the event sheet, which will be used to link the
 * event sheet on the scenes. Check the user guide for a suggestion of how to
 * name the event sheets. Additionally to the name, you should provide an 
 * access name. The access will be used to access the event sheet after it is 
 * created. See the examples below to have an idea of how this will work. 
 * Notice that, if you don't provide an access name, the access will be by its 
 * name.
 *
 * It is important to also notice that names cannot be duplicated in the 
 * engine (you can't have two event sheets with the same name), however, you 
 * may have multiple event sheets with the same access name. In this case, 
 * when adding event sheets with duplicated access to the entity, only the 
 * last event sheet will be added.
 * 
 * A event sheet accepts a map with custom `data` values. All content of the 
 * data map can be accessed just like an attribute in the event sheet, and it 
 * will be used to serialize and deserialize the object, so keep it limited to 
 * JSON-compatible data.
 *
 * Similarly to the data map, the event sheet also accepts a map of `methods`,
 * which can be accessed directly as common methods. If you are using es6, 
 * remember that you **cannot** use arrow functions here, due to how it treats
 * the `this` value (if you use the arrow function, this will be the current
 * scope, e.g., the window). Check below for usage examples.
 *
 * 
 * Usage example:
 *
 *     sk.eventSheet({
 *       name: 'skald.level_big_rules',
 *       data: {
 *         progression: 0,
 *       },
 *       events: {
 *         update: function(event) { ... },
 *         resize: function(event) { ... },
 *         customEvent: function(event) { ... }
 *       },
 *       methods: {
 *         advanceProgress: function() { ... }
 *       }
 *     })
 *
 * @param {Object} spec
 * @param {String} spec.name - The event sheet name, which will be used in the 
 *        scene declaration.
 * @param {String} spec.access - The event sheet access name, which will be 
 *        used to access the sheet in a scene instance
 * @param {Object} spec.data - The attributes of the event sheet.
 * @param {Object} spec.methods - The methods of the event sheets.
 * @param {Object} spec.events - The event callbacks which will listened on 
 *        the scene instance.
 * @param {Function} initialize - The initialization function called by the 
 *        constructor.
 */
export function eventSheet(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let {c, p} = _process(spec)

  // Create the event sheet class
  let Class = utils.createClass(EventSheet, c, p)

  // Set id
  $.setClassId(Class)

  // Register
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
    throws(`Empty event sheet specification. Please provide an object with `+
           `the event sheet declaration.`)

  // Spec type
  if (typeof spec !== 'object')
    throws(`The event sheet specification must be an object.`)

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize))
    throws(`Initialize function for "${spec.name}" event sheet must be a `+
           `function.`)

  // Destroy is a function
  if (spec.destroy && !utils.isFunction(spec.destroy))
    throws(`Destroy function for "${spec.name}" event sheet must be a `+
           `function.`)

  // Data items
  if (spec.data) {
    if (typeof spec.data !== 'object')
      throws(`Data for event sheet "${spec.name}" must be an object. You `+
             `provided "${spec.data}" instead.`)

    for (let key in spec.data) {
      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for event sheet "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.methods !== 'object')
      throws(`Methods for event sheet "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (data[key] !== undefined)
        throws(`Method "${key}" for event sheet "${spec.name}" is using a `+
               `duplicated name, please change the method name.`)

      if (!utils.isFunction(spec.methods[key]))
        throws(`Method "${key}" for event sheet "${spec.name}" must be a `+
               `function.`)
    }
  }

  // Event items
  if (spec.events) {
    if (typeof spec.events !== 'object')
      throws(`Events for event sheet "${spec.name}" must be an object. You `+
             `provided "${spec.events}" instead.`)

    let data = spec.data || {}
    for (let key in spec.events) {
      if (!utils.isFunction(spec.events[key]))
        throws(`Event "${key}" for event sheet "${spec.name}" must be a `+
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
  let events = Object.freeze(spec.events || {})
  let attributes = Object.freeze(Object.keys(data))
  let eventNames = Object.freeze(Object.keys(events))
  p._$data = c._$data = data
  p._$methods = c._$methods = methods
  p._$events = c._$events = events
  p._$attributes = c._$attributes = attributes
  p._$eventNames = c._$eventNames = eventNames

  // Data, method and events values
  for (let k in data) p[k] = data[k]
  for (let k in methods) p[k] = methods[k]    
  for (let k in events) p['_callback_'+k] = events[k]

  // Shortcuts (override methods)
  if (spec.initialize) p.initialize = spec.initialize
  if (spec.destroy) p.destroy = spec.destroy

  return {c, p}
}