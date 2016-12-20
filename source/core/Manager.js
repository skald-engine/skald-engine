/**
 * Base class for all managers in Skald.
 *
 * This class provides just the skeleton and base initialization for managers.
 */
export default class Manager {
  constructor(game) {
    this._game = game
  }


  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() {
    return this._game
  }


  /**
   * Setup method. Called internally by game, do not call manually.
   *
   * @param {Game} game - The game instance
   */
  setup(game) {
    this._game = game
  }
  
  /**
   * preUpdate method. Called internally by game, do not call manually.
   *
   * @param {Number} delta - Elapsed microseconds between this tick and the 
   *        last one.
   */
  preUpdate(delta) {}

  /**
   * Update method. Called internally by game, do not call manually.
   *
   * @param {Number} delta - Elapsed microseconds between this tick and the 
   *        last one.
   */
  update(delta) {}

  /**
   * postUpdate method. Called internally by game, do not call manually.
   *
   * @param {Number} delta - Elapsed microseconds between this tick and the 
   *        last one.
   */
  postUpdate(delta) {}

  /**
   * preDraw method. Called internally by game, do not call manually.
   */
  preDraw() {}

  /**
   * draw method. Called internally by game, do not call manually.
   */
  draw() {}

  /**
   * destroy method. Called internally by game, do not call manually.
   */
  destroy() {}
}