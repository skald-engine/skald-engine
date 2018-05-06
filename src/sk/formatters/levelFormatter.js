/**
 * Simply adds the level information on the message. Format example:
 *
 *     [DEBUG] This is a message.
 *
 * 
 * @param {String} message - The message string.
 * @param {LOGGER_LEVELS} level - The logger level.
 * @return {String} The formatted string.
 */
function levelFormatter(message, level) {
  return `[${level.toUpperCase()}] ${message}`
}

module.exports = levelFormatter