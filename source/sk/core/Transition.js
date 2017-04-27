/**
 * This class represents a transition between two scenes.
 *
 * You may inherit from this class to create your own transition or one in the
 * `sk.transitions` package.
 */
export default class Transition {
  /**
   * Constructor.
   */
  constructor() {
    this._game = null
    this._swapScenes = false
    this._currentScene = null
    this._nextScene = null
  }

  /**
   * The game instance.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The current scene (the scene leaving the screen).
   * @type {Scene}
   */
  get currentScene() { return this._currentScene }

  /**
   * The next scene (the scene entering the screen).
   * @type {Scene}
   */
  get nextScene() { return this._nextScene }

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
   * @param {Scene} currentScene - The current (outgoing) scene.
   * @param {Scene} nextScene - The next (incoming) scene.
   */
  setup(game, currentScene, nextScene) {
    this._game = game
    this._currentScene = currentScene
    this._nextScene = nextScene
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
   * Stop function, called when the transition is finished (or it is 
   * interrupted).
   */
  stop() {}

  /**
   * Function to check if the transition has finished or not. 
   * 
   * @return {Boolean}
   */
  isFinished() {}

  /**
   * Update logic of the transition.
   *
   * @param {Number} delta - The time elapsed bettwen the last frames, in 
   *        seconds.
   */
  update(delta) {}
}