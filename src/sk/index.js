require('sk/bootstrap')

const $ = require('sk/$')
const constants = require('sk/constants')
const shortcuts = require('sk/shortcuts')

const engine = require('sk/engine')
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
const colors = require('sk/colors')
const random = require('sk/random')
const ease = require('sk/ease')
const tween = require('sk/tween')
const particles = require('sk/particles')


module.exports.engine = engine
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
module.exports.colors = colors
module.exports.random = random
module.exports.ease = ease
module.exports.tween = tween
module.exports.particles = particles
module.exports.$ = $

module.exports = Object.assign(
  module.exports,
  constants,
  shortcuts
)
