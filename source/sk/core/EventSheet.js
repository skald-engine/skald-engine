/**
 * Base class for the Skald event sheets.
 *
 * An event sheet is a scene helper to organize and reuse the scene event 
 * callbacks. You may use an event sheet to control the game logic or simply 
 * update the settings when the screen is resized. The complexity and utility
 * of this class is upon you.
 *
 * The event sheet differs from the System in the following points:
 *
 * - The scene stores a list of entities for each system, in order to avoiding
 *   entity lookup every tick. There is no concept of attached entities in 
 *   event sheets. Thus, if you need to update a list of entities, try using a
 *   system.
 * - The event sheet automatically register event listeners to scene, which is
 *   not present in the system.
 *
 * As a general guideline, you may adopt the mindset that a system contains 
 * entity-dependent and entity-focused logic while event sheets contains
 * scene-focused logic.
 */
export default class EventSheet {
  
  /**
   * Constructor.
   * 
   * @param {Game} game - The game instance.
   * @param {Scene} scene - The scene instance.
   */
  constructor() {    
    // Internal
    // - _$data
    // - _$methods
    // - _$attributes
    // - _$events
    // - _$eventNames

    this._game = null
    this._scene = null

    this.initialize()
  }


  /**
   * The game isntance. Readonly.
   * @type {String}
   */
  get game() { return this._game }

  /**
   * The scene instance. Readonly.
   * @type {String}
   */
  get scene() { return this._scene }

  /**
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  destroy() {}

  setup(game, scene) {
    this._game = game
    this._scene = scene
    
    for (let k in this._$events) {
      let name = '_callback_'+k
      scene.addEventListener(k, e => this[name](e))
    }
  }
}