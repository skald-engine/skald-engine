import * as g from 'globals_'
import * as utils from 'utils'

// Configuring logging
g.registerLoggerFormatter('simple', utils.logging.formatters.simpleFormatter)
g.registerLoggerFormatter('level', utils.logging.formatters.levelFormatter)
g.registerLoggerFormatter('detailed', utils.logging.formatters.detailedFormatter)

g.registerLoggerHandler('console', utils.logging.handlers.consoleHandler)
g.registerLoggerHandler('dom', utils.logging.handlers.domHandler)
g.registerLoggerHandler('file', utils.logging.handlers.fileHandler)
