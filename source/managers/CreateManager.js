import Manager from 'core/Manager'
import * as globals from 'globals_'
import * as utils from 'utils'

export default class CreateManager extends Manager {
  constructor(game) {
    super(game)

  }

  setup() {    
    utils.profiling.begin('scenes')
    utils.profiling.end('scenes')
  }

  entity(id) {
  }
  scene(id) {
    console.log(globals._scenes)
  }
  component(id) {}
  system(id) {}
  eventSheet(id) {}
}