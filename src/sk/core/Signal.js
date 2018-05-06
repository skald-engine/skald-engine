const sk = require('sk')

class Signal {
  constructor() {
    this._listeners = []
    this._onceListeners = []
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
    let signals = sk.inject('signals')
    signals.schedule(this, params)
  }

  destroy() {}

  _emit(params=[]) {
    for (let i=0; i<this._listeners.length; i++) {
      this._listeners[i](...params)
    }
    for (let i=0; i<this._onceListeners.length; i++) {
      this._onceListeners[i](...params)
    }
    this._onceListeners = []
  }
}

module.exports = Signal