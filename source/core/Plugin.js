import Game from 'core/Game'

/**
 * Base class for all plugins in Skald.
 *
 * A plugin is a custom manager that runs inside the game. You may create a 
 * plugin to add global behabiors to the game engine.
 */
export default class Plugin {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    if (!game || !(game instanceof Game)) {
      throw new TypeError(
        `Trying to instantiate a Plugin without an instance of sk.Game.`
      )
    }

    this._game = game
    this._name = null

    this.initialize()

    if (this._name === null) {
      throw new Error(`You must set the plugin name when it initializes.`)
    }
  }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() {
    return this._game
  }

  /**
   * The Plugin name. This value can be set only once, throwing an error if you
   * try to set again.
   * @type {String}
   */
  get name() { return this._name }
  set name(value) {
    if (!!this._name) {
      throw new Error(`Plugin name cannot be set twice.`)
    }
    this._name = value
  }

  /**
   * The initialization code of the plugin should be put here. This method is
   * called directly by the constructor during the instantiation of the 
   * plugin, so you don't have to override the constructor itself.
   */
  initialize() {}

  /**
   * Called automatically by the engine every tick. Override this method to 
   * put the plugin pre update logic.
   *
   * @param {Number} delta - The elapsed time.
   */
  preUpdate(delta) {}

  /**
   * Called automatically by the engine every tick. Override this method to 
   * put the plugin update logic.
   *
   * @param {Number} delta - The elapsed time.
   */
  update(delta) {}

  /**
   * Called automatically by the engine every tick. Override this method to 
   * put the plugin post update logic.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {}

  /**
   * Called automatically by the engine every tick, before the game is drawn.
   */
  preDraw() {}

  /**
   * Called automatically by the engine every tick, after the game is drawn.
   */
  draw() {}

  /**
   * Called when the plugin should be destroyed.
   */
  destroy() {}
}