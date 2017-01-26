import * as utils from 'utils'
import fontStyleDefaults from 'core/config/fontStyleDefaults.js'

export default class FontStyle extends PIXI.TextStyle {
  constructor(style) {
    super(utils.deepMerge(fontStyleDefaults, style||{}))
  }
}