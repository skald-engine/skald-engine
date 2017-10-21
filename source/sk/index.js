const constants = require('sk/constants')
const engine = require('sk/engine')
const utils = require('sk/utils')
const Game = require('sk/Game')

module.exports.Game = Game
module.exports.utils = utils
module.exports.engine = engine
module.exports = Object.assign(
  module.exports,
  constants
)
