import * as utils from 'utils'
export {utils}

export * from 'core'


// Initialize
// Register formatters and handlers
utils.logging.registerFormatter('simple', utils.logging.formatters.simpleFormatter)
utils.logging.registerHandler('console', utils.logging.handlers.consoleHandler)
utils.logging.registerHandler('dom', utils.logging.handlers.domHandler)
utils.logging.registerHandler('file', utils.logging.handlers.fileHandler)


global.sk = exports
global.skald = exports