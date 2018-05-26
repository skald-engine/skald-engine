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
  if (!$.getEngine()._started) {
    throw new Error(`You can only inject an object after the engine is started.`)
  }
  return $.getInjector().resolve(id)
}
module.exports.resolve = module.exports.inject

// Game control
module.exports.start = (config) => {
  $.getEngine().start(config)
}
module.exports.destroy = () => {
  $.destroyEngine()
}
module.exports.boot = () => {
  $.createEngine()
}
module.exports.reset = () => {
  $.destroyEngine()
  $.createEngine()
}