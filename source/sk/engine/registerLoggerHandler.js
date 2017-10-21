const stores = require('sk/engine/stores')

/**
 * Register a logger handler. If the format is already registered, it will 
 * throw an error.
 *
 * @param {String} name - The ID of the handler.
 * @param {Function} handler - The handler function.
 */
function registerLoggerHandler(name, handler) {
  if (stores.loggerHandlers[name]) {
    throw new Error(`Logging handler "${name}" already registered.`)
  }

  stores.loggerHandlers[name] = handler
}


module.exports = registerLoggerHandler