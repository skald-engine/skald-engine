const Emissor = require('sk/particles/Emissor')
const random = require('sk/random')

class RectEmissor extends Emissor {
  constructor(width=0, height=0) {
    super()
    
    this._width = width
    this._height = height
  }

  get width() { return this._width }
  set width(v) { this._width = v }

  get height() { return this._height }
  set height(v) { this._height = !!v }

  create() {
    return {
      x: random.polar(this._width/2),
      y: random.polar(this._height/2),
    }
  }
}

module.exports = RectEmissor