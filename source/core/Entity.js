import EventEmitter from 'core/EventEmitter'
import Game from 'core/Game'
import Scene from 'core/Scene'
import {tryToInstantiate} from 'utils'


/**
 * An entity is any object with physical position in the world. You won't be
 * using this class directly, instead, use one of its specific implementations,
 * such as {@link Sprite} or {@link Text}.
 * 
 * As a normal use, you should add an entity directly to the scene, without
 * instantiate it, like:
 *
 *     class MyScene extends skald.Scene {
 *       initialize() {
 *         this.addEntity(MyEntity)
 *       }
 *     }
 *
 * An entity object may have one or more behaviors attached to it. To know more
 * about behaviors, see {@link Behavior}.
 */
export default class Entity extends EventEmitter {

  /**
   * @param {Game} game - The game object.
   * @param {Scene} scene - The scene in which this entity livis in.
   * @param {PIXI.DisplayObject} displayObject - An instance of PIXI display
   *        object.
   * @param {Boolean} [suppressInitialize=false] - If true, the initialize 
   *        method won't be called
   */
  constructor(game, scene, displayObject, suppressInitialize=false) {
    super()

    if (!game || !(game instanceof Game)) {
      return new TypeError(
        `Trying to instantiate a Game without an instance of sk.Game.`
      )
    }

    if (!scene || !(scene instanceof Scene)) {
      return new TypeError(
        `Trying to instantiate a Scene without an instance of sk.Scene.`
      )
    }

    if (!displayObject) {
      return new TypeError(
        `Trying to instantiate a Scene without a display object.`
      )
    }


    this._tags = []
    this._game = game
    this._scene = scene
    this._displayObject = displayObject

    this._behaviors = {}

    this.updatable = true
    this.alive = true

    if (!suppressInitialize) {
      this.initialize()
    }
  }

  /**
   * The game object. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The scene object. Readonly.
   * @type {Game}
   */
  get scene() { return this._scene }

  /**
   * The entity's behaviors dict. Readonly.
   * @type {Object}
   */
  get behaviors() { return this._behaviors }

  /**
   * The pixi display object. Readonly.
   * @type {PIXI.DisplayObject}
   */
  get displayObject() { return this._displayObject }

  /**
   * The list of tags in this entity. This can be set only once, if you try to
   * set it twice an error will be throw.
   * @type {Array<String>}
   */
  get tags() { return this._tags || [] }
  set tags(value) {
    if (this._tags && this._tags.length) {
      throw new Error(`Trying to set tags more than once.`)
    }
    this._tags = value
  }

  /**
   * The X position of the entity.
   * @type {Number}
   */
  get x() { return this._displayObject.position.x }
  set x(value) { this._displayObject.position.x = value}

  /**
   * the Y position of the entity.
   * @type {Number}
   */
  get y() { return this._displayObject.position.y }
  set y(value) { this._displayObject.position.y = value}

  /**
   * The position of the entity.
   * @type {Point}
   */
  get position() { return this._displayObject.position }
  set position(value) { this._displayObject.position = value}

  /**
   * The scale of the entity.
   * @type {Point}
   */
  get scale() { return this._displayObject.scale }
  set scale(value) { this._displayObject.scale = value}

  /**
   * The pivot of the entity.
   * @type {Point}
   */
  get pivot() { return this._displayObject.pivot }
  set pivot(value) { this._displayObject.pivot = value}

  /**
   * The skew of the entity.
   * @type {Point}
   */
  get skew() { return this._displayObject.skew }
  set skew(value) { this._displayObject.skew = value}

  /**
   * The rotation of the entity (in radians).
   * @type {Number}
   */
  get rotation() { return this._displayObject.rotation }
  set rotation(value) { this._displayObject.rotation = value}

  /**
   * The object mask.
   * @type {PIXI.DisplayObject}
   */
  get mask() { return this._displayObject.mask }
  set mask(value) { this._displayObject.mask = value}

  /**
   * The tint color of the entity. Set is as a hexadecimal number.
   * @type {Number}
   */
  get tint() { return this._displayObject.tint }
  set tint(value) { this._displayObject.tint = value}

  /**
   * Entity's filter array.
   * @type {Array}
   */
  get filters() { return this._displayObject.filters }
  set filters(value) { this._displayObject.filters = value}

  /**
   * Initialize function, called in the constructor.
   */
  initialize() {}

  /**
   * Destroys the entity. In general, you should not call this method directly
   * and let the engine call it for you.
   */
  destroy() {
    this._displayObject.destroy()
  }

  /**
   * Sets a batch of variables.
   *
   * Example:
   *
   *     scene.addEntity(MyEntity)
   *          .configure({x:50, y:50, rotation: Math.PI/2})
   *
   * @param {Object} config - The dictionary of variables and their values.
   */
  configure(config) {
    Object.assign(this, config)
  }

  /**
   * Called automatically by the engine every tick. If you override this 
   * method, make sure to call `super.update` 
   *
   * @param {Number} delta - The elapsed time.
   */
  update(delta) {
    for (let name in this._behaviors) {
      this._behaviors[name].update(delta)
    }
  }

  /**
   * Adds a behavior to this entity. Prefer to pass a class instead of an 
   * object.
   *
   * @param {Behavior} behavior - The behavior class of instance.
   * @return {Behavior} The behavior instance.
   */
  addBehavior(behavior) {
    behavior = tryToInstantiate(behavior, this.game, this.scene, this)

    if (!behavior) {
      throw new Error(`You must provide a behavior.`)
    }

    if (!behavior.name) {
      throw new Error(`Trying to add a behavior without a name.`)
    }

    if (this._behaviors[behavior.name]) {
      throw new Error(`Trying to add a behavior with the same name of one `+
                      `already registered.`)
    }

    this._behaviors[behavior.name] = behavior
  }

  /**
   * Removes a behavior by instance of name.
   *
   * @param {Behavior|string} behaviorOrName - The behavior instance or its 
  *         name.
   */
  removeBehavior(behaviorOrName) {
    if (!behaviorOrName) {
      throw new Error(`You must provide a behavior or a behavior name to `+
                      `remove it from Entity.`)
    }

    // remove the behavior by key
    if (typeof behaviorOrName === 'string') {
      delete this._behaviors[behaviorOrName]

    // remove behavior by object
    } else {
      let behaviors = this._behaviors
      let names = Object.keys(behaviors)
      let name = names.find(key => behaviors[key] === behaviorOrName)

      if (name) delete this._behaviors[name]
    }
  }

  /**
   * Verify if this entity has an behavior by its name.
   *
   * @param {String} behaviorName - The name of the behavior.
   * @return {Boolean} Whether this entity has the behavior or not.
   */
  hasBehavior(behaviorName) {
    return !!this._behaviors[behaviorName]
  }

}
