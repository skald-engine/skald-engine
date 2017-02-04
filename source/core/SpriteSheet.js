import spriteSheetMetadataSchema from 'core/config/spriteSheetMetadataSchema'
import * as utils from 'utils'

export default class SpriteSheet {
  constructor(textures, animations) {
    this._textures = null
    this._numFrames = 0
    this._animations = null

    this.textures = textures
    if (animations) this.animations = animations
  }

  set textures(value) {
    this._numFrames = Object.keys(value).length
    this._textures = value
  }
  set animations(value) {
    this._animations = value
  }

  get numFrames() {
    return this._numFrames
  }

  configure(config) {
    Object.assign(this, config)
    return this
  }

  getFrame(name) {
    return this._textures[name]
  }

  getAnimation(name) {
    return this.animations? this._animations[name] : null
  }
}
