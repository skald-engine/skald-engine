const Engine = require('sk/core/Engine')

class $ {
  static getEngine() {
    return $._engine
  }

  static createEngine() {
    $._engine = new Engine()
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