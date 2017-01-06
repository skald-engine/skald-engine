import * as utils from 'utils'
import * as transitions from 'transitions'
import * as audio from 'audio'
import * as globals from 'globals_'

export {utils, transitions, audio, globals}
export * from 'core'


// Initialize
// Register formatters and handlers
globals.addLoggerFormatter('simple', utils.logging.formatters.simpleFormatter)
globals.addLoggerFormatter('level', utils.logging.formatters.levelFormatter)
globals.addLoggerFormatter('detailed', utils.logging.formatters.detailedFormatter)

globals.addLoggerHandler('console', utils.logging.handlers.consoleHandler)
globals.addLoggerHandler('dom', utils.logging.handlers.domHandler)
globals.addLoggerHandler('file', utils.logging.handlers.fileHandler)

globals.setAudioSystems([
  audio.WebAudioSystem,
  audio.HTML5AudioSystem,
])


global.sk = exports
global.skald = exports