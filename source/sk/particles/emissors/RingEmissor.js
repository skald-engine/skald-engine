import Emissor from 'sk/particles/Emissor'
import * as utils from 'sk/utils'

export default class RingEmissor extends Emissor {
  constructor(radius=100, width=30) {
    super()

    this._radius = radius
    this._width = width
  }

  get radius() { return this._radius }
  set radius(v) { this._radius = v }

  get width() { return this._width }
  set width(v) { this._width = v }

  next() {
    let r = Math.random()*Math.PI*2
    let range = Math.random()*this._width + this._radius-this._width
    let x = Math.sin(r) * range
    let y = Math.cos(r) * range

    return {
      x: this._emitter.emissionX + x,
      y: this._emitter.emissionY + y
    }
  }
}