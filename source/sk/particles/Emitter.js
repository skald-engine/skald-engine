import {BLEND_MODE} from 'sk/constants'
import * as utils from 'sk/utils'
import RectEmissor from 'sk/particles/emissors/RectEmissor'
import Particle from 'sk/particles/Particle'

/**
 * The base for the skald particle system.
 *
 * 
 */
export default class Emitter {
  constructor(container, textures, data) {
    // internal
    this._emissionTime = 0
    this._burstTime = 0
    this._elapsed = 0
    this._counter = 0
    this._container = container
    this._particles = []
    this._textures = textures || []
    this._blendMode = BLEND_MODE.NORMAL

    // general
    this._active = false
    this._duration = 0
    this._maxParticles = 1000
    this._life = 1000
    this._lifeVar =  0
    this._emissor = new RectEmissor()

    // emission
    this._emissionRate = 100
    this._emissionX = 0
    this._emissionY = 0
    this._emissionAngle = 0
    this._emissionAngleVar = Math.PI
    this._emissionAngleFromCenter = false

    // burst
    this._burstInterval = 0
    this._burstMin = 30
    this._burstMax = 50

    // speed
    this._startSpeed = 100
    this._startSpeedVar = 0
    this._endSpeed = 100
    this._endSpeedVar = 0
    this._speedEase = utils.easing.linear

    // rotation
    this._startRotation = 0
    this._startRotationVar = 0
    this._endRotation = 0
    this._endRotationVar = 0
    this._rotationEase = utils.easing.linear

    // scale
    this._startScale = 1
    this._startScaleVar = 0
    this._endScale = 1
    this._endScaleVar = 0
    this._scaleEase = utils.easing.linear

    // alpha
    this._startAlpha = 1
    this._startAlphaVar = 0
    this._endAlpha = 0
    this._endAlphaVar = 0
    this._alphaEase = utils.easing.linear

    // color
    this._startColor = [255, 255, 255]
    this._startColorVar = [0, 0, 0]
    this._endColor = [255, 255, 255]
    this._endColorVar = [0, 0, 0]
    this._colorEase = utils.easing.linear

    // other forces
    this._gravityX = 0
    this._gravityY = 0
    this._radialAcceleration = 0
    this._radialAccelerationVar = 0
    this._tangentialAcceleration = 0
    this._tangentialAccelerationVar = 0

    // initialize the particle system
    this._emissor.setup(this)
    this._setupParticles()
    this._setupTextures()
    if (data) { this.configure(data) }
  }

  /**
   * The amount of alive particles in this emitter. Readonly.
   * @type {Integer}
   */
  get counter() { return this._counter }

  /**
   * Array of all particles. Readonly.
   * @type {Array<Particle>}
   */
  get particles() { return this._particles }

  /**
   * List of textures.
   * @type {Array<PIXI.Texture>}
   */
  get textures() { return this._textures }
  set textures(v) {
    if (!Array.isArray(v)) {
      v = [v]
    }

    for (let i=0; i<v.length; i++) {
      if (!(v[i] instanceof PIXI.Texture)) {
        throw new Error(`Invalid texture to emitter. You must provide a pixi `+
                        `texture or an array of pixi textures.`)
      }
    }

    this._textures = v
    this._setupTextures()
  }

  /**
   * Particles blend mode. Notice that, if you are using ParticleContainer, 
   * the particle blend mode will be ignored. Set the blend mode of the 
   * particle contained instead.
   *
   * You also should notice that webgl only supports normal, add, multiply and
   * screen.
   *
   * Defaults to NORMAL.
   */
  get blendMode() { return this._blendMode }
  set blendMode(v) { this._blendMode = v}

  /**
   * Whether this emitter is active (creating new particles) or not. Defaults
   * to false.
   * @type {Boolean}
   */
  get active() { return this._active }
  set active(v) { this._active = v }
  
  /**
   * Duration of the emitter in milliseconds. After this duration, the emitter
   * will deactivate itself. If you want a continuous emitter, set duration to
   * 0 (zero). Defaults to 0.
   * @type {Integer}
   */
  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  /**
   * Maximum number of particles in this emitter. Defaults to 1000.
   * @type {Integer}
   */
  get maxParticles() { return this._maxParticles }
  set maxParticles(v) {
    this._maxParticles = v
    this._setupParticles()
  }
  
  /**
   * Base life span of each particle, in milliseconds. Defaults to 1000 (1 
   * second).
   * @type {Integer}
   */
  get life() { return this._life }
  set life(v) { this._life = parseInt(v) }
  
  /**
   * Variation of the particle life span, in milliseconds. Defaults to 0.
   * @type {Integer}
   */
  get lifeVar() { return this._lifeVar }
  set lifeVar(v) { this._lifeVar = parseInt(v) }
  
  /**
   * Emissor attached to this emitter. The role of the emissor is to generate
   * the position of the new particles. 
   * @type {Emissor}
   */
  get emissor() { return this._emissor }
  set emissor(v) {
    if (this._emissor) {
      this._emissor._emitter = null
    }
    this._emissor = v
    this._emissor.setup(this)
  }


  /**
   * Rate of particle emission, in particles per second. The emitter will try 
   * to create new particles in a fixed time interval. Defaults to 100 
   * particles per second. The minimum value for this attribute is 1.
   * @type {Number}
   */
  get emissionRate() { return this._emissionRate }
  set emissionRate(v) {
    this._emissionRate = (v < 0)? 0 : v
  }

  /**
   * Center in the X axis of the emitter, all particles will be spawned around 
   * this position, depending on the emissor. Defaults to 0.
   * @type {Integer}
   */
  get emissionX() { return this._emissionX }
  set emissionX(v) { this._emissionX = v }

  /**
   * Center in the Y axis of the emitter, all particles will be spawned around 
   * this position, depending on the emissor. Defaults to 0.
   * @type {Integer}
   */
  get emissionY() { return this._emissionY }
  set emissionY(v) { this._emissionY = v }

  /**
   * Center angle of the emitter. All particles will be spawned with the 
   * direction around it, depending on the emissor. This variable is in 
   * radians. Defaults to 0 (towards right).
   * @type {Number}
   */
  get emissionAngle() { return this._emissionAngle }
  set emissionAngle(v) { this._emissionAngle = v }

  /**
   * Variation of the emission angle, in radians. Defaults to PI (360 
   * degrees).
   * @type {Number}
   */
  get emissionAngleVar() { return this._emissionAngleVar }
  set emissionAngleVar(v) { this._emissionAngleVar = v }

  /**
   * If true, the initial particle direction will be fixed to be away from the
   * center. Defaults to false.
   * @type {Boolean}
   */
  get emissionAngleFromCenter() { return this._emissionAngleFromCenter }
  set emissionAngleFromCenter(v) { this._emissionAngleFromCenter = !!v }


  /**
   * Interval of the bursts in this emitter, in milliseconds. This can run 
   * altogether with the continuous emissor. Use 0 (zero) to disable the burst.
   * Notice that, if you want to disable the countinous emissor and use only
   * the burst mode, set the `emissionRate` to 0 (zero). Defaults to 0 
   * (disabled).
   * @type {Integer}
   */
  get burstInterval() { return this._burstInterval }
  set burstInterval(v) { this._burstInterval = parseInt(v) }

  /**
   * Minimum amount of particles created by a single burst. Defaults to 30 
   * particles.
   * @type {Integer}
   */
  get burstMin() { return this._burstMin }
  set burstMin(v) { this._burstMin = parseInt(v) }

  /**
   * Maximum amount of particles created by a single burst. Defaults to 50
   * particles.
   * @type {Integer}
   */
  get burstMax() { return this._burstMax }
  set burstMax(v) { this._burstMax = parseInt(v) }


  /**
   * Initial speed of the particle, in pixels per seconds. Defaults to 100.
   * @type {Number}
   */
  get startSpeed() { return this._startSpeed }
  set startSpeed(v) { this._startSpeed = v }

  /**
   * Variation of the initial speed of the particle, in pixels per seconds.
   * Defaults to 0.
   * @type {Number}
   */
  get startSpeedVar() { return this._startSpeedVar }
  set startSpeedVar(v) { this._startSpeedVar = v }

  /**
   * Final speed of the particle, in pixels per seconds. Defaults to 100.
   * @type {Number}
   */
  get endSpeed() { return this._endSpeed }
  set endSpeed(v) { this._endSpeed = v }

  /**
   * Variation of the final speed of the particle, in pixels per seconds. 
   * Defaults to 0.
   * @type {Number}
   */
  get endSpeedVar() { return this._endSpeedVar }
  set endSpeedVar(v) { this._endSpeedVar = v }

  /**
   * Shortcut to setting startSpeed and endSpeed with the same value. Setter 
   * only.
   */
  set speed(v) {
    this.startSpeed = v
    this.endSpeed = v
  }
  /**
   * Shortcut to setting startSpeedVar and endSpeedVar with the same value. 
   * Setter only.
   */
  set speedVar(v) {
    this.startSpeedVar = v
    this.endSpeedVar = v
  }

  /**
   * Easing function that will be applied to the speed interpolation. Defaults 
   * to linear.
   * @type {Function}
   */
  get speedEase() { return this._speedEase }
  set speedEase(v) { this._speedEase = v }


  /**
   * Initial rotation of the particle, in radians. Defaults to 0.
   * @type {Number}
   */
  get startRotation() { return this._startRotation }
  set startRotation(v) { this._startRotation = v }

  /**
   * Variation of the initial rotation of the particle, in radians. Defaults 
   * to 0.
   * @type {Number}
   */
  get startRotationVar() { return this._startRotationVar }
  set startRotationVar(v) { this._startRotationVar = v }

  /**
   * Final rotation of the particle, in radians. Defaults to 0.
   * @type {Number}
   */
  get endRotation() { return this._endRotation }
  set endRotation(v) { this._endRotation = v }

  /**
   * Variation of the final rotation of the particle, in radians. Defaults 
   * to 0.
   * @type {Number}
   */
  get endRotationVar() { return this._endRotationVar }
  set endRotationVar(v) { this._endRotationVar = v }

  /**
   * Shortcut to setting startRotation and endRotation with the same value. 
   * Setter only.
   */
  set rotation(v) {
    this.startRotation = v
    this.endRotation = v
  }
  /**
   * Shortcut to setting startRotationVar and endRotationVar with the same 
   * value. Setter only.
   */
  set rotationVar(v) {
    this.startRotationVar = v
    this.endRotationVar = v
  }

  /**
   * Easing function that will be applied to the rotation interpolation. 
   * Defaults to linear.
   * @type {Function}
   */
  get rotationEase() { return this._rotationEase }
  set rotationEase(v) { this._rotationEase = v }


  /**
   * Initial scale of the particle as a multiplier of the original texture 
   * size. Defaults to 1.
   * @type {Number}
   */
  get startScale() { return this._startScale }
  set startScale(v) { this._startScale = v }

  /**
   * Variation of the initial scale of the particle as a multiplier of the 
   * original texture size. Defaults to 0.
   * @type {Number}
   */
  get startScaleVar() { return this._startScaleVar }
  set startScaleVar(v) { this._startScaleVar = v }

  /**
   * Final scale of the particle as a multiplier of the original texture size.
   * Defaults to 1.
   * @type {Number}
   */
  get endScale() { return this._endScale }
  set endScale(v) { this._endScale = v }

  /**
   * Variation of the final scale of the particle as a multiplier of the 
   * original texture size. Defaults to 0.
   * @type {Number}
   */
  get endScaleVar() { return this._endScaleVar }
  set endScaleVar(v) { this._endScaleVar = v }

  /**
   * Shortcut to setting startScale and endScale with the same value. 
   * Setter only.
   */
  set scale(v) {
    this.startScale = v
    this.endScale = v
  }
  /**
   * Shortcut to setting startScaleVar and endScaleVar with the same 
   * value. Setter only.
   */
  set scaleVar(v) {
    this.startScaleVar = v
    this.endScaleVar = v
  }

  /**
   * Easing function that will be applied to the interpolation of the scale
   * value. Defaults to linear.
   * @type {Number}
   */
  get scaleEase() { return this._scaleEase }
  set scaleEase(v) { this._scaleEase = v }


  /**
   * Inital value of the particle alpha. Defaults to 1.
   * @type {Number}
   */
  get startAlpha() { return this._startAlpha }
  set startAlpha(v) { this._startAlpha = v }

  /**
   * Variation of the inital value of the particle alpha. Defaults to 0.
   * @type {Number}
   */
  get startAlphaVar() { return this._startAlphaVar }
  set startAlphaVar(v) { this._startAlphaVar = v }

  /**
   * Final value of the particle alpha. Defaults to 0.
   * @type {Number}
   */
  get endAlpha() { return this._endAlpha }
  set endAlpha(v) { this._endAlpha = v }

  /**
   * Variation of the final value of the particle alpha. Defaults to 0.
   * @type {Number}
   */
  get endAlphaVar() { return this._endAlphaVar }
  set endAlphaVar(v) { this._endAlphaVar = v }

  /**
   * Shortcut to setting startColor and endColor with the same value. 
   * Setter only.
   */
  set color(v) {
    this.startColor = v
    this.endColor = v
  }
  /**
   * Shortcut to setting startColorVar and endColorVar with the same 
   * value. Setter only.
   */
  set colorVar(v) {
    this.startColorVar = v
    this.endColorVar = v
  }
  
  /**
   * Easing function that will be applied to the interpolation of the alpha
   * value. Defaults to linear.
   * @type {Number}
   */
  get alphaEase() { return this._alphaEase }
  set alphaEase(v) { this._alphaEase = v }


  /**
   * Inital value of the particle tint. Defaults to [255, 255, 255]. Notice 
   * that this will only work in Container, not ParticleContainers.
   * @type {Number}
   */
  get startColor() { return this._startColor }
  set startColor(v) { this._startColor = v }

  /**
   * Variation of the inital value of the particle tint. Defaults to [0, 0, 0].
   * @type {Number}
   */
  get startColorVar() { return this._startColorVar }
  set startColorVar(v) { this._startColorVar = v }

  /**
   * Final value of the particle tint. Defaults to [255, 255, 255].
   * @type {Number}
   */
  get endColor() { return this._endColor }
  set endColor(v) { this._endColor = v }

  /**
   * Variation of the final value of the particle tint. Defaults to [0, 0, 0].
   * @type {Number}
   */
  get endColorVar() { return this._endColorVar }
  set endColorVar(v) { this._endColorVar = v }

  /**
   * Shortcut to setting startAlpha and endAlpha with the same value. 
   * Setter only.
   */
  set alpha(v) {
    this.startAlpha = v
    this.endAlpha = v
  }
  /**
   * Shortcut to setting startAlphaVar and endAlphaVar with the same 
   * value. Setter only.
   */
  set alphaVar(v) {
    this.startAlphaVar = v
    this.endAlphaVar = v
  }

  /**
   * Easing function that will be applied to the interpolation of the tint
   * value. Defaults to linear.
   * @type {Number}
   */
  get colorEase() { return this._colorEase }
  set colorEase(v) { this._colorEase = v }



  /**
   * Gravity acceleration applied to all particles in the X axis. Defaults to 
   * 0.
   * @type {Number}
   */
  get gravityX() { return this._gravityX }
  set gravityX(v) { this._gravityX = v }

  /**
   * Gravity acceleartion applied to all particles in the Y axis. Defaults to
   * 0.
   * @type {Number}
   */
  get gravityY() { return this._gravityY }
  set gravityY(v) { this._gravityY = v }

  /**
   * Radial acceleration of all particles, in pixels per second. The radial 
   * acceleration push the particles away from the center of the emitter 
   * center. Defaults to 0.
   * @type {Number}
   */
  get radialAcceleration() { return this._radialAcceleration }
  set radialAcceleration(v) { this._radialAcceleration = v }

  /**
   * Variation of the radial acceleration, in pixels per second. Defaults to 0.
   * @type {Number}
   */
  get radialAccelerationVar() { return this._radialAccelerationVar }
  set radialAccelerationVar(v) { this._radialAccelerationVar = v }

  /**
   * Tangential acceleartion of all particles, in pixels per second. The
   * tangential acceleration push the particles perpendicular to the particle
   * direction. Defaults to 0.
   * @type {Number}
   */
  get tangentialAcceleration() { return this._tangentialAcceleration }
  set tangentialAcceleration(v) { this._tangentialAcceleration = v }

  /**
   * Variation of the tangential acceleration, in pixels per second. Defaults 
   * to 0.
   * @type {Number}
   */
  get tangentialAccelerationVar() { return this._tangentialAccelerationVar }
  set tangentialAccelerationVar(v) { this._tangentialAccelerationVar = v }



  /**
   * Setup the particles, creating or removing particles in the particle pool.
   */
  _setupParticles() {
    let difference = this._maxParticles - this._particles.length

    // Should remove because there is more particles than the max
    if (difference < 0) {
      this._container.removeChildren(this._maxParticles)
      this._particles = this._container.children.slice()
    }

    // Should add because there there is less particles than the max
    else if (difference > 0) {
      for (let i=0; i<difference; i++) {
        let p = new Particle(this)
        p._$containerIndex = this._container.children.length
        this._particles.push(p)
        this._container.addChild(p)
      }
    }
  }

  /**
   * Setup the particle textures.
   */
  _setupTextures() {
    let minIndex = 100000

    // Update only the alive particles, because the texture is reseted 
    // everytime the particle is created
    for (let i=0; i<this._counter; i++) {
      let texture = utils.random.choose(this._textures)
      if (!texture) return

      let p = this._particles[i]
      p.texture = texture
      minIndex = Math.min(p._$containerIndex, minIndex)
    }

    // Notify the changes to the container (required for the ParticleContainer)
    if (minIndex < 100000) {
      this._container.onChildrenChange(minIndex)
    }
  }

  /**
   * Add new particle. In practice, it will only reset the particle and make it
   * alive again.
   */
  _addParticle() {
    if (this._counter >= this._maxParticles) return

    let p = this._particles[this._counter]
    let {x, y} = this._emissor.next()

    let t1 = p.texture
    p.setTexture(this._textures)
    if (p.texture !== t1) {
      this._container.onChildrenChange(p._$containerIndex)
    }

    p.reset(x, y)
    this._counter += 1
  }

  /**
   * Kill a particle.
   */
  _removeParticle(i) {
    let p = this._particles[i]
    this._particles[i] = this._particles[this._counter-1]
    this._particles[this._counter-1] = p
    
    p.kill()
    this._counter -= 1
  }

  /**
   * Helper method to set a batch a variables to this object. Notice that, this
   * methods uses `Object.assign` internally, thus it only shallow copy the
   * input values. If you need a deep copy, check {@sk.utils.deepClone}.
   *
   * Example:
   *
   *     container.configure({x:4, y:5})
   *
   * @param {Object} config - The object containing the target variables.
   * @return {Container} This object.
   */
  configure(config) {
    Object.assign(this, config)
    return this
  }

  /**
   * Activates the particle system and reseting the emission time.
   */
  start() {
    this._active = true
    this._elapsed = 0
    this._emissionTime = 0
    this._burstTime = 0
  }

  /**
   * Deactivates the particle system, making it stop to producing new 
   * particles.
   */
  stop() {
    this._active = false
  }

  /**
   * Forces the burst of particles, without changing the configured burst
   * values. You may provide a single integer, specifying the exact number
   * of particles to be created in the burst, or you may provide two integers
   * with the minimum and maximum number of particles, generating a number of 
   * particles between these two. If you don't provide anything, this method
   * will use the `burstMin` and `burstMax` values.
   *
   * @param {Integer} min - The minimum amount of particles.
   * @param {Integer} max - The maximum amount of particles.
   */
  burst(min, max) {
    if (typeof min === 'undefined') min = this._burstMin
    if (typeof max === 'undefined') max = this._burstMax

    let n = utils.random.int(min, max)
    while (n > 0 && this._counter < this._maxParticles) {
      this._addParticle()
      n--
    }
  }

  /**
   * Update the particle system.
   */
  update(delta) {
    let milliseconds = delta*1000

    if (this._active) {
      this._elapsed += milliseconds

      // Continuous emission
      if (this._emissionRate) {
        this._emissionTime += delta
        let rate = 1./this._emissionRate
        
        // Create the particles
        while (this._emissionTime > rate && 
               this._counter < this._maxParticles) {

          this._addParticle()
          this._emissionTime -= rate
        }
      }

      // Burst emission
      if (this._burstInterval) {
        this._burstTime += milliseconds

        while (this._burstTime > this._burstInterval) {
          this.burst()
          this._burstTime -= this._burstInterval
        }
      }

      // Deactivate the emitter if duration has been reached
      if (this._duration && this._elapsed > this._duration) {
        this._active = false
      }
    }
    
    // Update alive particles
    let i = 0
    let N = this._counter
    while (i < N) {
      let p = this._particles[i]

      // Update life
      p.update(delta)

      // Kill the particle
      if (p.life <= 0) {
        p.kill()
        N -= 1
        this._particles[i] = this._particles[N]
        this._particles[N] = p
        continue
      }

      i++
    }
  

    // Cap emission time to avoid infinity accumulation
    this._emissionTime = Math.min(this._emissionTime, 1000/this._emissionRate)
    this._counter = N
  }

}