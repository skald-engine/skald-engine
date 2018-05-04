const Engine = require('sk/core/Engine')

class $ {
  static getEngine() {
    return $._engine
  }

  static createEngine() {
    $._engine = new Engine()
  }

  static getInjector() {
    return $._engine && $._engine.injector
  }
}

$._engine = null


module.exports = $