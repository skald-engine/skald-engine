import * as sk from 'sk'

// Configuring logging
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

// Configuring pixi display objects
{
  sk.registerDisplayObject('sprite', PIXI.Sprite)
}
