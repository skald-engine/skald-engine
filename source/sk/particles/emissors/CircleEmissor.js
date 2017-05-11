import Emissor from 'sk/particles/Emissor'

export default class CircleEmissor extends Emissor {
  constructor(radius=100) {
    super()

    this._radius = radius
  }

  get radius() { return this._radius }
  set radius(v) { this._radius = v }

  next() {
    let r = Math.random()*Math.PI*2
    let range = Math.random()*this._radius
    let x = Math.sin(r) * range
    let y = Math.cos(r) * range

    return {
      x: this._emitter.emissionX + x,
      y: this._emitter.emissionY + y
    }
  }
}