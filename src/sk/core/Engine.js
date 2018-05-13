const Injector = require('sk/core/Injector')
const defaults = require('sk/config/defaults')

class Engine {
  constructor() {
    this.started = false
    this._injector = new Injector()

    this._profile = null
    this._config = null
  }

  start(config={}) {
    if (this.started) return

    this.started = true

    this._config = this._injector.resolve('config')
    this._config.load(defaults)
    this._config.load(config)

    this._profile = this._injector.resolve('profile')
    this._profile.begin('boot')
    this._setup()
    this._profile.end('boot')

    this._update()
  }

  destroy() {
    this._injector.destroy()
  }

  _setup() {
    let injector = this._injector
    
    this._profile.begin('injector')
    this._injector.build()
    this._profile.end('injector')
    
    this._profile.begin('managers')
    for (let i in injector.managers) {
      injector.managers[i].setup()
    }
    this._profile.end('managers')
    
    this._profile.begin('services')
    for (let i in injector.services) {
      injector.services[i].setup()
    }
    this._profile.end('services')
    
    this._profile.begin('signals')
    for (let i in injector.signals) {
      injector.signals[i].setup()
    }
    this._profile.end('signals')
  }

  _update() {
    // this._profile.begin('update')
    requestAnimationFrame(() => this._update())

    let injector = this._injector

    // this._profile.begin('preUpdate')
    for (let i in injector.managers) {
      injector.managers[i].preUpdate()
    }
    // this._profile.end('preUpdate')

    // this._profile.begin('update')
    for (let i in injector.managers) {
      injector.managers[i].update()
    }
    // this._profile.end('update')


    // this._profile.begin('postUpdate')
    for (let i in injector.managers) {
      injector.managers[i].postUpdate()
    }
    // this._profile.end('postUpdate')

    // this._profile.begin('preDraw')
    for (let i in injector.managers) {
      injector.managers[i].preDraw()
    }
    // this._profile.end('preDraw')

    // this._profile.begin('draw')
    injector.resolve('renderer')
            .render(injector.resolve('stage'))
    // this._profile.end('draw')

    // this._profile.begin('postDraw')
    for (let i in injector.managers) {
      injector.managers[i].postDraw()
    }
    // this._profile.end('postDraw')

    // this._profile.end('update')
  }
}

module.exports = Engine