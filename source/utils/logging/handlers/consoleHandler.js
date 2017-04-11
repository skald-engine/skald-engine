import {LOGGER_LEVEL} from 'globals_/constants'

/**
 * Prints the message to the console.
 *
 * @param {String} message - The message string.
 * @param {LOGGER_LEVEL} level - The logger level.
 */
export default function consoleHandler(message, level) {
  switch (level) {
    case LOGGER_LEVEL.WARN:
      console.warn(message)
      break

    case LOGGER_LEVEL.ERROR:
      console.error(message)
      break

    default:
      console.log(message)
      break
    }
  }