import Emissor from 'sk/particles/Emissor'
import * as utils from 'sk/utils'

/**
 * Emissor to generate points in a circular area with a ring shape.
 *
 * This emissor will generate points a ring area, in which:
 *
 * - CENTER AT: [emitter.emissionX, emitter.emissionY]
 * - DIAMETER: emissor.diameter
 * - WIDTH: emissor.width
 *
 * The new points will generate a point from `diameter/2-width`px from the 
 * center to `diameter/2`px from the center.
 */
export default class RingEmissor extends Emissor {
  /**
   * Constructor.
   *
   * @param {Number} [diameter=100] - Diamater of the ring.
   * @param {Number} [width=30] - The width of the ring.
   */
  constructor(diameter=100, width=30) {
    super()

    this._diameter = diameter
    this._width = width
  }

  /**
   * Diameter of the ring.
   * @type {Number}
   */
  get diameter() { return this._diameter }
  set diameter(v) { this._diameter = v }

  /**
   * Width of the ring.
   * @type {Number}
   */
  get width() { return this._width }
  set width(v) { this._width = v }

  /**
   * Generate the points.
   */
  next() {
    let r = Math.random()*Math.PI*2
    let range = Math.random()*this._width + this._diameter/2 - this._width

    return {
      x: this._emitter.emissionX + Math.sin(r)*range,
      y: this._emitter.emissionY + Math.cos(r)*range
    }
  }
}