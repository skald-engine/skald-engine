import Manager from 'core/Manager'
import Scene from 'core/Scene'
import * as globals from 'globals_'
import * as utils from 'utils'

export default class CreateManager extends Manager {
  constructor(game) {
    super(game)
  }

  setup() {
    utils.profiling.begin('create')
    utils.profiling.end('create')
  }

  entity(id) {
    if (!globals._entities[id]) {
      throw new Error(`Trying to create a non-existing entity "${id}".`)
    }

    let E = globals._entities[id]
    let spec = E.spec

    return new E(this.game, spec.display, spec.components)
  }
  scene(id) {
    if (!globals._scenes[id]) {
      throw new Error(`Trying to create a non-existing scene "${id}".`)
    }

    return new (globals._scenes[id])(this.game)
  }

  component(id, entity) {
    let Component = globals._components[id]
    
    if (!Component) {
      throw new Error(`Trying to create a non-existing component "${id}".`)
    }

    return new Component(entity)
  }

  system(id) {}
  eventSheet(id) {}
}