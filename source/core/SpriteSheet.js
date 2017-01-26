import spriteSheetMetadataSchema from 'core/config/spriteSheetMetadataSchema'
import * as utils from 'utils'

export default class SpriteSheet {
  constructor(metadata) {
    this._texture = null
    this._frames = {}
    this._numFrames = 0
    this._width = 0
    this._height = 0
    this._animations = {}

    this._setMetadata(metadata)
  }

  get texture() {}
  get numFrames() {}
  get scale() {}
  get size() {}
  get width() {}
  get height() {}

  _setMetadata(metadata) {
    // let data = utils.validateJson(metadata, {}, spriteSheetMetadataSchema)
    // console.log(data)
  }

  configure(config) {
    Object.assign(this, config)
    return this
  }

  getFrame(name) {}
  getFrameMeta(name) {}
  getAnimation(name) {}
}
