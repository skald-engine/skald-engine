/**
 * Dict of logger formatters.
 */
export let loggerFormatters = {}

/**
 * Register a logger formatter. If the format is already registered, it will be
 * replaced and a warn will be printed in the console.
 *
 * @param {String} name - The ID of the formatter.
 * @param {Function} formatter - The formatter function.
 */
export function registerLoggerFormatter(name, formatter) {
  if (loggerFormatters[name]) {
    console.warn(`Formatter "${name}" beign replaced.`)
  }

  loggerFormatters[name] = formatter
}