import * as $ from 'sk/$'

/**
 * A class that inherits from PIXI bitmap text.
 */
export default class BitmapText extends PIXI.extras.BitmapText {
  
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
   * @return {BitmapText} This object.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }

  updateText() {
    if (!this._font.name) return

    if (!$.bitmapFonts[this._font.name]) {
      throw new Error(`Trying to use a non registered bitmap font `+
                      `"${this._font.name}."`)
    }

    super.updateText()
  }
}