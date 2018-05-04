const sk = require('sk')

class Signal {
  constructor() {
    this._listeners = []
    this._onceListeners = []
    this._params = null
  }

  setup() {}

  has(callback) {
    return this._listeners.indexOf(callback) >= 0 ||
           this._onceListeners.indexOf(callback) >= 0
  }

  add(callback) {
    if (this.has(callback)) {
      throw new Error(`Registering the same signal callback twice.`)
    }
    this._listeners.push(callback)
  }

  once(callback) {
    if (this.has(callback)) {
      throw new Error(`Registering the same signal callback twice.`)
    }
    this._onceListeners.push(callback)
  }

  remove(callback) {
    let index = this._listeners.indexOf(callback)
    if (index > -1) {
      this._listeners.splice(index, 1)
    } else {
      index = this._onceListeners.indexOf(callback)
      if (index > -1) {
        this._onceListeners.splice(index, 1)
      }
    }
  }

  removeAll() {
    this._listeners = []
    this._onceListeners = []
  }

  dispatch(...params) {
    this._params = params

    let signals = sk.inject('signals')
    signals.schedule(this)
  }

  destroy() {}

  _emit() {
    for (let i=0; i<this._listeners.length; i++) {
      this._listeners[i](...this._params)
    }
    for (let i=0; i<this._onceListeners.length; i++) {
      this._onceListeners[i](...this._params)
    }
    this._onceListeners = []
  }
}

module.exports = Signal