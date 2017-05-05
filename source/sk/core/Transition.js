/**
 * This class represents a transition between two scenes.
 * 
 * To create a new transition you inherit this class and implement its methods:
 *
 * - initialize()
 * - start()
 * - update()
 * - stop()
 * - hasFinished()
 *
 * You may inherit from this class to create your own transition or use one in
 * the `sk.transitions` package.
 */
export default class Transition {
  /**
   * Constructor.
   */
  constructor() {
    this._game = null
    this._swapScenes = false
    this._currentWorld = null
    this._nextWorld = null
  }

  /**
   * The game instance.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The current scene world (from the scene leaving the screen).
   * @type {PIXI.DisplayObject}
   */
  get currentWorld() { return this._currentWorld }

  /**
   * The next scene world (from the scene entering the screen).
   * @type {PIXI.DisplayObject}
   */
  get nextWorld() { return this._nextWorld }

  /**
   * Flag if the current and next scene order should be inverted. I.e., if 
   * `true`, it is going to add the next scene behind the current one. This is
   * necessary for some effects like the a fade out.
   * @type {Boolean}
   */
  get swapScenes() { return this._swapScenes }
  set swapScenes(v) { this._swapScenes = !!v }
  
  /**
   * Setups the transitions with the game instance, and current and next 
   * scenes. This method is called by the Scenes manager, so you don't need to
   * call it manually.
   *
   * @param {Game} game - The game instance.
   * @param {PIXI.DisplayObject} currentWorld - The current (outgoing) scene 
   *        world.
   * @param {PIXI.DisplayObject} nextWorld - The next (incoming) scene world.
   */
  setup(game, currentWorld, nextWorld) {
    this._game = game
    this._currentWorld = currentWorld
    this._nextWorld = nextWorld
  }

  /**
   * Initialize function, called by the engine after the setup.
   */
  initialize() {}

  /**
   * Start function, called when the transition starts.
   */
  start() {}

  /**
   * Update logic of the transition.
   *
   * @param {Number} delta - The time elapsed bettwen the last frames, in 
   *        seconds.
   */
  update(delta) {}

  /**
   * Stop function, called when the transition is finished (or it is 
   * interrupted).
   */
  stop() {}

  /**
   * Function to check if the transition has finished or not. 
   * 
   * @return {Boolean}
   */
  hasFinished() {}
}