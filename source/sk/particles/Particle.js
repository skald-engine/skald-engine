import * as utils from 'sk/utils'

export default class Particle extends PIXI.Sprite {
  constructor(emitter) {
    super()

    this.emitter = emitter

    this.initialLife = 0
    this.initialX = 0
    this.initialY = 0

    this.initialAlpha = 0
    this.finalAlpha = 0
    this.initialRotation = 0
    this.finalRotation = 0
    this.initialScale = 0
    this.finalScale = 0
    this.initialSpeed = 0
    this.finalSpeed = 0

    this.gravityX = 0
    this.gravityY = 0
    this.radialAcceleration = 0
    this.tangentialAcceleration = 0
    
    this.dirX = 0
    this.dirY = 0
    this.life = 0

    this.alpha = 0 // force hidden on particle container
    this.anchor.x = .5
    this.anchor.y = .5
  }

  setTexture(textures) {
    this._texture = utils.random.choose(textures)
  }

  reset(x, y) {
    let e = this.emitter
    let r = utils.random.polar

    // stored values
    this.blendMode = e.blendMode
    this.initialLife = e.life + r(e.lifeVar)
    this.initialX = x
    this.initialY = y
    this.initialAlpha = e.startAlpha + r(e.startAlphaVar)
    this.finalAlpha = e.endAlpha + r(e.endAlphaVar)
    this.initialRotation = e.startRotation + r(e.startRotationVar)
    this.finalRotation = e.endRotation + r(e.endRotationVar)
    this.initialScale = e.startScale + r(e.startScaleVar)
    this.finalScale = e.endScale + r(e.endScaleVar)
    this.initialSpeed = e.startSpeed + r(e.startSpeedVar)
    this.finalSpeed = e.endSpeed + r(e.endSpeedVar)
    this.initialColor = [
      utils.clip(e.startColor[0] + r(e.startColorVar[0]), 0, 255),
      utils.clip(e.startColor[1] + r(e.startColorVar[1]), 0, 255),
      utils.clip(e.startColor[2] + r(e.startColorVar[2]), 0, 255)
    ]
    this.finalColor = [
      utils.clip(e.endColor[0] + r(e.endColorVar[0]), 0, 255),
      utils.clip(e.endColor[1] + r(e.endColorVar[1]), 0, 255),
      utils.clip(e.endColor[2] + r(e.endColorVar[2]), 0, 255)
    ]
    this.colorEnabled = 
      this.initialColor[0] !== this.finalColor[0] ||
      this.initialColor[1] !== this.finalColor[1] ||
      this.initialColor[2] !== this.finalColor[2]

    this.gravityX = e.gravityX
    this.gravityY = e.gravityY
    this.radialAcceleration = e.radialAcceleration + r(e.radialAccelerationVar)
    this.tangentialAcceleration = e.tangentialAcceleration + 
                                    r(e.tangentialAccelerationVar)
    this.speedEase = e.speedEase
    this.rotationEase = e.rotationEase
    this.scaleEase = e.scaleEase
    this.alphaEase = e.alphaEase
    this.colorEase = e.colorEase

    // set working values
    if (e.emissionAngleFromCenter) {
      let angle = Math.atan2(
        e.emissionY-this.initialY,
        e.emissionX-this.initialX
      )
      this.dirX = -Math.cos(angle)
      this.dirY = -Math.sin(angle)
    } else {
      let angle = e.emissionAngle + r(e.emissionAngleVar)
      this.dirX = Math.cos(angle)
      this.dirY = Math.sin(angle)
    }
    
    this.visible = true
    this.life = this.initialLife
    this.scale.x = this.initialScale
    this.scale.y = this.scale.x
    this.x = this.initialX
    this.y = this.initialY
    this.alpha = this.initialAlpha
    this.rotation = this.initialRotation
    this.speed = this.initialSpeed
  }

  kill() {
    this.visible = false
    this.alpha = 0
  }

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
    this.alpha = utils.lerp(
      this.initialAlpha,
      this.finalAlpha,
      this.alphaEase(t)
    )
    this.scale.x = utils.lerp(
      this.initialScale,
      this.finalScale,
      this.scaleEase(t)
    )
    this.scale.y = this.scale.x
    this.rotation = utils.lerp(
      this.initialRotation,
      this.finalRotation,
      this.rotationEase(t)
    )
    this.speed = utils.lerp(
      this.initialSpeed,
      this.finalSpeed,
      this.speedEase(t)
    )

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