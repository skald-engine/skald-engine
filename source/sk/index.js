const constants = require('sk/constants')
const core = require('sk/core')
const audio = require('sk/audio')
const events = require('sk/events')
const managers = require('sk/managers')
const engine = require('sk/engine')
const utils = require('sk/utils')
const config = require('sk/config')
const Game = require('sk/Game')


module.exports.Game = Game
module.exports.config = config
module.exports.utils = utils
module.exports.engine = engine
module.exports.audio = audio
module.exports.core = core
module.exports.events = events
module.exports.managers = managers

module.exports = Object.assign(
  module.exports,
  constants
)
