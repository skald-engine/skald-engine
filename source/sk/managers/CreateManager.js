import Manager from 'sk/core/Manager'
import Scene from 'sk/core/Scene'
import * as $ from 'sk/$'
import * as utils from 'sk/utils'

export default class CreateManager extends Manager {
  constructor(game) {
    super(game)
  }

  setup() {
    utils.profiling.begin('create')
    utils.profiling.end('create')
  }

  entity(id) {
    if (!$.entities[id]) {
      throw new Error(`Trying to create a non-existing entity "${id}".`)
    }

    let E = $.entities[id]
    let spec = E.spec

    return new E(this.game, spec.display, spec.components)
  }
  scene(id) {
    if (!$.scenes[id]) {
      throw new Error(`Trying to create a non-existing scene "${id}".`)
    }

    return new ($.scenes[id])(this.game)
  }

  component(id, entity) {
    let Component = $.components[id]
    
    if (!Component) {
      throw new Error(`Trying to create a non-existing component "${id}".`)
    }

    return new Component(entity)
  }

  system(id) {}
  eventSheet(id) {}
}