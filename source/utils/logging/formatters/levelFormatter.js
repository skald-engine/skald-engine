/**
 * Simply adds the level information on the message. Format example:
 *
 *     [DEBUG] This is a message.
 *
 * 
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 * @return {String} The formatted string.
 */
export default function levelFormatter(message, level) {
  return `[${level.toUpperCase()}] ${message}`
}