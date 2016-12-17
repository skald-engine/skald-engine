import * as handlers from 'utils/logging/handlers'
import * as formatters from 'utils/logging/formatters'
import Logger from 'utils/logging/Logger'

export {Logger, handlers, formatters}

/**
 * Register a logger formatter. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the formatter.
 * @param {Function} formatter - The formatter function.
 */
export function registerFormatter(name, formatter) {
  if (Logger._formatters[name]) {
    console.warn(`Formatter "${name}" beign replaced.`)
  }

  Logger._formatters[name] = formatter
}

/**
 * Register a logger handler. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
export function registerHandler(name, handler) {
  if (Logger._handlers[name]) {
    console.warn(`Handler "${name}" beign replaced.`)
  }

  Logger._handlers[name] = handler
}
