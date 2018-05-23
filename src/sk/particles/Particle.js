const pixi = require('pixi.js')
const random = require('sk/random')
const utils = require('sk/utils')

/**
 * Representation of a single particle in the particle system.
 *
 * This class inherit from pixi sprite and adds new variables in oder to 
 * control the particle.
 */
class Particle extends pixi.Sprite {
  constructor(emitter) {
    super()

    this.emitter = emitter

    this.life = 0
    this.initialAlpha = 0
    this.stepAlpha = 0
    this.initialRotation = 0
    this.stepRotation = 0
    this.initialScale = 0
    this.stepScale = 0
    this.initialSpeed = 0
    this.stepSpeed = 0
    this.gravityX = 0
    this.gravityY = 0
    this.radialAcceleration = 0
    this.tangentialAcceleration = 0
    this.initialColor = [0, 0, 0]
    this.stepColor = [0, 0, 0]
    
    this.dirX = 0
    this.dirY = 0
    this.alpha = 0 // force hidden on particle container
    this.anchor.x = .5
    this.anchor.y = .5
  }

  reset(x, y, emitter) {
    const e = emitter
    const r = random.polar
    const c = utils.clip

    // stored values
    this.x = x
    this.y = y
    this.blendMode = e.blendMode

    this.life = e.life + r(e.lifeVar)

    this.initialAlpha = e.initialAlpha + r(e.initialAlphaVar)
    let finalAlpha = e.finalAlpha + r(e.finalAlphaVar)
    this.stepAlpha = (finalAlpha - initialAlpha)/this.life

    this.initialRotation = e.initialRotation + r(e.initialRotationVar)
    let finalRotation = e.finalRotation + r(e.finalRotationVar)
    this.stepRotation = (finalRotation - initialRotation)/this.life

    this.initialScale = e.initialScale + r(e.initialScaleVar)
    let finalScale = e.finalScale + r(e.finalScaleVar)
    this.stepScale = (finalScale - initialScale)/this.life

    this.initialSpeed = e.initialSpeed + r(e.initialSpeedVar)
    let finalSpeed = e.finalSpeed + r(e.finalSpeedVar)
    this.stepSpeed = (finalSpeed - initialSpeed)/this.life

    this.initialColor = [
      c(e.initialColor[0] + r(e.initialColorVar[0]), 0, 255),
      c(e.initialColor[1] + r(e.initialColorVar[1]), 0, 255),
      c(e.initialColor[2] + r(e.initialColorVar[2]), 0, 255)
    ]
    let finalColor = [
      c(e.finalColor[0] + r(e.finalColorVar[0]), 0, 255),
      c(e.finalColor[1] + r(e.finalColorVar[1]), 0, 255),
      c(e.finalColor[2] + r(e.finalColorVar[2]), 0, 255)
    ]
    this.stepColor[0] = (finalColor[0] - this.initialColor[0])/this.life
    this.stepColor[1] = (finalColor[1] - this.initialColor[1])/this.life
    this.stepColor[2] = (finalColor[2] - this.initialColor[2])/this.life

    this.gravityX = e.gravityX
    this.gravityY = e.gravityY

    this.radialAcceleration = e.radialAcceleration + r(e.radialAccelerationVar)
    this.tangentialAcceleration = e.tangentialAcceleration + r(e.tangentialAccelerationVar)
    
    // // set working values
    // if (e.emissionAngleFromCenter) {
    //   let angle = Math.atan2(
    //     e.emissionY-this.initialY,
    //     e.emissionX-this.initialX
    //   )
    //   this.dirX = -Math.cos(angle)
    //   this.dirY = -Math.sin(angle)
    // } else {
    //   let angle = e.emissionAngle + r(e.emissionAngleVar)
    //   this.dirX = Math.cos(angle)
    //   this.dirY = Math.sin(angle)
    // }
    
    // this.visible = true
    // this.life = this.initialLife
    // this.scale.x = this.initialScale
    // this.scale.y = this.scale.x
    // this.x = this.initialX
    // this.y = this.initialY
    // this.alpha = this.initialAlpha
    // this.rotation = this.initialRotation
    // this.speed = this.initialSpeed
  }

  /**
   * Kills a particle.
   */
  kill() {
    this.visible = false
    this.alpha = 0
  }

  /**
   * Update the particle, called by the emitter every update. Notice that, this
   * method is only called if the particle is alive.
   */
  update(delta) {
    let milliseconds = delta*1000

    // update life
    this.life -= milliseconds
    if (this.life <= 0) return

    // compute the progression of the particle
    let t = 1 - this.life/this.initialLife

    // compute tangential and radial acceleration
    let x = this.x - this.initialX
    let y = this.y - this.initialY
    let vx = 0
    let vy = 0
    if (x || y) {
      let norm = Math.sqrt(x*x + y*y)
      vx = x/norm
      vy = y/norm
    }
    let radX = vx*this.radialAcceleration
    let radY = vy*this.radialAcceleration
    let tanX = -vy*this.tangentialAcceleration
    let tanY = vx*this.tangentialAcceleration

    // compute the new direction
    this.dirX += (radX + tanX + this.gravityX)*delta
    this.dirY += (radY + tanY + this.gravityY)*delta

    // interpolate the simple values
    if (this.alphaEnabled) {
      this.alpha = utils.lerp(
        this.initialAlpha,
        this.finalAlpha,
        this.alphaEase(t)
      )
    }

    if (this.scaleEnabled) {
      this.scale.x = utils.lerp(
        this.initialScale,
        this.finalScale,
        this.scaleEase(t)
      )
      this.scale.y = this.scale.x
    }

    if (this.rotationEnabled) {
      this.rotation = utils.lerp(
        this.initialRotation,
        this.finalRotation,
        this.rotationEase(t)
      )
    }

    if (this.speedEnabled) {
      this.speed = utils.lerp(
        this.initialSpeed,
        this.finalSpeed,
        this.speedEase(t)
      )
    }

    if (this.colorEnabled) {
      let red = utils.lerp(
        this.initialColor[0],
        this.finalColor[0],
        this.colorEase(t)
      )
      let green = utils.lerp(
        this.initialColor[1],
        this.finalColor[1],
        this.colorEase(t)
      )
      let blue = utils.lerp(
        this.initialColor[2],
        this.finalColor[2],
        this.colorEase(t)
      )
      this.tint = (red<<16) + (green<<8) + (blue)
    }

    // compute new position
    this.x += this.dirX*this.speed*delta
    this.y += this.dirY*this.speed*delta
  }
}

module.exports = Particle