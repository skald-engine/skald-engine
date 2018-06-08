const sk = require('sk')

class Signal {
  constructor() {
    this._listeners = []
    this._onceListeners = []
    this._calls = 0
    this._enabled = true
  }

  get numListeners() { return this._listeners.length + this._onceListeners.length }
  get numCalls() { return this._calls }

  get enabled() { return this._enabled }
  set enabled(value) { this._enabled = !!value}

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

  destroy() {
    delete this._listeners
    delete this._onceListeners
  }

  _emit(params=[]) {
    if (!this._enabled) return

    this._calls++

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