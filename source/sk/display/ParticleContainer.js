
/**
 * A class that inherits from PIXI particle container.
 */
export default class ParticleContainer extends PIXI.ParticleContainer {
  
  /**
   * Helper method to set a batch a variables to this object. Notice that, this
   * methods uses `Object.assign` internally, thus it only shallow copy the
   * input values. If you need a deep copy, check {@sk.utils.deepClone}.
   *
   * Example:
   *
   *     container.configure({x:4, y:5})
   *
   * @param {Object} config - The object containing the target variables.
   * @return {Container} This object.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }
}