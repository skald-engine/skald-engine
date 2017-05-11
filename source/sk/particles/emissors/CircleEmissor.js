import Emissor from 'sk/particles/Emissor'

/**
 * Emissor to generate points in a circular area.
 *
 * This emissor will generate points a circle area, in which:
 *
 * - CENTER AT: [emitter.emissionX, emitter.emissionY]
 * - DIAMETER: emissor.diameter
 */
export default class CircleEmissor extends Emissor {
  /**
   * Constructor.
   *
   * @param {Number} [diameter=100] - The circle diameter.
   */
  constructor(diameter=100) {
    super()

    this._diameter = diameter
  }

  /**
   * Diameter of the circular area.
   * @type {Number}
   */
  get diameter() { return this._diameter }
  set diameter(v) { this._diameter = v }

  /**
   * Generate the point.
   */
  next() {
    let r = Math.random()*Math.PI*2
    let range = Math.random()*this._diameter/2

    return {
      x: this._emitter.emissionX + Math.sin(r)*range,
      y: this._emitter.emissionY + Math.cos(r)*range
    }
  }
}