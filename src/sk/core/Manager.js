class Manager {
  constructor() {
    this._enabled = true
  }

  get enabled() { return this._enabled }
  set enabled(value) { this._enabled = !!value }

  setup() {}

  preUpdate() {}
  update() {}
  postUpdate() {}

  preDraw() {}
  postDraw() {}

  pause() {}
  resume() {}

  destroy() {}
}

module.exports = Manager