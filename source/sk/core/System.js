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
  constructor(game) {
    // Inserted by the `system()` declarator:
    // - _name
    // - _access
    // - _$spec
    // - _$data
    // - _$methods
    // - _$attributes

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
   * Initialize function, called in the constructor. Override this to put 
   * initialization logic.
   */
  initialize() {}

  /**
   * Check if the system has insterest for the given entity, i.e., if the 
   * system will operate (and, thus, receiving) the entity in the update.
   */
  check(entity) {}

  /**
   * Update.
   */
  update(delta, entities) {}

  /**
   * Exports the component data.
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
   * Imports the component data.
   *
   * @param {Object} data - The component data to be loaded.
   */
  fromJson(data) {
    data = data || {}
    data.data = data.data || {}

    for (let name in data.data) {
      this[name] = data.data[name]
    }
  }
}