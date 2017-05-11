import Emissor from 'sk/particles/Emissor'
import * as utils from 'sk/utils'

export default class RectEmissor extends Emissor {
  constructor(width=100, height=100) {
    super()

    this._width = width
    this._height = height
  }

  get width() { return this._width }
  set width(v) { this._width = v }

  get height() { return this._height }
  set height(v) { this._height = v }

  next() {

    return {
      x: this._emitter.emissionX + utils.random.polar(this._width),
      y: this._emitter.emissionY + utils.random.polar(this._height)
    }
  }
}