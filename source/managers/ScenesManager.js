import Manager from 'core/Manager' 
// import Scene from 'core/Scene' 
// import Transition from 'core/Transition' 
import * as utils from 'utils'

export default class DirectorManager extends Manager {
  
  constructor(game) {
    super(game)

    this._current = null
  }

  get current() { return this._current }

  setup() {
    utils.profiling.begin('scenes')
    utils.profiling.end('scenes')
  }
  play(sceneOrId, transition) {}

  inTransition() {}

  update(delta) {}

}