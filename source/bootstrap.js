import * as sk from 'sk'

// Configure logging
{
  let formatters = sk.utils.logging.formatters
  sk.registerLoggerFormatter('simple', formatters.simpleFormatter)
  sk.registerLoggerFormatter('level', formatters.levelFormatter)
  sk.registerLoggerFormatter('detailed', formatters.detailedFormatter)

  let handlers = sk.utils.logging.handlers
  sk.registerLoggerHandler('console', handlers.consoleHandler)
  sk.registerLoggerHandler('dom', handlers.domHandler)
  sk.registerLoggerHandler('file', handlers.fileHandler)
}

// Configure pixi display objects
{
  let m = sk.displayObjects
  sk.registerDisplayObject('container', m.Container)
  sk.registerDisplayObject('sprite', m.Sprite)
  sk.registerDisplayObject('animatedSprite', m.AnimatedSprite)
  sk.registerDisplayObject('bitmapText', m.BitmapText)
  sk.registerDisplayObject('text', m.Text)
  sk.registerDisplayObject('graphics', m.Graphics)
}

// Configure audio systems
{
  sk.setAudioSystems([
    sk.audio.WebAudioSystem,
    sk.audio.HTML5AudioSystem
  ])
}

