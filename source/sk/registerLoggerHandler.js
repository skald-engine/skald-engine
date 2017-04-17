import * as $ from 'sk/$'

/**
 * Register a logger handler. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
export function registerLoggerHandler(name, handler) {
  if ($.loggerHandlers[name]) {
    console.warn(`Handler "${name}" being replaced.`)
  }

  $.loggerHandlers[name] = handler
}