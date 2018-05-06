const LOGGER_LEVELS = require('sk/constants').LOGGER_LEVELS

/**
 * Prints the message to the console.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVELS} level - The logger level.
 */
function consoleHandler(message, level) {
  switch (level) {
    case LOGGER_LEVELS.WARN:
      console.warn(message)
      break

    case LOGGER_LEVELS.ERROR:
      console.error(message)
      break

    default:
      console.log(message)
      break
  }
}

module.exports = consoleHandler