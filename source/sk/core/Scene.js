import EventEmitter from 'sk/core/EventEmitter'
import Game from 'sk/Game'

const DEFAULT_LAYER = '~default'

export default class Scene extends EventEmitter {

  constructor(game, layers, systems, eventSheets) {
    super()

    // Inserted by the `sk.scene` function:
    // - _name
    // - _$layers
    // - _$systems
    // - _$eventSheets

    this._game = game
    this._world = new PIXI.Container()
    this._entities = []
    this._layers = layers
    this._systems = systems
    this._eventSheets = eventSheets

    this._mapSystemToEntities = {}
    for (let i=0; i<this._$systems; i++) {
      this._mapSystemToEntities[this._$systems[i]] = []
    }

    this._layers[DEFAULT_LAYER] = new PIXI.Container()
    for (let k in this._layers) { this._world.addChild(this._layers[k]) }
    for (let k in this._systems) { this._systems[k]._scene = this }
    for (let k in this._eventSheets) { this._eventSheets[k]._scene = this }

    this.initialize()
  }

  /**
   * The scene name. Readonly.
   * @type {String}
   */
  get name() { return this._name }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The scene general container. Readonly.
   * @type {PIXI.Container}
   */
  get world() { return this._world }

  /**
   * The scene layer objects. Readonly.
   * @type {Object}
   */
  get layers() { return this._layers }

  /**
   * The scene system objects. Readonly.
   * @type {Object}
   */
  get systems() { return this._systems }

  /**
   * The scene event sheets objects. Readonly.
   * @type {Object}
   */
  get eventSheets() { return this._eventSheets }

  /**
   * The list of user defined layers. Readonly.
   * @type {Array<String>}
   */
  get $layers() { return this._$layers }

  /**
   * The list of user defined systems. Readonly.
   * @type {Array<String>}
   */
  get $systems() { return this._$systems }

  /**
   * The list of user defined eventSheets. Readonly.
   * @type {Array<String>}
   */
  get $eventSheets() { return this._$eventSheets }

  /**
   * Initialize function.
   */
  initialize() {}

  /**
   * Enter function, called when the scene enters the canvas.
   */
  enter() {}

  /**
   * Start function, called when the transition ends and the scene starts
   * working.
   */
  start() {}

  /**
   * Pause function, called when the engine is paused (e.g, when the game loses
   * focus or when its paused manually).
   */
  pause() {}

  /**
   * Resume function, called when the engine resumes after a pause.
   */
  resume() {}

  /**
   * Called every tick the scene is running.
   */
  update() {}

  /**
   * Stop function, called when the scene starts a transition to leave the 
   * canvas.
   */
  stop() {}

  /**
   * Called when the scene leaves the canvas.
   */
  leave() {}

  /**
   * Called when the scene is destroyed.
   */
  destroy() {}


  /**
   * Adds an entity to the scene.
   *
   * @param {String} entityName - The entity ID.
   * @param {String} layerName - The layer name.
   */
  addEntity(entity, layerName) {
    // Uses default layer if layer is not provided
    layerName = layerName||DEFAULT_LAYER

    // Creates the entity
    if (typeof entity === 'string') {
      entity = this.game.create.entity(entity)
    }

    // Validate layer name 
    let layer = this._layers[layerName]
    if (!layer) {
      throw new Error(`Invalid layer "${layerName}".`)
    }

    // Add entity to the system-entity map
    for (let key in this._systems) {
      if (this._systems[key].check(entity)) {
        this._mapSystemToEntities[key].push(entity)
      }
    }

    // Add layer info to the entity
    entity.$layer = layerName

    // Add entity to the layer
    layer.addChild(entity.display)

    // Add entity to the general list
    this._entities.push(entity)

    // Return the entity
    return entity
  }

  /**
   * Removes an entity from the scene.
   *
   * @param {Entity} entity - The entity object.
   */
  removeEntity(entity) {
    let layer = this._layers[entity.$layer]
    layer.removeChild(entity.display)
    this._entities.splice(this._entities.indexOf(entity))

    for (let key in this._systems) {
      if (this._systems[key].check(entity)) {
        let list = this._mapSystemToEntities[key]
        list.splice(list.indexOf(entity))
      }
    }
  }

  /**
   * Adds a static display object to the scene.
   *
   * @param {PIXI.DisplayObject} displayObject - The display object.
   * @param {String} [layerName] - The layer.
   * @return {PIXI.DisplayObject} The input display object.
   */
  addStatic(displayObject, layerName) {
    // Uses default layer if layer is not provided
    layerName = layerName||DEFAULT_LAYER

    // Create the display object if needed
    if (typeof displayObject === 'string') {
      displayObject = this.game.create.displayObject(displayObject)
    }

    // Validate layer name 
    let layer = this._layers[layerName]
    if (!layer) {
      throw new Error(`Invalid layer "${layerName}".`)
    }

    // Add layer info to the entity
    displayObject.$layer = layerName

    // Add entity to the layer
    layer.addChild(displayObject)

    // Return the entity
    return displayObject
  }

  /**
   * Removes a static texture
   */
  removeStatic(displayObject) {
    let layer = this._layers[displayObject.$layer]
    layer.removeChild(displayObject)
  }
}