/**
 * The simple formatter just returns the pure message, without any processing.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 * @return {String} The same string of the input.
 */
function simpleFormatter(message, level) {
  return message
}


module.exports = simpleFormatter