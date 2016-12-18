
export default class Manager {
  constructor() {
    this.game = null
  }

  setup(game) {
    this.game = game
  }
  
  preUpdate(delta) {}
  update(delta) {}
  postUpdate(delta) {}

  preDraw() {}
  draw() {}

  destroy() {}
}