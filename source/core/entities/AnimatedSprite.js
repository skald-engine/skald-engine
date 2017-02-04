import Sprite from 'core/entities/Sprite'

export default class AnimatedSprite extends Sprite {
  constructor(game, scene, suppressInitialize=false) {
    super(game, scene, true)

    this._spriteSheet = null
    this._frameRate = null
    this._complete = false
    this._playing = false
    this._currentAnimation = null
    this._currentAnimationIndex = null
    this._currentTime = 0
  }

  set spriteSheet(value) {
    this._spriteSheet = value

    if (!value) return

    let animation = value.getAnimation('idle') || value.getFirstAnimation()
    if (animation) {
      this.gotoAndPlay(animation.name)
    } else {
      this._displayObject.texture = this._spriteSheet.getFirstFrame()
    }

    let multiplier = 1/this._currentAnimation.speed
    this._currentTime = multiplier/value.frameRate
  }
  get spriteSheet() { return this._spriteSheet }

  get complete() { return this._complete }
  get playing() { return this._playing }

  _updateTexture() {
    if (this._currentAnimation) {
      let animation = this._currentAnimation
      let i = this._currentAnimationIndex
      if (i >= animation.frames.length) {
        this._currentAnimationIndex = i = 0

        if (animation.next) {
          this.gotoAndPlay(animation.next)
          return

        } else if (!animation.repeat) {
          this._complete = true
          this.stop()
          return
        }
      }

      let frame = animation.frames[i]
      let texture = this._spriteSheet.getFrame(frame)
      this._displayObject.texture = texture
    }
  }

  play() {
    if (this._playing) return

    this._complete = false
    this._playing = true
  }
  stop() {
    if (!this._playing) return

    this._playing = false
  }
  gotoAndPlay(frameOrAnimation) {
    if (typeof frameOrAnimation === 'string') {
      let animation = this._spriteSheet.getAnimation(frameOrAnimation)

      if (!animation) {
        throw new Error(`No animation found with id "${frameOrAnimation}".`)
      }

      this._currentAnimation = animation
      this._currentAnimationIndex = 0

    } else {
      if (!this._currentAnimation) {
        throw new Error(`AnimatedSprite is not playing any animation.`)
      }

      this._currentAnimationIndex = frameOrAnimation
    }

    let multiplier = 1/this._currentAnimation.speed
    this._currentTime = multiplier/this._spriteSheet.frameRate
    this._updateTexture()
    this.play()
  }
  gotoAndStop(frameOrAnimation) {
    if (typeof frameOrAnimation === 'string') {
      let animation = this._spriteSheet.getAnimation(frameOrAnimation)

      if (!animation) {
        throw new Error(`No animation found with id "${frameOrAnimation}".`)
      }

      this._currentAnimation = animation
      this._currentAnimationIndex = 0

    } else {
      if (!this._currentAnimation) {
        throw new Error(`AnimatedSprite is not playing any animation.`)
      }

      this._currentAnimationIndex = frameOrAnimation
    }

    let multiplier = 1/this._currentAnimation.speed
    this._currentTime = multiplier/this._spriteSheet.frameRate
    this._updateTexture()
    this.stop()
  }
  update(delta) {
    if (this._playing) {
      this._currentTime -= delta
      if (this._currentTime <= 0) {
        let multiplier = 1/this._currentAnimation.speed
        this._currentTime = multiplier/this._spriteSheet.frameRate + this._currentTime
        this._currentAnimationIndex += 1
        this._updateTexture()
      }
    }

  }
  destroy() {}
}