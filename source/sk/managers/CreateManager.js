import Manager from 'sk/core/Manager'

import * as $ from 'sk/$'
import * as utils from 'sk/utils'

/**
 * The factory manager.
 *
 * Use this manager to create manually the objects registered in the engine, 
 * such as scenes and entities.
 */
export default class CreateManager extends Manager {

  /**
   * Constructor
   *
   * @param {Game} game - The game instances.
   */
  constructor(game) {
    super(game)
  }

  /**
   * Manager setup. Do not call it manually, for engine use only.
   */
  setup() {
    utils.profiling.begin('create')
    utils.profiling.end('create')
  }

  /**
   * Creates a component.
   *
   * @param {String} name - The component name.
   */
  component(name) {
    let Component = $.components[name]

    if (!Component) {
      throw new Error(`Trying to create a non-existing component "${name}".`)
    }

    return new Component()
  }
}




  // entity(id) {
  //   if (!$.entities[id]) {
  //     throw new Error(`Trying to create a non-existing entity "${id}".`)
  //   }

  //   let E = $.entities[id]
  //   let spec = E.spec

  //   return new E(this.game, spec.display, spec.components)
  // }
  // scene(id) {
  //   if (!$.scenes[id]) {
  //     throw new Error(`Trying to create a non-existing scene "${id}".`)
  //   }

  //   return new ($.scenes[id])(this.game)
  // }

  // component(id, entity) {
  //   let Component = $.components[id]
    
  //   if (!Component) {
  //     throw new Error(`Trying to create a non-existing component "${id}".`)
  //   }

  //   return new Component(entity)
  // }

  // system(id) {}
  // eventSheet(id) {}