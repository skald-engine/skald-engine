/**
 * Base class for transitions between game scenes.
 *
 * This class is responsible for changing the scene objects to perform the 
 * transition. The transition process is divided into 4 different phases:
 *
 * - **setup** where the game calls `transition.setup` with the reference to
 *   the game itself and tells to the transition which scenes are going to 
 *   used.
 * - **start**, in which the transition configure the initial values of the 
 *   scenes.
 * - **update**, in which the method `update` is called multiple times in order
 *   to update the transition. This phase stops when `transition.hasFinished` 
 *   returns true.
 * - **complete** where this object resets all scene values used in the 
 *   transition, keeping the scene good to be added to screen again.
 *
 * Notice that, the current scene may be `null`. This happens, for example, 
 * when you are playing the first scene of the game.
 */
export default class Transition {
  constructor() {
    this._game = null
    this._swapScenes = false
    this._currentScene = null
    this._nextScene = null
  }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * If this director should swap scenes when this transition is performed 
   * (i.e., the next scene will be added below of the current scene). Readonly.
   * @type {Boolean}
   */
  get swapScenes() { return this._swapScenes }

  /**
   * The reference to the current scene. Readonly.
   * @type {Scene}
   */
  get currentScene() { return this._currentScene }

  /**
   * The reference to the next scene. Readonly.
   * @type {Scene}
   */
  get nextScene() { return this._nextScene }

  /**
   * Setup the transition object. Called every time a transition is performed.
   * 
   * @param {Game} game - The game instance.
   * @param {Scene} currentScene - The instance of the current scene.
   * @param {Scene} nextScene - The instance of the next scene.
   */
  setup(game, currentScene, nextScene) {
    this._game = game
    this._currentScene = currentScene
    this._nextScene = nextScene
  }

  /**
   * Starts the transition.
   */
  start() {}

  /**
   * Updates the transition.
   *
   * @param {Number} delta - The elapsed time.
   */
  update(delta) {}

  /**
   * Finishes the transition. It should reset the scene values to its 
   * originals.
   */
  complete() {}

  /**
   * Informs if the transition has been finished or not.
   *
   * @return {Boolean} `true` if the transition has been finished.
   */
  hasFinished() {}
}