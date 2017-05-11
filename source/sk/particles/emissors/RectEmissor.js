import Emissor from 'sk/particles/Emissor'
import * as utils from 'sk/utils'

/**
 * Emissor to generate points in a rectangle area.
 *
 * This emissor will generate points in the area:
 *
 * - TOP-LEFT: emitter.emissionX - emissor.width/2
 * - BOTTOM-RIGHT: emitter.emissionY + emissor.height/2
 */
export default class RectEmissor extends Emissor {
  /**
   * Constructor.
   *
   * @param {Number} [width=100] The width of the rectangle.
   * @param {Number} [height=100] The height of the rectangle.
   */
  constructor(width=100, height=100) {
    super()

    this._width = width
    this._height = height
  }

  /**
   * Width of the emissor rectangle.
   * @type {Number}
   */
  get width() { return this._width }
  set width(v) { this._width = v }

  /**
   * Height of the emissor rectangle.
   * @type {Number}
   */
  get height() { return this._height }
  set height(v) { this._height = v }

  /**
   * Generate the point.
   */
  next() {
    return {
      x: this._emitter.emissionX + utils.random.polar(this._width/2),
      y: this._emitter.emissionY + utils.random.polar(this._height/2)
    }
  }
}