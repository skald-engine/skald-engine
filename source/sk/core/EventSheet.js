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
  constructor(game) {    
    // Inserted by the `eventSheet()` declarator:
    // - _name
    // - _access
    // - _$spec
    // - _$data
    // - _$methods
    // - _$attributes
    // - _$events
    // - _$eventNames

    this._game = game
    this._scene = null

    this.initialize()
  }


  /**
   * The system name, used to link it to an scene. Readonly.
   * @type {String}
   */
  get name() { return this._name }

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
   * The system access name, used when accessing the system inside an
   * scene. Readonly.
   * @type {String}
   */
  get access() { return this._access }

  /**
   * The user declared specification of the system. Readonly.
   * @type {Object}
   */
  get $spec() { return this._$spec }

  /**
   * The user declared data of the system. Readonly.
   * @type {Object}
   */
  get $data() { return this._$data }

  /**
   * The user declared methods of the system. Readonly.
   * @type {Object}
   */
  get $methods() { return this._$methods }

  /**
   * The user declared attributes inside the data. Readonly.
   */
  get $attributes() { return this._$attributes }

  /**
   * The user declared events. Readonly.
   */
  get $events() { return this._$events }

  /**
   * List of the user declared event names. Readonly.
   */
  get $eventNames() { return this._$eventNames }

  /**
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  /**
   * Exports the event sheet data.
   *
   * @return {Object}
   */
  toJson() {
    let result = {
      name: this.name,
      data: {}
    }
    for (let i=0; i<this._$attributes; i++) {
      let name = this._$attributes[i]
      result.data[name] = this[name]
    }

    return result
  }

  /**
   * Imports the event sheet data.
   *
   * @param {Object} data - The event sheet data to be loaded.
   */
  fromJson(data) {
    data = data || {}
    data.data = data.data || {}

    for (let name in data.data) {
      this[name] = data.data[name]
    }
  }
}