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
    this._uniform = false
  }

  /**
   * Diameter of the circular area.
   * @type {Number}
   */
  get diameter() { return this._diameter }
  set diameter(v) { this._diameter = v }

  /**
   * If true, the emissor will generate the points uniformly on the center, 
   * avoiding the concentration of point in the center. DEfault to false.
   *
   * See http://www.anderswallin.net/2009/05/uniform-random-points-in-a-circle-using-polar-coordinates/ for an 
   * explanation.
   * 
   * @type {Boolean}
   */
  get uniform() { return this._uniform }
  set uniform(v) { this._uniform = !!v }

  /**
   * Generates the point.
   */
  next() {
    let angle = Math.random()*Math.PI*2


    let range = Math.random()
    if (this._uniform) { // convert to uniform
      range = Math.sqrt(range)
    }
    range = range*this._diameter/2

    return {
      x: this._emitter.emissionX + Math.sin(angle)*range,
      y: this._emitter.emissionY + Math.cos(angle)*range
    }
  }
}