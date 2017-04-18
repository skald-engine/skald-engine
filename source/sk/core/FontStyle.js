import fontStyleDefaults from 'sk/config/fontStyleDefaults'
import * as utils from 'sk/utils'

export default class FontStyle extends PIXI.TextStyle {
  constructor(style) {
    super(utils.deepMerge(fontStyleDefaults, style||{}))
  }
}