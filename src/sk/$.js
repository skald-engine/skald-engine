const Engine = require('sk/engine/Engine')

class $ {
  static getEngine() {
    return $._engine
  }

  static createEngine() {
    $._engine = new Engine()
    $._engine.boot()
  }

  static destroyEngine() {
    $._engine.destroy()
    $._engine = null
  }

  static getInjector() {
    return $._engine && $._engine._injector
  }

  static getTicker() {
    return $._engine && $._engine._ticker
  }
}

$._engine = null


module.exports = $