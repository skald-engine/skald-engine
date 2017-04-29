import System from 'sk/core/System'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * Creates a new system.
 *
 * Usage example:
 *
 *     sk.system({
 *       name: 'Collision',
 *       access: 'collision',
 *       check: function(entity) {
 *         return entity.has('Collider')
 *       }
 *     })
 * 
 *
 * @param {Object} spec
 * @param {String} spec.name - The system name, which will be used in the scene
 *        declaration.
 * @param {String} spec.access - The access name of the system which will be 
 *        used to access the system in the scene object.
 * @param {Function} spec.initialize - The initialization function.
 * @param {Function} spec.check - The check function.
 * @param {Function} spec.update - The update function.
 * @param {Object} spec.data - The attributes of the system.
 * @param {Object} spec.methods - The methods of the system.
 */
export function system(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let {c, p} = _process(spec)

  // Create the system class
  let Class = utils.createClass(System, c, p)

  // Register
  $.systems[spec.name] = Class
}


// Shortcut for throwing an error
function throws(message, error) {
  error = error || Error
  throw new error(message)
}

// Validates the spec
function _validate(spec) {
  const reservedData = [
    'name', 'access', 'initialize', 'check', 'update', 'destroy', 'toJson', 
    'fromJson', '$data', '$methods', '$attributes'
  ]
  const reservedMethods = [
    'name', 'access', 'toJson', 'fromJson', '$data', '$methods', '$attributes'
  ]


  // Empty spec
  if (!spec)
    throws(`Empty system specification. Please provide an object with the `+
           `system declaration.`)

  // Spec with no name
  if (!spec.name)
    throws(`You must provide the system name.`)

  // Duplicated system name
  if ($.systems[spec.name])
    throws(`A system "${spec.name}" has been already registered.`)

  // Check function not provided
  if (!spec.check)
    throws(`The system "${spec.name}" must have a check function.`)

  // Check is a function
  if (!utils.isFunction(spec.check))
    throws(`Check function for "${spec.name}" system must be a function.`)
  
  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize))
    throws(`Initialize function for "${spec.name}" system must be a function.`)

  // Destroy is a function
  if (spec.destroy && !utils.isFunction(spec.destroy))
    throws(`Destroy function for "${spec.name}" system must be a function.`)

  // Update is a function
  if (spec.update && !utils.isFunction(spec.update))
    throws(`Update function for "${spec.name}" system must be a `+
                        `function.`)
  
  // Data items
  if (spec.data) {
    if (typeof spec.data !== 'object')
      throws(`Data for system "${spec.name}" must be an object. You `+
             `provided "${spec.data}" instead.`)

    for (let key in spec.data) {
      if (reservedData.indexOf(key) >= 0)
        throws(`Attribute "${key}" for system "${spec.name}" is using a `+
               `reserved or duplicated name, please change the attribute `+
               `name.`)

      if (utils.isFunction(spec.data[key]))
        throws(`Attribute "${key}" for system "${spec.name}" can't be a `+
               `function, use the *method* option if you want to include a `+
               `method.`)
    }
  }

  // Method items
  if (spec.methods) {
    if (typeof spec.methods !== 'object')
      throws(`Methods for system "${spec.name}" must be an object. You `+
             `provided "${spec.methods}" instead.`)

    let data = spec.data || {}
    for (let key in spec.methods) {
      if (reservedMethods.indexOf(key) >= 0 || data[key] !== undefined)
        throws(`Method "${key}" for system "${spec.name}" is using a `+
               `reserved or duplicated name, please change the method name.`)

      if (!utils.isFunction(spec.methods[key]))
        throws(`Method "${key}" for system "${spec.name}" must be a `+
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
  if (spec.check) p.check = spec.check
  if (spec.update) p.update = spec.update

  return {c, p}
}
