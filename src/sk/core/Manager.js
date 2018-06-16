class Manager {
  constructor(name) {
    if (typeof name !== 'undefined') {
      const $ = require('sk/$')
      let config = $.getInjector().resolve('config')
      this._enabled = config.get(`${name}.enabled`, true)
    } else {
      this._enabled = true
    }
  }

  get enabled() { return this._enabled }
  set enabled(value) {
    let last = this._enabled
    this._enabled = !!value

    if (last != this._enabled) {
      if (this._enabled) {
        this.setup()
      } else {
        this.tearDown()
      }
    }
  }

  setup() {}
  tearDown() {}

  preUpdate() {}
  update() {}
  postUpdate() {}

  preDraw() {}
  postDraw() {}

  pause() {}
  resume() {}

  destroy() {
    this.tearDown()
  }
}

module.exports = Manager