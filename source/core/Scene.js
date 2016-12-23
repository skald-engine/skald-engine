import EventEmitter from 'core/EventEmitter'
import Entity from 'core/Entity'
import EventSheet from 'core/EventSheet'
import Game from 'core/Game'
import {tryToInstantiate} from 'utils'

const DEFAULT_LAYER = '~default'

export default class Scene extends EventEmitter {
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

  get game() { return this._game }
  get world() { return this._world }

  initialize() {}

  enter() {}
  start() {}
  stop() {}
  leave() {}

  preUpadte(delta) {}
  update(delta) {}
  postUpdate(delta) {}

  preDraw() {}
  draw() {}



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

  getEntitiesByLayer(layerName) {
    let entities = this._mapLayerToEntity[layerName]
    return entities && Array.from(entities) || []
  }
  getEntitiesByTag(tag) {
    let entities = this._mapTagToEntity[tag]
    return entities && Array.from(entities) || []
  }

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

  removeEventSheet(eventSheet) {
    if (!eventSheet) {
      throw new Error(`Trying to remove an invalid event sheet.`)
    }

    eventSheet.leave()
    this._eventSheets.splice(this._eventSheets.indexOf(eventSheet), 1)
  }
}