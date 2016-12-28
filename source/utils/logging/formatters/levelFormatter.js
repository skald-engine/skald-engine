/**
 * Simply adds the level information on the message.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 * @return {String} The same string of the input.
 */
export default function levelFormatter(message, level) {
  return `[${level.toUpperCase()}] ${message}`
}