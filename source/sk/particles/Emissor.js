/**
 * Base class for the emitter position generator.
 *
 * Emissors should generate the initial position of new particles in the 
 * emitter. The emitter will call `emissor.next` method everytime a new 
 * particle is added.
 */
export default class Emissor {
  /**
   * Constructor.
   */
  constructor() {
    this._emitter = null
  }

  /**
   * Setup the emissor. Called by the emitter.
   *
   * @param {Emitter} emitter - The emitter instance.
   */
  setup(emitter) {
    this._emitter = emitter
  }

  /**
   * Generates the new point.
   *
   * @return {Object}
   * @return {Object.x} the X position.
   * @return {Object.y} the Y position.
   */
  next() {
    if (!this._emitter) {
      throw new Error(`Trying to use an emissor detached from any particle `+
                      `emitter.`)
    }

    return {x:this._emitter.emissionX, y:this._emitter.emissionY}
  }
}