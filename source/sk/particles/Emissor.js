export default class Emissor {
  constructor() {
    this._emitter = null
  }

  setup(emitter) {
    this._emitter = emitter
  }

  next() {
    if (!this._emitter) {
      throw new Error(`Trying to use an emissor detached from any particle `+
                      `emitter.`)
    }

    return {x:this._emitter.emissionX, y:this._emitter.emissionY}
  }
}