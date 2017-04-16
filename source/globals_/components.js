import Component from 'core/Component'

export let _components = {}

/**
 * 
 */
export function component(spec) {
  // Spec validation
  _validate(spec)

  // Preprocessing the values
  spec.access = spec.access || spec.name
  let $spec = Object.freeze(spec)
  let $data = Object.freeze(spec.data || {})
  let $methods = Object.freeze(spec.methods || {})
  let $attributes = Object.freeze(Object.getOwnPropertyNames($data))

  // Creates the component class
  class Other extends Component {}
  let p = Other.prototype
  Other.$spec = $spec
  Other.$data = $data
  Other.$methods = $methods
  Other.$attributes = $attributes

  if (spec.initialize) p.initialize = spec.initialize

  // Set the attributes
  for (let key in $data) {
    p[key] = $data[key]
  }

  // Set the methods
  for (let key in $methods) {
    p[key] = $methods[key]
  }

  // Register component
  _components[spec.name] = Other
}


/**
 * Validates spec.
 */
function _validate(spec) {
  if (!spec) {
    throw new TypeError(`Empty component specification. Please provide an `
                        `object with the component declaration.`)
  }

  if (!spec.name) {
    throw new Error(`You must provide an component name.`)
  }

  if (_components[spec.name]) {
    throw new Error(`A component "${spec.name}" has been already registered.`)
  }
  
  _validateFunction(spec, 'initialize')
}

/**
 * Validates if spec value is a function.
 */
function _validateFunction(spec, name) {
  if (spec[name] && !utils.isFunction(spec[name])) {
    throw new TypeError(`Parameter "${name}" must be a function.`)
  }
}
