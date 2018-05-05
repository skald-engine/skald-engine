require('sk/bootstrap')

const $ = require('sk/$')
const constants = require('sk/constants')
const shortcuts = require('sk/shortcuts')

const core = require('sk/core')
const utils = require('sk/utils')
const config = require('sk/config')
const formatters = require('sk/formatters')
const handlers = require('sk/handlers')
const managers = require('sk/managers')
const services = require('sk/services')
const middlewares = require('sk/middlewares')
const providers = require('sk/providers')
const signals = require('sk/signals')


module.exports.core = core
module.exports.utils = utils
module.exports.config = config
module.exports.formatters = formatters
module.exports.handlers = handlers
module.exports.managers = managers
module.exports.services = services
module.exports.middlewares = middlewares
module.exports.providers = providers
module.exports.signals = signals
module.exports._$ = $

module.exports = Object.assign(
  module.exports,
  constants,
  shortcuts
)
