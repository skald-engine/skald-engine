const LOGGER_LEVEL = require('sk/constants').LOGGER_LEVEL
const isFunction = require('sk/utils').isFunction
const loggerHandlers = require('sk/engine').loggerHandlers
const loggerFormatters = require('sk/engine').loggerFormatters

/**
 * Logger utility class provide a relatively flexible logging system for the 
 * Skald engine and its games. A same have a default logger instance via 
 * `game.log`.
 * 
 * The Logger class uses a fixed list of levels (which can be accessed by 
 * `skald.LOGGER_LEVEL`) of different priorities. Starting from the lowest 
 * priority level, we can describe the levels as follows:
 *
 * - **TRACE**: for detailed debug info, usually used for debugging the engine
 *   internals. Notice that, enabling this level may impact the performance of
 *   the game.
 * - **DEBUG**: used general for debug information.
 * - **INFO**: for messages that highlight the progress of the engine or game.
 *   You may use that as confirmation that everything is running as expected.
 * - **WARN**: used for possible harmful situations, e.g., when memory space is
 *   low.
 * - **ERROR**: for error events that might sill allow the application to 
 *   continue running.
 * - **FALTAL**: usually used before a `throw`, thus, used to log errors that 
 *   will lead the game to abort.
 *
 * You can setup the logging level as:
 *
 *     let logger = new skald.utils.logging.Logger()
 *     logger.level = skald.LOGGER_LEVEL.INFO
 *
 * with this, all messages with INFO priority or hight will be logged, while 
 * TRACE and DEBUG messages will be discarded. By default, the logger operates
 * within a **WARN** level.
 *
 * Internally, Logger uses a *formatter* function to filter or insert more 
 * information into the logged message, and a *handler* function to transport
 * the formatted message to its final destination (e.g., the console or a 
 * file).
 *
 * A formatter must have the following signature:
 *
 *     function sampleFormatter(message, level) {}
 *
 * returning the processed message. By default, Logger uses the 
 * `simpleFormatter` as default formatter, which simply returns the incoming 
 * message without any processing.
 *
 * A handler have same signature of the formatter:
 *
 *     function sampleHandler(message, level) {}
 *
 * the difference is that handler won't return anything, but it will transport
 * the incoming message to its final container, such as the console, a file, or
 * a DOM element. Logger uses the `consoleHandler` as default handler, which
 * prints the message in the browser or node console.
 *
 * Formatters and handlers may be registered into the Skald engine via the 
 * following helper functions:
 *
 *     sk.engine.registerFormatter('myFormatter', sampleFormatter)
 *     // and
 *     sk.engine.registerHandler('myHandler', sampleHandler)
 *
 * With the custom formatter and handler registered, you may pass its name to 
 * the Logger, which will lookup the registry for the proper function, for 
 * example:
 *
 *     logger.setFormatter('myFormatter')
 *     // and
 *     logger.setHandler('myHandler')
 * 
 * This is specially useful to set custom formatters and handlers using the 
 * game configuration parameter.
 */
class Logger {
  constructor() {
    /** List of levels, used to check priorities. */
    this._levels = LOGGER_LEVEL.values()

    /** Current level priority, chached to avoid multiple lookups.  */
    this._levelPriority = null

    /** Current level name, accordingly to the `LOGGER_LEVEL` enum. */
    this._level = null

    /** Current formatter function. */
    this._formatter = loggerFormatters.level

    /** Current handler function. */
    this._handler = loggerHandlers.console
  }

  /**
   * Current logger level, must be one value from `LOGGER_LEVEL` enum. If you
   * set this variable to an invalid value, it won't be changed.
   */
  get level() { return this._level }
  set level(level) {
    if (!LOGGER_LEVEL(level)) return

    this._level = level
    this._levelPriority = this._levels.indexOf(level)
  }

  /**
   * Set the formatter function. You may provide the formatter name registered
   * via `skald.utils.logging.registerFormatter` or the function itself.
   *
   * @param {String|Function} formatterOrName - formatter name or function.
   * @throws {Error} if formatter is not a function or a registered formatter
   *         name.
   */
  setFormatter(formatterOrName) {
    if (isFunction(formatterOrName)) {
      this._formatter = formatterOrName
    
    } else if (loggerFormatters[formatterOrName]) {
      this._formatter = loggerFormatters[formatterOrName]
    
    } else {
      throw new Error(`Invalid formatter "${formatterOrName}". `+
                      `Please provide a function or a formatterOrName ID.`)
    }
  }

  /**
   * Set the handler function. You may provide the handler name registered
   * via `skald.utils.logging.registerHandler` or the function itself.
   *
   * @param {String|Function} handlerOrName - handler name or function.
   * @throws {Error} if handler is not a function or a registered handler
   *         name.
   */
  setHandler(handlerOrName) {
    if (isFunction(handlerOrName)) {
      this._handler = handlerOrName
    
    } else if (loggerHandlers[handlerOrName]) {
      this._handler = loggerHandlers[handlerOrName]
    
    } else {
      throw new Error(`Invalid handler "${handlerOrName}". `+
                      `Please provide a function or a handler ID.`)
    }
  }

  /**
   * Log the input message. This method calls the formatter and the logging 
   * handler.
   *
   * @param {LOGGER_LEVEL} level - The message level.
   * @param {String} message - The message to be logged.
   */
  log(level, message) {
    let weight = this._levels.indexOf(level)

    if (typeof weight !== undefined && weight >= this._levelPriority) {
      this._handler(this._formatter(message, level), level)
    }
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.TRACE, message)`
   *
   * @param {String} message - The message to be logged.
   */
  trace(message) {
    this.log(LOGGER_LEVEL.TRACE, message)
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.DEBUG, message)`
   *
   * @param {String} message - The message to be logged.
   */
  debug(message) {
    this.log(LOGGER_LEVEL.DEBUG, message)
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.INFO, message)`
   *
   * @param {String} message - The message to be logged.
   */
  info(message) {
    this.log(LOGGER_LEVEL.INFO, message)
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.WARN, message)`
   *
   * @param {String} message - The message to be logged.
   */
  warn(message) {
    this.log(LOGGER_LEVEL.WARN, message)
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.ERROR, message)`
   *
   * @param {String} message - The message to be logged.
   */
  error(message) {
    this.log(LOGGER_LEVEL.ERROR, message)
  }

  /**
   * Shortcut for `logger.log(LOGGER_LEVEL.FATAL, message)`
   *
   * @param {String} message - The message to be logged.
   */
  fatal(message) {
    this.log(LOGGER_LEVEL.FATAL, message)
  }
}


module.exports = Logger