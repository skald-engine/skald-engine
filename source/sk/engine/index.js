const stores = require('sk/engine/stores')
const registerLoggerFormatter = require('sk/engine/registerLoggerFormatter')
const registerLoggerHandler = require('sk/engine/registerLoggerHandler')

module.exports = {
  loggerHandlers: stores.loggerHandlers,
  loggerFormatters: stores.loggerFormatters,
  registerLoggerFormatter,
  registerLoggerHandler
}
