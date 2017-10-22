const sk = require('sk')

// Configure logging
{
  let formatters = sk.utils.logging.formatters
  sk.engine.registerLoggerFormatter('simple', formatters.simpleFormatter)
  sk.engine.registerLoggerFormatter('level', formatters.levelFormatter)
  sk.engine.registerLoggerFormatter('detailed', formatters.detailedFormatter)

  let handlers = sk.utils.logging.handlers
  sk.engine.registerLoggerHandler('console', handlers.consoleHandler)
  sk.engine.registerLoggerHandler('dom', handlers.domHandler)
  sk.engine.registerLoggerHandler('file', handlers.fileHandler)
}
