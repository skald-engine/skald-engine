const stores = require('sk/engine/stores')

/**
 * Register a logger formatter. If the format is already registered, it will 
 * returns an error.
 *
 * @param {String} name - The ID of the formatter.
 * @param {Function} formatter - The formatter function.
 */
function registerLoggerFormatter(name, formatter) {
  if (stores.loggerFormatters[name]) {
    throw new Error(`Logging formatter "${name}" already registered.`)
  }

  stores.loggerFormatters[name] = formatter
}


module.exports = registerLoggerFormatter