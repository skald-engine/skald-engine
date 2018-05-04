const $ = require('sk/$')

// Injections
module.exports.manager = (id, target) => {
  $.getInjector().registerManager(id, target)
}

module.exports.service = (id, target) => {
  $.getInjector().registerService(id, target)
}

module.exports.signal = (id, target) => {
  $.getInjector().registerSignal(id, target)
}

module.exports.view = (id, target) => {
  $.getInjector().registerView(id, target)
}

module.exports.factory = (id, target, stateless=false) => {
  $.getInjector().registerFactory(id, target, stateless)
}

module.exports.provider = (id, target, stateless=false) => {
  $.getInjector().registerProvider(id, target, stateless)
}

module.exports.instance = (id, target) => {
  $.getInjector().registerInstance(id, target)
}

module.exports.inject = (id) => {
  if (!$.getEngine().started) {
    throw new Error(`You can only inject an object after the engine is started.`)
  }
  return $.getInjector().resolve(id)
}

// Game control
module.exports.start = (config) => {
  $.getEngine().start(config)
}