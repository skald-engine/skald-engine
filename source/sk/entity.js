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
 * @param {Function} initialize - The initialization function.
 */
export function entity(spec) {
  // Spec validation
  _validate(spec)

  // Processing values
  let values = _process(spec)

  // Create the component class
  let Class = _create(spec, values)

  // Register
  $.entities[spec.name] = Class
}



// Validates the spec
function _validate(spec) {
  // Empty spec
  if (!spec) {
    throw new TypeError(`Empty entity specification. Please provide an `+
                        `object with the entity declaration.`)
  }

  // Spec with no name
  if (!spec.name) {
    throw new Error(`You must provide the entity name.`)
  }

  // Duplicated entity name
  if ($.entities[spec.name]) {
    throw new Error(`A entity "${spec.name}" has been already registered.`)
  }

  // Initialize is a function
  if (spec.initialize && !utils.isFunction(spec.initialize)) {
    throw new TypeError(`Initialize function for "${spec.name}" entity must `+
                        `be a function.`)
  }

  // Display
  if (!spec.display) {
    throw new Error(`You must provide the display for entity "${spec.name}".`)
  }

  if (!$.displayObjects[spec.display]) {
    throw new Error(`Entity "${spec.name}" trying to use a non-existing `+
                    `display object "${spec.display}".`)
  }

  // Components
  if (spec.components) {
    for (let i=0; i<spec.components.length; i++) {
      let name = spec.components[i]

      if (!$.components[name]) {
        throw new Error(`Entity "${spec.name}" trying to use a non-existing `+
                        `component "${name}".`)
      }
    }
  }
}

// Process values
function _process(spec) {
  let $components = Object.freeze(spec.components || {})
  let $display = spec.display

  let components = []
  for (let i=0; i<$components.length; i++) {
    let name = $components[i]
    components.push($.components[name])
  }

  let display = $.displayObjects[$display]

  return {$components, $display, components, display}
}

// Create the entity class
function _create(spec, values) {
  class Other extends Entity {}
  let p = Other.prototype

  // Insert the internal values which will be used by the factory function
  Other.$components = p._$components = values.$components
  Other.display = values.display
  Other.components = values.components

  // Set base values
  p._name = spec.name

  // Sets the initialize function
  if (spec.initialize) p.initialize = spec.initialize

  return Other
}