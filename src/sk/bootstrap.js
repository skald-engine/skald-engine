// Configure PIXI
{
  const pixi = require('pixi.js')
  pixi.utils.skipHello()
}

// Create our engine
{
  const $ = require('sk/$')
  $.createEngine()
}

// Register managers
{
  const sk = require('sk/shortcuts')
  const managers = require('sk/managers')

  sk.manager('time', managers.TimeManager)
  sk.manager('signals', managers.SignalsManager)
  sk.manager('display', managers.DisplayManager)
  sk.manager('views', managers.ViewsManager)
}

// Register services
{
  const sk = require('sk/shortcuts')
  const services = require('sk/services')

  sk.service('config', services.ConfigService)
  sk.service('logger', services.LoggerService)
  sk.service('device', services.DeviceService)
  sk.service('resources', services.ResourcesService)
  sk.service('profile', services.ProfileService)
}

// Register instances
{
  const sk = require('sk/shortcuts')
  const pixi = require('pixi.js')

  sk.instance('pixi', pixi)
}

// Register providers
{
  const sk = require('sk/shortcuts')
  const providers = require('sk/providers')

  sk.provider('renderer', providers.rendererProvider)
  sk.provider('stage', providers.stageProvider)
}

// Register signals
{
  const sk = require('sk/shortcuts')
  const signals = require('sk/signals')

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

  sk.signal('updateSignal', signals.UpdateSignal)
}

// Register logger handlers and formatters
{
  const LoggerService = require('sk/services/LoggerService')
  const formatters = require('sk/formatters')
  const handlers = require('sk/handlers')

  LoggerService.registerFormatter('detailed', formatters.detailedFormatter)
  LoggerService.registerFormatter('level', formatters.levelFormatter)
  LoggerService.registerFormatter('simple', formatters.simpleFormatter)

  LoggerService.registerHandler('console', handlers.consoleHandler)
  LoggerService.registerHandler('dom', handlers.domHandler)
}

// Register middlewares
{
  const C = require('sk/constants')
  const ResourcesService = require('sk/services/ResourcesService')
  const middlewares = require('sk/middlewares')

  ResourcesService.registerMiddleware(C.RESOURCES.RAW, middlewares.RawMiddleware)
  ResourcesService.registerMiddleware(C.RESOURCES.JSON, middlewares.JsonMiddleware)
  ResourcesService.registerMiddleware(C.RESOURCES.TEXTURE, middlewares.TextureMiddleware)
  ResourcesService.registerMiddleware(C.RESOURCES.BITMAP_FONT, middlewares.BitmapFontMiddleware)
}