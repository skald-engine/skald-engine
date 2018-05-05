const LOGGER_LEVEL = require('sk/constants').LOGGER_LEVEL
const utils = require('sk/utils')
const Service = require('sk/core/Service')

class LoggerService extends Service {
  constructor() {
    super()

    /** List of levels, used to check priorities. */
    this._levels = LOGGER_LEVEL.values()

    /** Current level priority, chached to avoid multiple lookups.  */
    this._levelPriority = null

    /** Current level name, accordingly to the `LOGGER_LEVEL` enum. */
    this._level = null

    /** Current formatter function. */
    this._formatter = null

    /** Current handler function. */
    this._handler = null
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
  set formatter(formatterOrName) {
    if (utils.isFunction(formatterOrName)) {
      this._formatter = formatterOrName
    
    } else if (LoggerService._formatters[formatterOrName]) {
      this._formatter = LoggerService._formatters[formatterOrName]
    
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
  set handler(handlerOrName) {
    if (utils.isFunction(handlerOrName)) {
      this._handler = handlerOrName
    
    } else if (LoggerService._handlers[handlerOrName]) {
      this._handler = LoggerService._handlers[handlerOrName]
    
    } else {
      throw new Error(`Invalid handler "${handlerOrName}". `+
                      `Please provide a function or a handler ID.`)
    }
  }

  /**
   * Register a logger formatter. If the format is already registered, it will 
   * returns an error.
   *
   * @param {String} name - The ID of the formatter.
   * @param {Function} formatter - The formatter function.
   */
  static registerFormatter(name, formatter) {
    if (LoggerService._formatters[name]) {
      throw new Error(`Logger formatter "${name}" already registered.`)
    }

    LoggerService._formatters[name] = formatter
  }

  /**
   * Register a logger handler. If the format is already registered, it will 
   * throw an error.
   *
   * @param {String} name - The ID of the handler.
   * @param {Function} handler - The handler function.
   */
  static registerHandler(name, handler) {
    if (LoggerService._handlers[name]) {
      throw new Error(`Logging handler "${name}" already registered.`)
    }

    LoggerService._handlers[name] = handler
  }

  setup() {
    let config = sk.inject('config')

    this.level = config.get('logger.level')
    this.handler = config.get('logger.handler')
    this.formatter = config.get('logger.formatter')
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

LoggerService._formatters = {}
LoggerService._handlers = {}

module.exports = LoggerService
