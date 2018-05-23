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

    this.initialX = 0
    this.initialY = 0
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
    this.initialX = x
    this.initialY = y
    this.blendMode = e.blendMode

    this.life = e.life + r(e.lifeVar)

    this.initialAlpha = c(e.initialAlpha + r(e.initialAlphaVar), 0, 1)
    let finalAlpha = c(e.finalAlpha + r(e.finalAlphaVar), 0, 1)
    this.stepAlpha = (finalAlpha - this.initialAlpha)/this.life

    this.initialRotation = e.initialRotation + r(e.initialRotationVar)
    let finalRotation = e.finalRotation + r(e.finalRotationVar)
    this.stepRotation = (finalRotation - this.initialRotation)/this.life

    this.initialScale = e.initialScale + r(e.initialScaleVar)
    let finalScale = e.finalScale + r(e.finalScaleVar)
    this.stepScale = (finalScale - this.initialScale)/this.life

    this.initialSpeed = e.initialSpeed + r(e.initialSpeedVar)
    let finalSpeed = e.finalSpeed + r(e.finalSpeedVar)
    this.stepSpeed = (finalSpeed - this.initialSpeed)/this.life

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
    
    // set working values
    if (e.emissionAngleFromCenter) {
      let angle = Math.atan2(-this.y, -this.x)
      this.dirX = -Math.cos(angle)
      this.dirY = -Math.sin(angle)
      this.initialX = e.x
      this.initialY = e.y
    } else {
      let angle = e.emissionAngle + r(e.emissionAngleVar)
      this.dirX = Math.cos(angle)
      this.dirY = Math.sin(angle)
    }
    
    this.visible = true
    this.color = [
      this.initialColor[0],
      this.initialColor[1],
      this.initialColor[2],
    ]
    this.scale.x = this.initialScale
    this.scale.y = this.initialScale
    this.alpha = this.initialAlpha
    this.rotation = this.initialRotation
    this.speed = this.initialSpeed
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
  update(elapsed, delta) {
    // update life
    this.life -= elapsed
    if (this.life <= 0) return

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
    this.alpha = this.alpha + this.stepAlpha*elapsed
    this.scale.x = this.scale.x + this.stepScale*elapsed
    this.scale.y =this.scale.x
    this.rotation = this.rotation + this.stepRotation*elapsed
    this.speed = this.speed + this.stepSpeed*elapsed
    this.color[0] = this.color[0] + this.stepColor[0]*elapsed
    this.color[1] = this.color[1] + this.stepColor[1]*elapsed
    this.color[2] = this.color[2] + this.stepColor[2]*elapsed
    this.tint = (this.color[0]<<16) + (this.color[1]<<8) + (this.color[2])
    
    // compute new position
    this.x += this.dirX*this.speed*delta
    this.y += this.dirY*this.speed*delta
  }
}

module.exports = Particle