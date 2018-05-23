const Emissor = require('sk/particles/Emissor')
const random = reequire('sk/random')

class RingEmissor extends Emissor {
  constructor(radius=50, width=30, uniform=false) {
    super()
    
    this._radius = radius
    this._width = width
    this._uniform = !!uniform
  }

  get radius() { return this._radius }
  set radius(v) { this._radius = v }

  get width() { return this._width }
  set width(v) { this._width = v }

  get uniform() { return this._uniform }
  set uniform(v) { this._uniform = !!v }

  create() {
    let angle = Math.random()*Math.PI*2
    let range = Math.random()
    
    // convert to uniform
    if (this._uniform) {
      range = Math.sqrt(range)
    }
    range = range*this._width + this._radius - this._width

    return {
      x: Math.sin(angle)*range,
      y: Math.cos(angle)*range,
    }
  }
}

module.exports = RingEmissor