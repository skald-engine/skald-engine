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
  }
  scene(id) {
    if (!globals._scenes[id]) {
      throw new Error(`Trying to create a non-existing scene "${id}".`)
    }

    return new (globals._scenes[id])(this.game)
  }
  component(id) {}
  system(id) {}
  eventSheet(id) {}
}