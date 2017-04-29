import EventSheet from 'sk/core/EventSheet'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates an event sheet.
 *
 * Usage example:
 *
 *     sk.eventSheet({
 *       name: 'LevelBigRules',
 *       data: {
 *         progression: 0,
 *       },
 *       events: {
 *         update: (event) => { ... },
 *         resize: (event) => { ... },
 *         customEvent: (event) => { ... }
 *       },
 *       methods: {
 *         advanceProgress: () => { ... }
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

  // Register
  $.eventSheets[spec.name] = Class
}


// Shortcut for throwing an error
function throws(message, error) {
  error = error || Error
  throw new error(message)
}

// Validates the spec
function _validate(spec) {
  const reservedData = [
    'name', 'access', 'initialize', 'destroy', 'toJson', 'fromJson', '$data',
    '$methods', '$attributes'
  ]
  const reservedMethods = [
    'name', 'access', 'toJson', 'fromJson', '$data', '$methods', '$attributes'
  ]


  // Empty spec
  if (!spec)
    throws(`Empty event sheet specification. Please provide an object with `+
           `the event sheet declaration.`)

  // Spec with no name
  if (!spec.name)
    throws(`You must provide the event sheet name.`)

  // Duplicated event sheet name
  if ($.eventSheets[spec.name])
    throws(`An event sheet "${spec.name}" has been already registered.`)

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
      if (reservedData.indexOf(key) >= 0)
        throws(`Attribute "${key}" for event sheet "${spec.name}" is using a `+
               `reserved or duplicated name, please change the attribute `+
               `name.`)

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
      if (reservedMethods.indexOf(key) >= 0 || data[key] !== undefined)
        throws(`Method "${key}" for event sheet "${spec.name}" is using a `+
               `reserved or duplicated name, please change the method name.`)

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

  // Base properties
  p._$name = spec.name
  p._$access = spec.access || spec.name

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