const $ = require('sk/$')
const Manager = require('sk/core/Manager')
const Signal = require('sk/core/Signal')

class SignalsManager extends Manager {
  constructor() {
    super('signals')

    this._queue = null
    this._updateSignal = null
  }

  setup() {
    let injector = $.getInjector()
    this._queue = []

    this._updateSignal = injector.resolve('updateSignal')
  }

  schedule(signal, params) {
    if (!(signal instanceof Signal)) {
      throw new Error(`You must provide an instance of Signal on SignalsManager`)
    }

    this._queue.push({signal, params})
  }

  update() {
    let i = this._queue.length

    while (i > 0) {
      i--
      let {signal, params} = this._queue.shift()
      signal._emit(params)
    }

    this._updateSignal.dispatch()
  }
}

module.exports = SignalsManager