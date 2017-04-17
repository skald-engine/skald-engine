import * as $ from 'sk/$'

/**
 * Register a logger formatter. If the format is already registered, it will 
 * returns an error.
 *
 * @param {String} name - The ID of the formatter.
 * @param {Function} formatter - The formatter function.
 */
export function registerLoggerFormatter(name, formatter) {
  if ($.loggerFormatters[name]) {
    throw new Error(`Logging formatter "${name}" already registered.`)
  }

  $.loggerFormatters[name] = formatter
}