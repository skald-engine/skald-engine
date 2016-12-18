import EventEmitter from 'core/EventEmitter'

export default class Scene extends EventEmitter {
  constructor() {
    super()
    
    this._game = null
    this._world = new PIXI.Container()
  }

  get game() { return this.game }
  get world() { return this.world }

  setup(game) {
    this._game = game
  }

  enter() {}
  start() {}
  stop() {}
  leave() {}

  preUpadte(delta) {}
  update(delta) {}
  postUpdate(delta) {}

  preDraw() {}
  draw() {}
}