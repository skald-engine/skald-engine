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
   * Creates a display object.
   *
   * @param {Strign} name - The display object name.
   */
  displayObject(name) {
    let DisplayObject = $.displayObjects[name]

    if (!DisplayObject) {
      throw new Error(`Trying to create a non-existing display object `+
                      `"${name}".`)
    }

    return new DisplayObject()
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

  /**
   * Creates a entity.
   *
   * @param {String} name - The entity name.
   */
  entity(name) {
    let Entity = $.entities[name]

    if (!Entity) {
      throw new Error(`Trying to create a non-existing entity "${name}".`)
    }

    let display = new Entity.display()
    let components = {}
    for (let i=0; i<Entity.components.length; i++) {
      let c = new Entity.components[i]()
      components[c.access] = c
    }

    return new Entity(name, display, components)
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