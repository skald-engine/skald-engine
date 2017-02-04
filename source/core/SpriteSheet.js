import spriteSheetMetadataSchema from 'core/config/spriteSheetMetadataSchema'
import * as utils from 'utils'

export default class SpriteSheet {
  constructor(textures, animations, frameRate=20) {
    this._textures = null
    this._numFrames = 0
    this._animations = null
    this._frameRate = frameRate

    this.textures = textures
    if (animations) this.animations = animations
  }

  set frameRate(value) { this._frameRate = value }
  get frameRate() { return this._frameRate }

  set textures(value) {
    this._numFrames = Object.keys(value).length
    this._textures = value
  }
  set animations(value) {
    this._animations = value

    let keys = Object.keys(this._animations)
    for (let i=0; i<keys.length; i++) {
      let animation = this._animations[keys[i]]

      // Set `repeat` default
      if (typeof animation.repeat === 'undefined') {
        animation.repeat = true
      }
      animation.repeat = !!animation.repeat

      // Set `speed` default
      animation.speed = animation.speed || 1

      // Set `name`
      animation.name = keys[i]
    }
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
    return this._animations? this._animations[name] : null
  }

  getFirstFrame() {
    let key = Object.keys(this._textures)[0]
    return this._textures[key]
  }

  getFirstAnimation() {
    if (!this._animations) return

    let key = Object.keys(this._animations)[0]
    return this._animations[key] 
  }
}
