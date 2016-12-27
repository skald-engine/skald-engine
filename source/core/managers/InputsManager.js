import Manager from 'core/Manager' 

/**
 * Handle the time-based information of the engine.
 */
export default class InputsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

  }
  
  add(action, device, button, mutiplier, fixed) {}
  list(action) {}
  get(action) {}
  clear(action) {}
  forceClear(action) {}

}