import * as $ from 'sk/$'

/**
 * Register a logger handler. If the format is already registered, it will 
 * throw an error.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
export function registerLoggerHandler(name, handler) {
  if ($.loggerHandlers[name]) {
    throw new Error(`Logging handler "${name}" already registered.`)
  }

  $.loggerHandlers[name] = handler
}