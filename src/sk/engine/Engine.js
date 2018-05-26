const Injector = require('sk/engine/Injector')
const defaults = require('sk/config/defaults')

class Engine {
  constructor() {
    this._started = false
    this._paused = false
    this._alive = true

    this._injector = new Injector()

    this._profile = null
    this._config = null
  }

  boot() {
    const C = require('sk/constants')
    const sk = require('sk/shortcuts')
    const managers = require('sk/managers')
    const services = require('sk/services')
    const providers = require('sk/providers')
    const signals = require('sk/signals')
    const LoggerService = require('sk/services/LoggerService')
    const formatters = require('sk/formatters')
    const handlers = require('sk/handlers')
    const ResourcesService = require('sk/services/ResourcesService')
    const middlewares = require('sk/middlewares')

    // Managers
    sk.manager('time', managers.TimeManager)
    sk.manager('signals', managers.SignalsManager)
    sk.manager('display', managers.DisplayManager)
    sk.manager('views', managers.ViewsManager)
    sk.manager('keyboard', managers.KeyboardManager)
    sk.manager('mouse', managers.MouseManager)
    sk.manager('gamepads', managers.GamepadsManager)
    sk.manager('touches', managers.TouchesManager)
    sk.manager('schedule', managers.ScheduleManager)

    // Services
    sk.service('config', services.ConfigService)
    sk.service('logger', services.LoggerService)
    sk.service('device', services.DeviceService)
    sk.service('resources', services.ResourcesService)
    sk.service('profile', services.ProfileService)
    sk.service('sounds', services.SoundsService)

    // Providers
    sk.provider('renderer', providers.rendererProvider)
    sk.provider('stage', providers.stageProvider)

    // Signals
    sk.signal('resizeSignal', signals.ResizeSignal)
    sk.signal('enterFullscreenSignal', signals.EnterFullscreenSignal)
    sk.signal('leaveFullscreenSignal', signals.LeaveFullscreenSignal)
    sk.signal('enterWrongOrientationSignal', signals.EnterWrongOrientationSignal)
    sk.signal('leaveWrongOrientationSignal', signals.LeaveWrongOrientationSignal)
    sk.signal('fullscreenChangeSignal', signals.FullscreenChangeSignal)
    sk.signal('orientationChangeSignal', signals.OrientationChangeSignal)

    sk.signal('viewAddedSignal', signals.ViewAddedSignal)
    sk.signal('viewEnterSignal', signals.ViewEnterSignal)
    sk.signal('viewRemovedSignal', signals.ViewRemovedSignal)

    sk.signal('loadProgressSignal', signals.LoadProgressSignal)
    sk.signal('loadErrorSignal', signals.LoadErrorSignal)
    sk.signal('resourceLoadedSignal', signals.ResourceLoadedSignal)
    sk.signal('loadCompletedSignal', signals.LoadCompletedSignal)
    sk.signal('loadStartedSignal', signals.LoadStartedSignal)
    sk.signal('resourceUnloadedSignal', signals.ResourceUnloadedSignal)

    sk.signal('keyDownSignal', signals.KeyDownSignal)
    sk.signal('keyHoldSignal', signals.KeyHoldSignal)
    sk.signal('keyUpSignal', signals.KeyUpSignal)

    sk.signal('clickSignal', signals.ClickSignal)
    sk.signal('doubleClickSignal', signals.DoubleClickSignal)
    sk.signal('mouseDownSignal', signals.MouseDownSignal)
    sk.signal('mouseUpSignal', signals.MouseUpSignal)
    sk.signal('mouseMoveSignal', signals.MouseMoveSignal)
    sk.signal('mouseLeaveSignal', signals.MouseLeaveSignal)
    sk.signal('mouseEnterSignal', signals.MouseEnterSignal)
    sk.signal('mouseWheelSignal', signals.MouseWheelSignal)

    sk.signal('gamepadButtonDownSignal', signals.GamepadButtonDownSignal)
    sk.signal('gamepadButtonHoldSignal', signals.GamepadButtonHoldSignal)
    sk.signal('gamepadButtonUpSignal', signals.GamepadButtonUpSignal)
    sk.signal('gamepadStickMoveSignal', signals.GamepadStickMoveSignal)
    sk.signal('gamepadConnectedSignal', signals.GamepadConnectedSignal)
    sk.signal('gamepadDisconnectedSignal', signals.GamepadDisconnectedSignal)

    sk.signal('touchDownSignal', signals.TouchDownSignal)
    sk.signal('touchMoveSignal', signals.TouchMoveSignal)
    sk.signal('touchUpSignal', signals.TouchUpSignal  )

    sk.signal('updateSignal', signals.UpdateSignal)

    // Instances
    sk.instance('pixi', require('pixi.js'))

    // Logger
    LoggerService.registerFormatter('detailed', formatters.detailedFormatter)
    LoggerService.registerFormatter('level', formatters.levelFormatter)
    LoggerService.registerFormatter('simple', formatters.simpleFormatter)
    LoggerService.registerHandler('console', handlers.consoleHandler)
    LoggerService.registerHandler('dom', handlers.domHandler)

    // Resources
    ResourcesService.registerMiddleware(C.RESOURCES.RAW, middlewares.RawMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.JSON, middlewares.JsonMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.TEXTURE, middlewares.TextureMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.BITMAP_FONT, middlewares.BitmapFontMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.AUDIO, middlewares.AudioMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.AUDIO_SPRITE, middlewares.AudioSpriteMiddleware)
    ResourcesService.registerMiddleware(C.RESOURCES.SPRITE_SHEET, middlewares.SpriteSheetMiddleware)
  }

  start(config={}) {
    if (this._started) return

    this._started = true

    this._config = this._injector.resolve('config')
    this._config.load(defaults)
    this._config.load(config)

    this._profile = this._injector.resolve('profile')
    this._profile.begin('boot')
    this._setup()
    this._profile.end('boot')

    this._update()
  }

  pause() {
    if (!this._alive || !this._started || this._paused) return

    this._paused = true

    for (let i in injector._managers) {
      injector._managers[i].pause()
    }
    for (let i in injector._services) {
      injector._services[i].pause()
    }
  }

  resume() {
    if (!this._alive || !this._started || !this._paused) return

    this._paused = false

    for (let i in injector._managers) {
      injector._managers[i].resume()
    }
    for (let i in injector._services) {
      injector._services[i].resume()
    }
  }

  destroy() {
    if (!this._alive) return

    let stage = this._injector.resolve('stage')
    stage.destroy({chidren: true, texture: true, baseTexture: true})

    let renderer = this._injector.resolve('renderer')
    renderer.destroy(true)

    this._alive = false
    this._injector.destroy()

    this._injector = null
    this._profile = null
    this._config = null

    const LoggerService = require('sk/services/LoggerService')
    const ResourcesService = require('sk/services/ResourcesService')
    
    LoggerService.unregisterAll()
    ResourcesService.unregisterAll()
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
    if (!this._alive || this._paused) return
    // this._profile.begin('update')
    requestAnimationFrame(() => this._update())

    let injector = this._injector

    // this._profile.begin('preUpdate')
    for (let i in injector._managers) {
      injector._managers[i].preUpdate()
    }
    // this._profile.end('preUpdate')

    // this._profile.begin('update')
    for (let i in injector._managers) {
      injector._managers[i].update()
    }
    // this._profile.end('update')


    // this._profile.begin('postUpdate')
    for (let i in injector._managers) {
      injector._managers[i].postUpdate()
    }
    // this._profile.end('postUpdate')

    // this._profile.begin('preDraw')
    for (let i in injector._managers) {
      injector._managers[i].preDraw()
    }
    // this._profile.end('preDraw')

    // this._profile.begin('draw')
    injector.resolve('renderer')
            .render(injector.resolve('stage'))
    // this._profile.end('draw')

    // this._profile.begin('postDraw')
    for (let i in injector._managers) {
      injector._managers[i].postDraw()
    }
    // this._profile.end('postDraw')

    // this._profile.end('update')
  }
}

module.exports = Engine