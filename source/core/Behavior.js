
/**
 * A behavior is a reusable functionality that can be attached to an entity.
 *
 * In order to create a new custom behavior, you must inherit from this class
 * and set the Behavior name to an unique identifier. For example:
 *
 *     class Behavior extends skald.Behavior {
 *       initialize() {
 *         this.name = 'unique-name'
 *       }
 *
 *       update(delta) {
 *         ... update logic
 *       }
 *     }
 */
export default class Behavior {

  /**
   * @param {Game} game - The game instance.
   * @param {Scene} scene - The scene instance.
   * @param {Entity} entity - The entity instance.
   */
  constructor(game, scene, entity) {
    this._name = name
    this._game = game
    this._scene = scene
    this._entity = entity

    this.initialize()
  }

  /**
   * The Behavior name. This value can be set only once, throwing an error
   * if you try to set again.
   * @type {String}
   */
  get name() { return this._name }
  set name(value) {
    if (!this._name) {
      throw new Error(`Behavior name cannot be set twice.`)
    }
    this._name = value
  }

  /**
   * The entity attached to this behavior.
   * @type {Entity}
   */
  get entity() { return this._entity }

  /**
   * The scene in which this behavior's entity is living in.
   * @type {Scene}
   */
  get scene() { return this._scene }

  /**
   * The game instance.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The initialization code of the behavior should be put here. This method is
   * called directly by the constructor during the instantiation of the 
   * behavior, so you don't have to override the constructor itself.
   */
  initialize() {}
  
  /**
   * Called automatically by the engine every tick. Override this method to 
   * put the behavior update logic.
   *
   * @param {Number} delta - The elapsed time.
   */
  update(delta) {}

  /**
   * Sets a batch of variables.
   *
   * @param {Object} config - The dictionary of variables and their values.
   */
  configure(config) {
    Object.assign(this, config)
  }
}
