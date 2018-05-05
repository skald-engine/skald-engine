const Injector = require('sk/core/Injector')

class Engine {
  constructor() {
    this.started = false
    this.injector = new Injector()

    this._profile = null
  }

  start(config={}) {
    this.started = true

    this.injector.resolve('config')
                 .load(config)

    
    this._profile = this.injector.resolve('profile')

    this._profile.begin('boot')
    this._setup()
    this._profile.end('boot')

    this._update()
  }

  destroy() {}

  _setup() {
    this._profile.begin('injector')
    this.injector.build()
    this._profile.end('injector')
    
    this._profile.begin('managers')
    this.injector.managers.forEach(x => x.setup())
    this._profile.end('managers')
    
    this._profile.begin('services')
    this.injector.services.forEach(x => x.setup())
    this._profile.end('services')
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