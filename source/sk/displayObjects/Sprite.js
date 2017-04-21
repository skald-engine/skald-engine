
/**
 * A sprite class that inherits from PIXI sprite.
 */
export default class Sprite extends PIXI.Sprite {
  
  /**
   * Helper method to set a batch a variables to this object. Notice that, this
   * methods uses `Object.assign` internally, thus it only shallow copy the
   * input values. If you need a deep copy, check {@sk.utils.deepClone}.
   *
   * Example:
   *
   *     sprite.configure({x:4, y:5})
   *
   * @param {Object} config - The object containing the target variables.
   * @return {Sprite} This object.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }
}