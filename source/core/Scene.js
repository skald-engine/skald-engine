import EventEmitter from 'core/EventEmitter'

export default class Scene extends EventEmitter {
  constructor() {
    super()
    
    this._world = new PIXI.Container()
  }

  setup(game) {}

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