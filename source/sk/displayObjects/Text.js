import FontStyle from 'sk/core/FontStyle'

/**
 * A class that inherits from PIXI bitmap text.
 */
export default class Text extends PIXI.Text {
  constructor(text, style) {
    super(text)

    this.style = new FontStyle(style)
  }

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
   * @return {Text} This object.
   */
  configure(config) {
    Object.assign(this. config)
    return this
  }
}