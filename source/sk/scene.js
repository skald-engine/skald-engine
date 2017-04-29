import Scene from 'sk/core/Scene'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

const reservedData = [
  // base
  'name', 'game', 'world', 'layers', 'systems', 'eventSheets',

  // shortcuts
  'initialize', 'enter', 'start', 'pause', 'resume', 'update', 'stop', 'leave',
  'destroy',

  // inherited methods
  'toJson', 'fromJson', 'addEventListener', 'getEventNames', 'emit',
  'removeEventListener', 'removeAllEventListeners', '_imediateEmit',
  'addEntity', 'removeEntity', 'addStatic', 'removeStatic', '_update',

  // internal and accessors values
  '_$data', '_$methods', '_$attributes', '_$name', '_$layers', '_$systems',
  '_$eventSheets'
]

const reservedMethods = [
  // base
  'name', 'game', 'world', 'layers', 'systems', 'eventSheets',

  // inherited methods
  'toJson', 'fromJson', 'addEventListener', 'getEventNames', 'emit',
  'removeEventListener', 'removeAllEventListeners', '_imediateEmit',
  'addEntity', 'removeEntity', 'addStatic', 'removeStatic', '_update',

  // internal and accessors values
  '_$data', '_$methods', '_$attributes', '_$name', '_$layers', '_$systems',
  '_$eventSheets'
]

/**
 * 
 */
export function scene(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let {c, p} = _process(spec)

  // Create the component class
  let Class = utils.createClass(Scene, c, p)

  // Register
  $.scenes[spec.name] = Class
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
    throws(`Empty scene specification. Please provide an object with the `+
           `scene declaration.`)

  // Spec with no name
  if (!spec.name)
    throws(`You must provide the scene name.`)

  // Duplicated scene name
  if ($.scenes[spec.name])
    throws(`A scene "${spec.name}" has been already registered.`)

  // Functions  
  if (spec.initialize && !utils.isFunction(spec.initialize))
    throws(`Initialize function for "${spec.name}" entity must be a function.`)
  
  if (spec.enter && !utils.isFunction(spec.enter))
    throws(`Enter function for "${spec.name}" entity must be a function.`)
  
  if (spec.start && !utils.isFunction(spec.start))
    throws(`Start function for "${spec.name}" entity must be a function.`)
  
  if (spec.pause && !utils.isFunction(spec.pause))
    throws(`Pause function for "${spec.name}" entity must be a function.`)
  
  if (spec.resume && !utils.isFunction(spec.resume))
    throws(`Resume function for "${spec.name}" entity must be a function.`)
  
  if (spec.update && !utils.isFunction(spec.update))
    throws(`Update function for "${spec.name}" entity must be a function.`)
  
  if (spec.stop && !utils.isFunction(spec.stop))
    throws(`Stop function for "${spec.name}" entity must be a function.`)
  
  if (spec.leave && !utils.isFunction(spec.leave))
    throws(`Leave function for "${spec.name}" entity must be a function.`)
  
  if (spec.destroy && !utils.isFunction(spec.destroy))
    throws(`Destroy function for "${spec.name}" entity must be a function.`)

  // Validate system
  if (spec.systems) {
    for (let i=0; i<spec.systems.length; i++) {
      let name = spec.systems[i]
      if (!$.systems[name])
        throws(`Scene "${spec.name}" trying to use a non-existing system `+
               `"${name}."`)
    }
  }

  // Validate event sheets
  if (spec.eventSheets) {
    for (let i=0; i<spec.eventSheets.length; i++) {
      let name = spec.eventSheets[i]
      if (!$.eventSheets[name])
        throws(`Scene "${spec.name}" trying to use a non-existing event `+
               `sheet "${name}."`)
    }
  }

  // Data items
  if (spec.data) {
    if (typeof spec.data !== 'object')
      throws(`Data for scene "${spec.name}" must be an object. You `+
             `provided "${spec.data}" instead.`)

    for (let key in spec.data) {
      if (reservedData.indexOf(key) >= 0)
        throws(`Attribute "${key}" for scene "${spec.name}" is using a `+
               `reserved or duplicated name, please change the attribute `+
               `name.`)

      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for scene "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.methods !== 'object')
      throws(`Methods for scene "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (reservedMethods.indexOf(key) >= 0 || data[key] !== undefined)
        throws(`Method "${key}" for scene "${spec.name}" is using a `+
               `reserved or duplicated name, please change the method name.`)

      if (!utils.isFunction(spec.methods[key]))
        throws(`Method "${key}" for scene "${spec.name}" must be a `+
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

  // Systems
  let systems = {}
  if (spec.systems) {
    for (let i=0; i<spec.systems.length; i++) {
      let name = spec.systems[i]
      systems[name] = $.systems[name]
    }
  }
  p._$systems = c._$systems = Object.freeze(systems)

  // Events sheets
  let eventSheets = {}
  if (spec.eventSheets) {
    for (let i=0; i<spec.eventSheets.length; i++) {
      let name = spec.eventSheets[i]
      eventSheets[name] = $.eventSheets[name]
    }
  }
  p._$eventSheets = c._$eventSheets = Object.freeze(eventSheets)

  // Static properties
  let data = Object.freeze(spec.data || {})
  let methods = Object.freeze(spec.methods || {})
  let layers = Object.freeze(spec.layers || [])
  let attributes = Object.freeze(Object.keys(data))
  p._$data = c._$data = data
  p._$layers = c._$layers = layers
  p._$methods = c._$methods = methods
  p._$attributes = c._$attributes = attributes

  // Data and method values
  for (let k in data) p[k] = data[k]
  for (let k in methods) p[k] = methods[k]

  // Shortcuts (override methods)
  if (spec.initialize) p.initialize = spec.initialize
  if (spec.enter) p.enter = spec.enter
  if (spec.start) p.start = spec.start
  if (spec.pause) p.pause = spec.pause
  if (spec.resume) p.resume = spec.resume
  if (spec.update) p.update = spec.update
  if (spec.stop) p.stop = spec.stop
  if (spec.leave) p.leave = spec.leave
  if (spec.destroy) p.destroy = spec.destroy

  return {c, p}
}
