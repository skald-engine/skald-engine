import * as utils from 'utils'
import * as transitions from 'transitions'
import * as audio from 'audio'

export {utils, transitions, audio}
export * from 'core'


// Initialize
// Register formatters and handlers
utils.logging.registerFormatter('simple', utils.logging.formatters.simpleFormatter)
utils.logging.registerFormatter('level', utils.logging.formatters.levelFormatter)
utils.logging.registerFormatter('detailed', utils.logging.formatters.detailedFormatter)
utils.logging.registerHandler('console', utils.logging.handlers.consoleHandler)
utils.logging.registerHandler('dom', utils.logging.handlers.domHandler)
utils.logging.registerHandler('file', utils.logging.handlers.fileHandler)


global.sk = exports
global.skald = exports