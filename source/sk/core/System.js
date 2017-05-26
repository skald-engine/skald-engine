/**
 * Base class for Skald systems.
 *
 * A system is the object that contains all the logic for one or more entities.
 * Systems are registered into scenes and created with the scene, then the 
 * scene will *check* the system for each new entity added. The check function
 * tells the scene if the system accepts an entity or not.
 *
 * You should now use this class directly, instead, use the {@link system} 
 * function.
 */
export default class System {
  
  /**
   * Constructor
   *
   * @param {Game} game - The game instance.
   * @param {Scene} scene - The scene instance.
   */
  constructor() {
    // Internal
    // - _$data
    // - _$methods
    // - _$attributes

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

  setup(game, scene) {
    this._game = game
    this._scene = scene
  }

  /**
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  destroy() {}

  /**
   * Check if the system has insterest for the given entity, i.e., if the 
   * system will operate (and, thus, receiving) the entity in the update.
   */
  check(entity) {}

  /**
   * Update.
   */
  update(delta, entities) {}
}