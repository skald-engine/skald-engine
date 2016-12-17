import * as c from 'core/constants'
import isFunction from 'utils/functions/isFunction'

/**
 * Logger utility class provide a relatively flexible logging system for the 
 * Skald engine and games. 
 *
 * This logger user
 *
 * formatter goal
 * handler goal
 */
export default class Logger {
  constructor() {
    this._levels = LOGGER_LEVEL.values()

    this._levelWeight = null
    this._level = null
    this._formatter = null
    this._handler = null
  }

  get level() {
    return this._level
  }
  set level(level) {
    if (!LOGGER_LEVEL(level)) return

    this._level = level
    this._levelWeight = this._levels.indexOf(level)
  }

  get formatter() {
    return this._formatter
  }
  set formatter(formatterOrName) {
    if (isFunction(formatterOrName)) {
      this._formatter = formatterOrName
    }
    else if (Logger._formatters[formatterOrName]) {
      this._formatter = Logger._formatters[formatterOrName]
    }
    else {
      throw new Error(`Invalid formatter. Please provide a function or an ID.`)
    }
  }

  get handler() {
    this._handler
  }
  set handler(handlerOrName) {
    if (isFunction(handlerOrName)) {
      this._handler = handlerOrName
    }
    else if (Logger._handlers[handlerOrName]) {
      this._handler = Logger._handlers[handlerOrName]
    }
    else {
      throw new Error(`Invalid handler. Please provide a function or an ID.`)
    }
  }


  log(level, message) {
    let weight = this._levels.indexOf(level)

    if (weight && weight <= this._levelWeight) {
      // let formattedMessage = this._formatter(message, level)
      // this._handler(formattedMessage, level)
    }
  }
  engine(message) { this.log(c.LOGGER_LEVEL.ENGINE, message) }
  debug(message) { this.log(c.LOGGER_LEVEL.DEBUG, message) }
  info(message) { this.log(c.LOGGER_LEVEL.INFO, message) }
  warn(message) { this.log(c.LOGGER_LEVEL.WARN, message) }
  error(message) { this.log(c.LOGGER_LEVEL.ERROR, message) }

}

Logger._formatters = {}
Logger._handlers = {}