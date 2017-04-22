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
  let values = _process(spec)

  // Create the event sheet class
  let Class = _create(spec, values)

  // Register
  $.eventSheets[spec.name] = Class
}



// Validates the spec
function _validate(spec) {
  const reserved = [
    'name', 'access', 'initialize', 'toJson', 'fromJson', '$data', '$methods', 
    '$attributes', '$events'
  ]

  // Empty spec
  if (!spec) {
    throw new TypeError(`Empty event sheet specification. Please provide an `+
                        `object with the event sheet declaration.`)
  }

  // Spec with no name
  if (!spec.name) {
    throw new Error(`You must provide the event sheet name.`)
  }

  // Duplicated event sheet name
  if ($.eventSheets[spec.name]) {
    throw new Error(`An event sheet "${spec.name}" has been already `+
                    `registered.`)
  }

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize)) {
    throw new TypeError(`Initialize function for "${spec.name}" event sheet `+
                        `must be a function.`)
  }

  // Data items
  if (spec.data) {
    for (let key in spec.data) {
      // Reserved names
      if (reserved.indexOf(key) >= 0) {
        throw new Error(`Attribute "${key}" for event sheet "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Is a function
      if (utils.isFunction(spec.data[key])) {
        throw new Error(`Attribute "${key}" for event sheet "${spec.name}" `+
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
        throw new Error(`Method "${key}" for event sheet "${spec.name}" is `+
                        `using a reserved name, please change the method `+
                        `name.`)
      }

      // Not function
      if (!utils.isFunction(spec.methods[key])) {
        throw new Error(`Method "${key}" for event sheet "${spec.name}" must `+
                        `be a function.`)
      }
    }
  }

  // Event items not function
  if (spec.events) {
    for (let key in spec.events) {
      if (!utils.isFunction(spec.events[key])) {
        throw new Error(`Event callback "${key}" for the event sheet `+
                        `"${spec.name}" must be a function.`)
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
  let $events = Object.freeze(spec.events || {})
  let $eventNames = Object.freeze(Object.getOwnPropertyNames($events))
  let $attributes = Object.freeze(Object.getOwnPropertyNames($data))

  return {$spec, $data, $methods, $attributes, $events, $eventNames}
}

// Create the event sheet class
function _create(spec, values) {
  class Other extends EventSheet {}
  let p = Other.prototype

  // Insert the internal values which will be used by the factory function
  Other.$spec = p._$spec = values.$spec
  Other.$data = p._$data = values.$data
  Other.$methods = p._$methods = values.$methods
  Other.$attributes = p._$attributes = values.$attributes
  Other.$events = p._$events = values.$events
  Other.$eventNames = p._$eventNames = values.$eventNames

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

  // Set the event callbacks as part of the event sheet
  for (let key in values.$events) {
    p['_callback_'+key] = values.$events[key]
  }

  return Other
}