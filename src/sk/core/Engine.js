const Injector = require('sk/core/Injector')

class Engine {
  constructor() {
    this.started = false
    this.injector = new Injector()
  }

  start(config={}) {
    this.started = true

    this.injector.resolve('config')
                 .load(config)

    this._setup()
    this._update()
  }

  destroy() {}

  _setup() {
    this.injector.build()
    this.injector.managers.forEach(x => x.setup())
    this.injector.services.forEach(x => x.setup())
  }

  _update() {
    requestAnimationFrame(() => this._update())

    let injector = this.injector

    for (let i in injector.managers) {
      injector.managers[i].preUpdate()
    }
    for (let i in injector.managers) {
      injector.managers[i].update()
    }
    for (let i in injector.managers) {
      injector.managers[i].postUpdate()
    }

    for (let i in injector.managers) {
      injector.managers[i].preDraw()
    }

    injector.resolve('renderer')
            .render(injector.resolve('stage'))

    for (let i in injector.managers) {
      injector.managers[i].postDraw()
    }
  }
}

module.exports = Engine