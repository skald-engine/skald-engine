const SpriteSheetAnimation = require('sk/core/SpriteSheetAnimation')

class SpriteSheet {
  constructor(textures, animations=null, metadata=null, frameRate=24) {
    this._textures = null
    this._animations = null
    this._metadata = metadata
    this._frameRate = frameRate
    this._numFrames = 0

    this._setupTextures(textures)
    this._setupAnimations(animations)
    console.log(this)
  }

  get textures() { return this._textures }
  set textures(v) { this._setupTextures(v) }

  get animations() { return this._animations }
  set animations(v) { this._setupAnimations(v) }

  get metadata() { return this._metadata }
  set metadata(v) { this._metadata = v }

  get frameRate() { return this._frameRate }
  set frameRate(v) { this._frameRate = v }

  get numFrames() { return this._numFrames }

  _setupTextures(data) {
    if (Array.isArray(data)) {
      let temp = {}
      for (let i=0; i<data.length; i++) {
        temp[i] = data[i]
      }
      data = temp
    }

    this._textures = data
    this._numFrames = Object.keys(data).length
  }

  _setupAnimations(data) {
    if (!data) {
      data = Object.keys(this._textures)
    }

    if (Array.isArray(data)) {
      data = {
        'default': data
      }
    }

    let animations = {}
    let names = Object.keys(data)
    for (let i=0; i<names.length; i++) {
      let name = names[i]
      let spec = data[name]

      if (Array.isArray(spec)) {
        spec = {frames: spec}
      }

      if (!spec.frames) {
        throw new Error(`Animation data ${names} require frames attribute.`)
      }

      let animation = new SpriteSheetAnimation(
        name,
        spec.frames,
        spec.repeat,
        spec.next,
        spec.speed
      )
      animations[name] = animation
    }

    this._animations = animations
  }

  getFrame(id) {
    return this._textures? this._textures[id] : null
  }

  getAnimation(id) {
    return this._animations? this._animations[id] : null
  }

  getFirstFrame() {
    let key = Object.keys(this._textures)[0]
    return this._textures[key]
  }

  getFirstAnimation() {
    if (!this._animations) return null

    let key = Object.keys(this._animations)[0]
    return this._animations[key] 
  }
}
module.exports = SpriteSheet