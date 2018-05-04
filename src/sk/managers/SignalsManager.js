const Manager = require('sk/core/Manager')
const Signal = require('sk/core/Signal')

class SignalsManager extends Manager {
  constructor() {
    super()

    this._queue = []
  }

  schedule(signal) {
    if (!(signal instanceof Signal)) {
      throw new Error(`You must provide an instance of Signal on SignalsManager`)
    }

    this._queue.push(signal)
  }

  update() {
    let i = this._queue.length

    while (i > 0) {
      i--
      let signal = this._queue.shift()
      signal._emit()
    }
  }
}

module.exports = SignalsManager