import Emissor from 'sk/particles/Emissor'
import * as utils from 'sk/utils'

/**
 * Emissor to generate points in a circular area with a ring shape.
 *
 * This emissor will generate points a ring area, in which:
 *
 * - CENTER AT: [emitter.emissionX, emitter.emissionY]
 * - RADIUS: emissor.radius
 * - WIDTH: emissor.width
 *
 * The new points will generate a point from `radius-width`px from the 
 * center to `radius`px from the center.
 */
export default class RingEmissor extends Emissor {
  /**
   * Constructor.
   *
   * @param {Number} [radius=50] - Radius of the ring.
   * @param {Number} [width=30] - The width of the ring.
   */
  constructor(radius=50, width=30) {
    super()

    this._radius = radius
    this._width = width
    this._uniform = false
  }

  /**
   * Diameter of the ring.
   * @type {Number}
   */
  get radius() { return this._radius }
  set radius(v) { this._radius = v }

  /**
   * Width of the ring.
   * @type {Number}
   */
  get width() { return this._width }
  set width(v) { this._width = v }

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
   * Generate the points.
   */
  next() {
    let angle = Math.random()*Math.PI*2

    let range = Math.random()
    if (this._uniform) { // convert to uniform
      range = Math.sqrt(range)
    }
    range = range*this._width + this._radius - this._width


    return {
      x: this._emitter.emissionX + Math.sin(angle)*range,
      y: this._emitter.emissionY + Math.cos(angle)*range
    }
  }
}