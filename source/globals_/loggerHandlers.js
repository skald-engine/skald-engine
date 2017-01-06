
/**
 * Dict of logger handlers.
 */
export let loggerHandlers = {}

/**
 * Register a logger handler. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
export function addLoggerHandler(name, handler) {
  if (loggerHandlers[name]) {
    console.warn(`Handler "${name}" beign replaced.`)
  }

  loggerHandlers[name] = handler
}
