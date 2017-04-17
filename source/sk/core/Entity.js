import EventEmitter from 'sk/core/EventEmitter'

/**
 * Base class for Skald entities.
 *
 * An entity is an vessel for components. Entities have direct access to the
 * game instance but not to the scene, the idea is that entity should not 
 * access directly any external resource, except the game and its managers. If
 * you need to communicate with other entities or any other external code, you 
 * can use {@link System}s, {@link EventSheet}s, or events inside the entity.
 *
 * The entity class inherits from {@link EventEmitter}, thus it can receive 
 * events from the event manager. To send an event to an entity, you must set 
 * it as the event target, like this:
 *
 *     game.events.dispatch(event, the_entity)
 *
 * You should not use this class directly, instead, prefer to create new 
 * entities using the {@link entity} function.
 */
export default class Entity extends EventEmitter {

  /**
   * Constructor.
   *
   * @param {Game} game - The game instance.
   * @param {PIXI.DisplayObject} display - The display object connected to the 
   *        entity.
   * @param {Object} components - The map of component instances.
   */
  constructor(game, display, components) {
    super()

    // Inserted by the `component()` declarator:
    // - _name
    // - _$display
    // - _$components
    
    this._game = game
    this._display = display
    this._components = components

    // User initialize function
    this.initialize()
  }

  /**
   * The entity name. Readonly.
   * @type {String}
   */
  get name() { return this._name }

  /**
   * Game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The display object. Readonly.
   * @type {PIXI.DisplayObject}
   */
  get display() { return this._display }

  /**
   * The component list. Readonly.
   * @type {Object}
   */
  get components() { return this._components }

  /**
   * Alias for the component list. Readonly.
   * @type {Object}
   */
  get c() { return this._components }

  /**
   * The user defined list of components. Readonly.
   * @type {Array<string>}
   */
  get $components() { return this._$components }

  /**
   * The user defined display string. Readonly.
   * @type {String}
   */
  get $display() { return this._$display }


  /**
   * Initialize function, called in constructor.
   */
  initialize() {}
  

  /**
   * Checks if this entity has a component.
   *
   * @param {String} name - The component name for checkup.
   * @return {Boolean}
   */
  hasComponent(name) {
    return !!this._components[name]
  }

  /**
   * Alias for `hasComponent`.
   *
   * @param {String} name - The component name for checkup.
   * @return {Boolean}
   */
  has(name) {
    return !!this._components[name]
  }

  /**
   * Exports the component data.
   *
   * @return {Object}
   */
  toJson() {
    let result = {
      name       : this._name,
      components : {}
    }

    for (let key in this._components) {
      let c = this._components[key]
      result.components[key] = c.toJson()
    }

    return result
  }

  /**
   * Imports the component data.
   *
   * @param {Object} data - The component data to be loaded.
   */
  fromJson(data) {
    for (let key in data.components) {
      let params = data.components[key]

      this._components[key].fromJson(params)
    }
  }
}