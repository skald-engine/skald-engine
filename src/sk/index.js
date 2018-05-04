require('sk/bootstrap')

const core = require('sk/core')
const utils = require('sk/utils')
const $ = require('sk/$')

const constants = require('sk/constants')
const shortcuts = require('sk/shortcuts')

module.exports.core = core
module.exports.utils = utils
module.exports._$ = $

module.exports = Object.assign(
  module.exports,
  constants,
  shortcuts
)
