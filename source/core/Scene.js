import EventEmitter from 'core/EventEmitter'
import Entity from 'core/Entity'
import EventSheet from 'core/EventSheet'
import Game from 'core/Game'
import {tryToInstantiate} from 'utils'

const DEFAULT_LAYER = '~default'


/**
 * Scene class is the base container for games. Scenes are independent parts of
 * the game, like a menu, a score screen, or the level itself. In the scene you
 * can:
 *
 * - *Add or remove layers*.
 * - *Add, remove or get entities*.
 * - *Add or remove event sheets*.
 *
 * Layers are simple containers stacked to help you organize the entities in 
 * the screen. They are totally optional and may be completely ignored if you
 * want.
 *
 * When you add entities to the scene, they will be organized per layer and per
 * tag. So if you need to get a set of entities, you may use 
 * `getEntitiesByLayer` or `getEntitiesByTag`. Notice that tags are defined in
 * the {@link Entity} object.
 *
 * Event sheets helps you to organize the game logic by providing a direct 
 * interface to the scene events. You may add multiple event sheets in the 
 * scene and also share the same sheet with other scenes.
 *
 * When creating your own scene, you may use the `initialize()` method to put
 * all object creation logic. For example:
 *
 *     class MyScene extends skald.Scene {
 *       initialize() {
 *         this.addLayer('background')
 *         this.addEntity(MyEntity, 'background')
 *       }
 *     }
 *
 * You may override other useful methods too:
 *
 * - **start**: called by the engine after the scene has been played in the 
 *   director (via `director.play`) and the transition (if any) has ended. This
 *   is when the scene really starts to play.
 * - **stop**: called if this is the current scene and you just called 
 *   `director.play` to replace it. Notice that, if you are playing a 
 *   transition to change scenes, this scene will sill be visible until the
 *   transition ends.
 * - **update**: called every tick. Give preference to the event sheets instead
 *   of using this method.
 * - **destroy**: called after the scene has been removed from the director. 
 *   You may use it to clean things up.
 *
 * Check it out the remaining of the documentation to see more scene methods. 
 */
export default class Scene extends EventEmitter {

  /**
   * @param {Game} game - The game instance
   */
  constructor(game) {
    super()

    if (!game || !(game instanceof Game)) {
      return new TypeError(
        `Trying to instantiate a Scene without an instance of sk.Game.`
      )
    }
    
    this._game = game
    this._world = new PIXI.Container()
    this._layers = {}
    this._entities = new Set()
    this._eventSheets = []
    this._mapLayerToEntity = {}
    this._mapTagToEntity = {}

    this.addLayer(DEFAULT_LAYER)

    this.initialize()
  }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * The PIXI container that holds all elements in this scene.
   * @type {PIXI.Container}
   */
  get world() { return this._world }


  /**
   * The initialization code of the scene should be put here. This method is
   * called directly by the constructor during the instantiation of the scene,
   * so you don't have to override the constructor itself.
   */
  initialize() {}

  /**
   * Called by the director when the scene enters the director (before the 
   * transition starts).
   */
  enter() {}

  /**
   * This method is called by the director after you play this scene and the 
   * transition just finished. 
   */
  start() {}

  /**
   * Called when this is the current scene and you replace it in the director.
   * This method is called before the transition starts.
   */
  stop() {}

  /**
   * Called when the transition finishes and the scene leaves the game.
   */
  leave() {}

  /**
   * Called at the pre update phase.
   *
   * @param {Number} delta - The elapsed time.
   */
  preUpadte(delta) {}

  /**
   * Called at the update phase.
   *
   * @param {Number} delta - The elapsed time.
   */
  update(delta) {}

  /**
   * Called at the post update phase.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {}


  /**
   * Called before the engine draws.
   */
  preDraw() {}

  /**
   * Called after the engine draws.
   */
  draw() {}

  /**
   * Called if this scene were instantiated by the director and the scene has
   * left the director.
   */
  destroy() {}


  /**
   * Adds a new layer in the top of the stack of this scene. The layer is 
   * identified by an unique name. If other scene has been registered with the
   * same name, a message will be logged and the new layer will be ignored.
   *
   * @param {String} layerName - The name of the layer.
   * @return {PIXI.Container} The PIXI object representing the layer.
   */
  addLayer(layerName) {
    if (this._layers[layerName]) {
      this.game.log.error(`Trying to add layer already in scene: "${layerName}".`)
      return
    }

    let layer = new PIXI.Container()
    this._layers[layerName] = layer
    this._mapLayerToEntity[layerName] = new Set()
    this._world.addChild(layer)

    return layer
  }

  /**
   * Remove a layer from the scene and all entities that are part of it.
   *
   * @param {String} layerName - The name of the layer.
   */
  removeLayer(layerName) {
    if (!this._layers[layerName]) {
      this.game.log.error(`Trying to remove a non-existing layer "${layerName}".`)
      return
    }

    // removes entities attached to this layer
    let layer = this._layers[layerName]
    let entities = this._mapLayerToEntity[layerName]

    for (let entity of entities) {
      let tags = entity.tags

      this._entities.delete(entity)

      for (let j=0; j<tags.length; j++) {
        let tag = tags[j]
        let entities = this._mapTagToEntity[tag]
        if (entities) entities.delete(entity)
      }
    }

    // removes the layer
    delete this._layers[layerName]
    delete this._mapLayerToEntity[layerName]
    this._world.removeChild(layer)
  }

  /**
   * Adds an entity to the scene.
   *
   * You may provide a class (which must be inherit from `skald.Entity`) or 
   * an instance. If you provide a class, this method will instantiate the 
   * object for you. Give the preference to the class.
   *
   * Provide a layer name to add the new entity to the specified layer.
   *
   * Usage example:
   *
   *     initialize() {
   *       this.addEntity(MyEntity, 'layer-background')
   *     }
   *
   * @param {Entity} entity - A class or an entity object.
   * @param {String} [layerName] - The name of the layer in which the entity 
   *        will be added.
   * @return {Entity} The entity added.
   */
  addEntity(entity, layerName) {
    entity = tryToInstantiate(entity, this.game, this)

    layerName = layerName || DEFAULT_LAYER
    let layer = this._layers[layerName]
    let tags = entity.tags


    if (!entity) {
      throw new Error(`You must provide an entity.`)
    }

    if (!(entity instanceof Entity)) {
      throw new Error(`You must provide an instance of sk.Entity or of one `+
                      `of its subclasses.`)
    }

    if (!layer) {
      throw new Error(`Trying to add an entity to an invalid layer "${layerName}".`)
    }

    // add entity to container
    layer.addChild(entity.displayObject)

    // full entity list
    this._entities.add(entity)

    // // layer to entity
    this._mapLayerToEntity[layerName].add(entity)

    // tag to entity
    for (var i=0; i<tags.length; i++) {
      let tag = tags[i]

      let entities = this._mapTagToEntity[tag]
      if (!entities) {
        this._mapTagToEntity[tag] = entities = new Set()
      }

      entities.add(entity)      
    }

    return entity
  }
  
  /**
   * Removes an entity from the scene, if it is added to a layer, you must 
   * provide it too.
   * 
   * @param {Entity} entity - The entity instance.
   * @param {String} [layerName] - The name of the layer in which the entity 
   *        is living.
   */
  removeEntity(entity, layerName) {
    if (!entity) {
      throw new Error(`Trying to remove an invalid entity.`)
    }

    layerName = layerName || DEFAULT_LAYER
    let layer = this._layers[layerName]
    let tags = entity.tags

    if (!layer) {
      throw new Error(`Trying to remove an entity from an invalid layer "${layerName}".`)
    }

    layer.removeChild(entity.displayObject)
    this._entities.delete(entity)
    this._mapLayerToEntity[layerName].delete(entity)

    for (var i=0; i<tags.length; i++) {
      let tag = tags[i]

      let entities = this._mapTagToEntity[tag]
      if (entities) entities.delete(entity)
    }
  }

  /**
   * Returns an array of all entities living in the provided layer. 
   *
   * @param {String} [layerName] - The name of the layer.
   * @return {Array} A list of entities.
   */
  getEntitiesByLayer(layerName) {
    let entities = this._mapLayerToEntity[layerName]
    return entities && Array.from(entities) || []
  }

  /**
   * Return an array of all entities with the provided tag. Notice that, you 
   * must set the tag on the Entity.
   *
   * @param {String} tag - The tag of the layer.
   * @return {Array} A list of entities.
   */
  getEntitiesByTag(tag) {
    let entities = this._mapTagToEntity[tag]
    return entities && Array.from(entities) || []
  }

  /**
   * Adds an event sheet to this scene.
   *
   * @param {EventSheet} eventSheet - A class of an event sheet object.
   * @return {EventSheet} The event sheet that has been added.
   */
  addEventSheet(eventSheet) {
    eventSheet = tryToInstantiate(eventSheet, this.game, this)

    if (!eventSheet) {
      throw new Error(`You must provide an event sheet.`)
    }

    if (!(eventSheet instanceof EventSheet)) {
      throw new Error(`You must provide an instance of sk.EventSheet or of `+
                      `one of its subclasses.`)
    }

    // add entity to container
    this._eventSheets.push(eventSheet)

    return eventSheet
  }

  /**
   * Remove an event sheet from this scene.
   *
   * @param {EventSheet} eventSheet - The event sheet object to be removed.
   */
  removeEventSheet(eventSheet) {
    if (!eventSheet) {
      throw new Error(`Trying to remove an invalid event sheet.`)
    }

    eventSheet.leave()
    this._eventSheets.splice(this._eventSheets.indexOf(eventSheet), 1)
  }
}