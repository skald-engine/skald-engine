const $ = require('sk/$')
const pixi = require('pixi.js')

class AnimatedSprite extends pixi.Sprite {
  constructor(spriteSheet=null, play=true) {
    super()

    this._spriteSheet = null

    this._complete = null
    this._playing = null
    this._currentAnimation = null
    this._currentAnimationFrame = null

    this._schedule = $.getInjector().resolve('schedule')
    this._update = this._update.bind(this)

    this._setupSpriteSheet(spriteSheet, play)
  }

  get complete() { return this._complete }
  get playing() { return this._playing }

  get spriteSheet() { return this._spriteSheet }
  set spriteSheet(v) { this._setupSpriteSheet(v, this._playing) }

  _setupSpriteSheet(spriteSheet, play=true) {
    if (!spriteSheet) return
    this._spriteSheet = spriteSheet

    let animation = spriteSheet.getAnimation('idle') || spriteSheet.getFirstAnimation()
    if (animation && play) {
      this.gotoAndPlay(animation.name)
    } else {
      this.texture = this._spriteSheet.getFirstFrame()
    }

    if (this._currentAnimation) {
      let multiplier = 1/this._currentAnimation.speed
      this._currentTime = multiplier/spriteSheet.frameRate
      this._currentAnimationFrame = 0
    }
  }

  _updateAnimation() {
    let animation = this._currentAnimation
    let frames = animation.textures

    let i = this._currentAnimationFrame
    if (i >= frames.length) {
      this._currentAnimationFrame = i = 0

      if (animation.next) {
        this.gotoAndPlay(animation.next)
        return

      } else if (!animation.repeat) {
        this._complete = true
        this.stop()
        return
      }
    }

    let frame = frames[i]
    let texture = this._spriteSheet.getFrame(frame)
    this.texture = texture
  }

  _update(delta) {
    if (!this._playing) return

    // Update time
    this._currentTime -= delta/1000

    // If still the same frame, stop
    if (this._currentTime > 0) return

    // Update next frame
    let multiplier = 1/this._currentAnimation.speed
    this._currentTime = multiplier/this._spriteSheet.frameRate + this._currentTime
    this._currentAnimationFrame += 1
    
    this._updateAnimation()
  }

  _goto(id) {
    if (typeof id === 'string') {
      let animation = this._spriteSheet.getAnimation(id)

      if (!animation) {
        throw new Error(`No animation found with id "${id}".`)
      }

      this._currentAnimation = animation
      this._currentAnimationFrame = 0

    } else {
      if (!this._currentAnimation) {
        throw new Error(`AnimatedSprite is not playing any animation.`)
      }

      this._currentAnimationFrame = id
    }

    let multiplier = 1/this._currentAnimation.speed
    this._currentTime = multiplier/this._spriteSheet.frameRate
    this._updateAnimation()
  }

  play() {
    if (this._playing) return
    this._complete = false
    this._playing = true
    this._schedule.add(this._update)
  }

  stop() {
    if (!this._playing) return
    this._playing = false
    this._schedule.remove(this._update)
  }

  gotoAndPlay(id) {
    this._goto(id)
    this.play()
  }

  gotoAndStop(id) {
    this._goto(id)
    this.stop()
  }
  
  destroy() {
    this._schedule.remove(this._update)
  }
}


//   get complete() { return this._complete }
//   get playing() { return this._playing }

//   _updateTexture() {
//     let animation = this._currentAnimation
//     if (animation) {
//       let frames = Array.isArray(animation)? animation : animation.frames

//       let i = this._currentAnimationFrame
//       if (i >= frames.length) {
//         this._currentAnimationFrame = i = 0

//         if (animation.next) {
//           this.gotoAndPlay(animation.next)
//           return

//         } else if (!animation.repeat) {
//           this._complete = true
//           this.stop()
//           return
//         }
//       }

//       let frame = frames[i]
//       let texture = this._spriteSheet.getFrame(frame)
//       this.texture = texture
//     }
//   }
//   _update(delta) {
//     if (this._playing) {
//       this._currentTime -= delta
//       if (this._currentTime <= 0) {
//         let multiplier = 1/this._currentAnimation.speed
//         this._currentTime = multiplier/this._spriteSheet.frameRate + this._currentTime
//         this._currentAnimationFrame += 1
//         this._updateTexture()
//       }
//     }
//   }

//   play() {
//     if (this._playing) return

//     this._complete = false
//     this._playing = true

//     this._schedule.add(this._update)
//   }
//   stop() {
//     if (!this._playing) return

//     this._playing = false
//     this._schedule.remove(this._update)
//   }
//   gotoAndPlay(frameOrAnimation) {
//     if (typeof frameOrAnimation === 'string') {
//       let animation = this._spriteSheet.getAnimation(frameOrAnimation)

//       if (!animation) {
//         throw new Error(`No animation found with id "${frameOrAnimation}".`)
//       }

//       this._currentAnimation = animation
//       this._currentAnimationFrame = 0

//     } else {
//       if (!this._currentAnimation) {
//         throw new Error(`AnimatedSprite is not playing any animation.`)
//       }

//       this._currentAnimationFrame = frameOrAnimation
//     }

//     let multiplier = 1/this._currentAnimation.speed
//     this._currentTime = multiplier/this._spriteSheet.frameRate
//     this._updateTexture()
//     this.play()
//   }
//   gotoAndStop(frameOrAnimation) {
//     if (typeof frameOrAnimation === 'string') {
//       let animation = this._spriteSheet.getAnimation(frameOrAnimation)

//       if (!animation) {
//         throw new Error(`No animation found with id "${frameOrAnimation}".`)
//       }

//       this._currentAnimation = animation
//       this._currentAnimationFrame = 0

//     } else {
//       if (!this._currentAnimation) {
//         throw new Error(`AnimatedSprite is not playing any animation.`)
//       }

//       this._currentAnimationFrame = frameOrAnimation
//     }

//     let multiplier = 1/this._currentAnimation.speed
//     this._currentTime = multiplier/this._spriteSheet.frameRate
//     this._updateTexture()
//     this.stop()
//   }


//   destroy() {
//     this.stop()
//   }
// }

module.exports = AnimatedSprite