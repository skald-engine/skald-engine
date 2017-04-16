/**
 * Dict of logger handlers.
 */
export let _loggerHandlers = {}

/**
 * Register a logger handler. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
export function registerLoggerHandler(name, handler) {
  if (_loggerHandlers[name]) {
    console.warn(`Handler "${name}" being replaced.`)
  }

  _loggerHandlers[name] = handler
}