const pixi = require('pixi.js')
const $ = require('sk/$')

class SignalCallback {
  constructor(signal, callback, onComplete=null) {
    this.signal = signal
    this.callback = callback

    if (onComplete) {
      this.wrapper = (...params) => {
        this.callback(...params)
        onComplete()
      }
      this.signal.once(this.wrapper)
    } else {
      this.wrapper = callback
      this.signal.add(this.wrapper)
    }
  }

  remove() {
    this.signal.remove(this.wrapper)
  }
}

class DomCallback {
  constructor(dom, type, callback) {
    this.dom = dom
    this.type = type
    this.callback = callback
    this.dom.addEventListener(type, callback)
  }

  remove() {
    this.dom.removeEventListener(this.type, this.callback)
  }
}

class Component extends pixi.Container {
  constructor() {
    super()
    let injector = $.getInjector()

    this._signalCallbacks = []
    this._viewCallbacks = []
    this._documentCallbacks = []
    this._windowCallbacks = []
    this.__renderer = injector.resolve('renderer')
  }

  addToSignal(signal, callback) {
    let spec = new SignalCallback(signal, callback)
    this._signalCallbacks.push(spec)
  }
  onceToSignal(signal, callback) {
    let spec = new SignalCallback(signal, callback, () => this.removeFromSignal(signal, callback))
    this._signalCallbacks.push(spec)
  }
  removeFromSignal(signal, callback) {
    let index = this._signalCallbacks.findIndex(x => x.signal === signal && x.callback === callback)
    if (index >= 0) {
      this._signalCallbacks[index].remove()
      this._signalCallbacks.splice(index, 1)
    }
  }
  removeAllFromSignal(signal) {
    for (let i=0; i<this._signalCallbacks.length; i++) {
      let spec = this._signalCallbacks[i]
      spec.remove()
    }
    this._signalCallbacks = []
  }

  addViewEventListener(type, callback) {
    let spec = new DomCallback(this.__renderer.view, type, callback)
    this._viewCallbacks.push(spec)
  }
  removeViewEventListener(type, callback) {
    let index = this._viewCallbacks.findIndex(x => x.type === type && x.callback === callback)
    if (index >= 0) {
      this._viewCallbacks[index].remove()
      this._viewCallbacks.splice(index, 1)
    }
  }
  removeAllViewEventListeners() {
    for (let i=0; i<this._viewCallbacks.length; i++) {
      let spec = this._viewCallbacks[i].remove()
    }
    this._viewCallbacks = []
  }

  addDocumentEventListener(type, callback) {
    let spec = new DomCallback(window.document, type, callback)
    this._documentCallbacks.push(spec)
  }
  removeDocumentEventListener(type, callback) {
    let index = this._documentCallbacks.findIndex(x => x.type === type && x.callback === callback)
    if (index >= 0) {
      this._documentCallbacks[index].remove()
      this._documentCallbacks.splice(index, 1)
    }
  }
  removeAllDocumentEventListeners() {
    for (let i=0; i<this._documentCallbacks.length; i++) {
      let spec = this._documentCallbacks[i].remove()
    }
    this._documentCallbacks = []
  }

  addWindowEventListener(type, callback) {
    let spec = new DomCallback(window, type, callback)
    this._windowCallbacks.push(spec)
  }
  removeWindowEventListener(type, callback) {
    let index = this._windowCallbacks.findIndex(x => x.type === type && x.callback === callback)
    if (index >= 0) {
      this._windowCallbacks[index].remove()
      this._windowCallbacks.splice(index, 1)
    }
  }
  removeAllWindowEventListeners() {
    for (let i=0; i<this._windowCallbacks.length; i++) {
      let spec = this._windowCallbacks[i].remove()
    }
    this._windowCallbacks = []
  }

  destroy(...params) {
    super.destroy(...params)

    this.removeAllFromSignal()
    this.removeAllViewEventListeners()
    this.removeAllDocumentEventListeners()
    this.removeAllWindowEventListeners()
  }
}

module.exports = Component