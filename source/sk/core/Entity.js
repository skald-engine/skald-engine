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
 * You should not use this class directly, instead, create new entities using 
 * the {@link entity} function.
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
  constructor() {
    super()

    // Internal
    // - _$classId
    // - _$game
    // - _$scene
    // - _$data
    // - _$methods
    // - _$attributes
    
    this._display = null
    this._tags = new Set()
    this._components = {}

    // User initialize function
    this.initialize()
  }

  /**
   * The entity name. Readonly.
   * @type {String}
   */
  get name() { return this._$name }

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
  set display(v) { if (!this._display) this._display = v }

  /**
   * Entity tags.
   * @type {Array}
   */
  get tags() { return Array.from(this._tags) }

  /**
   * The component list. Readonly.
   * @type {Object}
   */
  get components() { return Object.values(this._components) }

  /**
   * Initialize function, called in constructor.
   */
  initialize() {}
  
  /**
   * Destroy function.
   */
  destroy() {}
  
  addTag(...tags) {
    for (let i=0; i<tags.length; i++) {
      this._tags.add(tags[i])
    }
  }

  hasTag(tag) {
    return this._tags.has(tag)
  }

  addComponent(component) {
    let id = component._$classId
    if (this._components[id]) {
      throw new Error(`Trying to add a duplicated component.`)
    }

    this._components[id] = component
    return component
  }

  getComponent(classOrId) {
    if (classOrId && classOrId._$classId) {
      classOrId = classOrId._$classId
    }

    return this._components[classOrId]
  }

  hasComponent(classOrId) {
    return !!this.getComponent(classOrId)
  }
}