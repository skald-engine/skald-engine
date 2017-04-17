import Scene from 'sk/core/Scene'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * 
 */
export function scene(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let values = _process(spec)

  // Create the component class
  let Class = _create(spec, values)

  // Register
  $.scenes[spec.name] = Class
}



// Validates the spec
function _validate(spec) {
  // Empty spec
  if (!spec) {
    throw new TypeError(`Empty scene specification. Please provide an `+
                        `object with the scene declaration.`)
  }

  // Spec with no name
  if (!spec.name) {
    throw new Error(`You must provide the scene name.`)
  }

  // Duplicated scene name
  if ($.scenes[spec.name]) {
    throw new Error(`A scene "${spec.name}" has been already registered.`)
  }

  // Functions
  let validateFunction = (name) => {
    let f = spec[name]
    if (f && !utils.isFunction(f)) {

    throw new TypeError(`Function "${name}" for "${spec.name}" entity must `+
                        `be a function.`)
    }
  }
  validateFunction('initialize')
  validateFunction('enter')
  validateFunction('start')
  validateFunction('pause')
  validateFunction('resume')
  validateFunction('update')
  validateFunction('stop')
  validateFunction('leave')
  validateFunction('destroy')

  // Validate system
  if (spec.systems) {
    for (let i=0; i<spec.systems.length; i++) {
      let name = spec.systems[i]
      if (!$.systems[name]) {
        throw new Error(`Scene "${spec.name}" trying to use a non-existing `+
                        `system "${name}."`)
      }
    }
  }

  // Validate event sheets
  if (spec.eventSheets) {
    for (let i=0; i<spec.eventSheets.length; i++) {
      let name = spec.eventSheets[i]
      if (!$.eventSheets[name]) {
        throw new Error(`Scene "${spec.name}" trying to use a non-existing `+
                        `event sheet "${name}."`)
      }
    }
  }
}

// Process values
function _process(spec) {
  let $layers = Object.freeze(spec.layers || [])
  let $systems = Object.freeze(spec.systems || [])
  let $eventSheets = Object.freeze(spec.eventSheets || [])

  let systems = []
  for (let i=0; i<$systems.length; i++) {
    let name = $systems[i]
    systems.push($.systems[name])
  }

  let eventSheets = []
  for (let i=0; i<$eventSheets.length; i++) {
    let name = $eventSheets[i]
    eventSheets.push($.eventSheets[name])
  }

  return {$layers, $systems, $eventSheets, systems, eventSheets}
}

// Create the entity class
function _create(spec, values) {
  class Other extends Scene {}
  let p = Other.prototype

  // Insert the internal values which will be used by the factory function
  Other.$layers = p._$layers = values.$layers
  Other.$systems = p._$systems = values.$systems
  Other.$eventSheets = p._$eventSheets = values.$eventSheets
  Other.systems = values.systems
  Other.eventSheets = values.eventSheets

  // Set base values
  p._name = spec.name

  // Sets the functions
  if (spec.initialize) p.initialize = spec.initialize
  if (spec.enter) p.enter = spec.enter
  if (spec.start) p.start = spec.start
  if (spec.pause) p.pause = spec.pause
  if (spec.resume) p.resume = spec.resume
  if (spec.update) p.update = spec.update
  if (spec.stop) p.stop = spec.stop
  if (spec.leave) p.leave = spec.leave
  if (spec.destroy) p.destroy = spec.destroy

  return Other
}