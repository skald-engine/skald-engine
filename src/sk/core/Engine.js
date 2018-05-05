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
    // this._profile.begin('update')
    requestAnimationFrame(() => this._update())

    let injector = this.injector

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