import EventEmitter from 'core/EventEmitter'
import Game from 'core/Game'

export default class Scene extends EventEmitter {

  constructor(game, layers, systems, eventSheets) {
    super()

    this._game = game
    this._world = new PIXI.Container()
    this._entities = null
    this._systems = null
    this._eventSheets = null

    this.initialize()
  }

  get game() { return this._game }
  get world() { return this._world }

  initialize() {}
  enter() {}
  start() {}
  pause() {}
  resume() {}
  update() {}
  stop() {}
  leave() {}
  destroy() {}

  addEntity() {}
  removeEntity() {}
  getEntitiesById() {}
  getEntitiesByClass() {}
  getEntitiesByComponent() {}
  getEntitiesBySystem() {}
}