import * as $ from 'sk/$'
import EventEmitter from 'sk/core/EventEmitter'

const DEFAULT_LAYER = '~DEFAULT~'

export default class Scene extends EventEmitter {

  constructor(game) {
    super()

    if (!game) {
      throw new Error(`Scene must receive a game instance during the `+
                      `instantiation.`)
    }

    this._game = game
    this._world = new PIXI.Container()
    this._entities = []
    this._statics = []
    this._layers = {}
    this._eventSheets = {}
    this._systems = {}

    // Auxiliary list to avoid repeated lookups.
    this._mapSystemToEntities = {}
    this._mapLayerToEntities = {}
    this._mapTagToEntities = {}
    this._mapClassToEntities = {}
    this._mapComponentToEntities = {}

    this.addLayer(DEFAULT_LAYER)

    this.initialize()
  }


  get game() { return this._game }
  get world() { return this._world }
  get layers() { return Object.values(this._layers) }
  get systems() { return Object.values(this._systems) }
  get eventSheets() { return Object.values(this._eventSheets) }

  initialize() {}
  enter() {}
  start() {}
  pause() {}
  resume() {}
  update(delta) {}
  stop() {}
  leave() {}
  destroy() {}

  _addToMap(map, key, obj) {
    if (!map[key]) {
      map[key] = []
    }
    map[key].push(obj)
  }
  _addToMaps(entity) {
    // Class to Entity map
    let classId = entity._$classId
    this._addToMap(this._mapClassToEntities, classId, entity)

    // Layer to Entity map
    let layer = entity._$layer
    this._addToMap(this._mapLayerToEntities, layer, entity)

    // System to Entity map
    for (let key in this._systems) {
      if (this._systems[key].check(entity)) {
        this._addToMap(this._mapSystemToEntities, key, entity)
      }
    }
    
    // Tag to Entity map
    let tags = entity.tags
    for (let i=0; i<tags.length; i++) {
      this._addToMap(this._mapTagToEntities, tags[i], entity)
    }

    // Component to Entity map
    let components = entity.components
    for (let i=0; i<components.length; i++) {
      let id = components[i]._$classId
      this._addToMap(this._mapComponentToEntities, id, entity)
    }
  }
  _removeFromMaps(entity) {

    for (let key in this._systems) {
      if (this._systems[key].check(entity)) {
        let list = this._mapSystemToEntities[key]
        list.splice(list.indexOf(entity))
      }
    }

    let map

    // Class to Entity map
    let classId = entity._$classId
    map = this._mapClassToEntities[classId]
    if (map) {
      map.splice(map.indexOf(entity), 1)
    }

    // Layer to Entity map
    let layer = entity._$layer
    map = this._mapLayerToEntities[layer]
    if (map) {
      map.splice(map.indexOf(entity), 1)
    }

    // System to Entity map
    for (let key in this._systems) {
      map = this._mapSystemToEntities[key]
      if (map) {
        map.splice(map.indexOf(entity), 1)
      }
    }
    
    // Tag to Entity map
    let tags = entity.tags
    for (let i=0; i<tags.length; i++) {
      map = this._mapTagToEntities[tags[i]]
      if (map) {
        map.splice(map.indexOf(entity), 1)
      }
    }

    // Component to Entity map
    let components = entity.components
    for (let i=0; i<components.length; i++) {
      map = this._mapComponentToEntities[components[i]._$classId]
      if (map) {
        map.splice(map.indexOf(entity), 1)
      }
    }
  }

  addEntity(entity, layerName=DEFAULT_LAYER) {
    let layer = this._layers[layerName]

    // Error if invalid layer
    if (!layer) {
      throw new Error(`Layer "${layerName}" could not be found.`)
    }

    // Verify if object is already added
    if (entity._$layer) {
      this.removeEntity(entity)
    }

    // Register
    entity._$layer = layerName
    entity._$game = this.game
    entity._$scene = this
    this._entities.push(entity)
    layer.addChild(entity.display)

    // Add to maps
    this._addToMaps(entity)

    return entity
  }
  removeEntity(entity) {
    this._removeFromMaps(entity)

    if (entity._$layer) {
      let layer = this._layers[entity._$layer]
      layer.removeChild(entity.display)
    }
    this._entities.splice(this._entities.indexOf(entity), 1)
  }
  getEntityBySystem(system) {}
  getEntityByComponent(system) {}
  getEntityByClass(system) {}
  getEntityByTag(system) {}
  getEntityByLayer(system) {}

  addStatic(displayObject, layerName=DEFAULT_LAYER) {
    let layer = this._layers[layerName]

    // Error if invalid layer
    if (!layer) {
      throw new Error(`Layer "${layerName}" could not be found.`)
    }

    // Verify if object is already added
    if (displayObject._$layer) {
      this.removeStatic(displayObject)
    }

    // Register
    displayObject._$layer = layerName
    this._statics.push(displayObject)
    layer.addChild(displayObject)

    return displayObject
  }
  removeStatic(displayObject) {
    if (displayObject._$layer) {
      let layer = this._layers[displayObject._$layer]
      layer.removeChild(displayObject)
    }

    this._statics.splice(this._statics.indexOf(displayObject), 1)
  }

  addLayer(name, layer) {
    // Error if duplicated layer
    if (this._layers[name]) {
      throw new Error(`Duplicated layer name "${name}".`)
    }

    // Create default container if there is no layer
    if (!layer) {
      layer = new PIXI.Container()
    }

    // Register layer
    this._layers[name] = layer
    this._world.addChild(layer)

    return layer
  }
  getLayer(name) {
    return this._layers[name]
  }

  addSystem(system) {
    let id = $.getClassId(system)

    // Error if duplicated system
    if (this._systems[id]) {
      throw new Error(`Trying to add a duplicated system!`)
    }

    // Setup system
    system.setup(this.game, this)

    // Register
    this._systems[id] = system

    return system
  }
  addEventSheet(eventSheet) {
    let id = $.getClassId(eventSheet)

    // Error if duplicated eventSheet
    if (this._eventSheets[id]) {
      throw new Error(`Trying to add a duplicated event sheet!`)
    }

    // Setup eventSheet
    eventSheet.setup(this.game, this)

    // Register
    this._eventSheets[id] = eventSheet

    return eventSheet
  }

  _update(delta) {}

}