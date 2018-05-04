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
  sk.manager('device', managers.DeviceManager)
}

// Register services
{
  const sk = require('sk/shortcuts')
  const services = require('sk/services')

  sk.service('config', services.ConfigService)
  sk.service('logger', services.LoggerService)
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
}