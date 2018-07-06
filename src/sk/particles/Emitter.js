const pixi = require('pixi.js')
const $ = require('sk/$')
const C = require('sk/constants')
const random = require('sk/random')
const CircleEmissor = require('sk/particles/emissors/CircleEmissor')
const Particle = require('sk/particles/Particle')

const DEFAULTS = {
  blendMode                 : C.BLEND_MODE.NORMAL,
  mode                      : C.EMITTER_MODE.EMISSION,

  autoStart                 : true,
  maxParticles              : 1000,
  duration                  : -1,
  
  emissionRate              : 100,
  emissionAngle             : 0,
  emissionAngleVar          : Math.PI,
  emissionAngleFromCenter   : true,
  
  burstInterval             : 1000,
  burstMin                  : 1,
  burstMax                  : 5,
  
  life                      : 1000,
  lifeVar                   : 0,
  
  startSpeed                : 100,
  startSpeedVar             : 0,
  endSpeed                  : 100,
  endSpeedVar               : 0,
  
  startRotation             : 0,
  startRotationVar          : 0,
  endRotation               : 0,
  endRotationVar            : 0,
  
  startScale                : 1,
  startScaleVar             : 0,
  endScale                  : 1,
  endScaleVar               : 0,
  
  startAlpha                : 1,
  startAlphaVar             : 0,
  endAlpha                  : 0,
  endAlphaVar               : 0,
  
  startColor                : [255, 255, 255],
  startColorVar             : [0, 0, 0],
  endColor                  : [255, 255, 255],
  endColorVar               : [0, 0, 0],
  
  gravityX                  : 0,
  gravityY                  : 0,
  radialAcceleration        : 0,
  radialAccelerationVar     : 0,
  tangentialAcceleration    : 0,
  tangentialAccelerationVar : 0,
}

class Emitter extends pixi.Container {
  constructor(textures, options, emissor=null, container=null) {
    super()

    this._textures = Array.isArray(textures)? textures : [textures]
    this._emissor = emissor || new CircleEmissor()
    this._container = container
    try {
      this._container = new container()
    } catch (e) {
      this._container = container || new pixi.Container()
    }

    // Internal control
    this._paused = false
    this._active = false
    this._elapsed = 0
    this._burstTime = 0
    this._emissionTime = 0
    this._particles = []
    this._counter = 0
    this._schedule = $.getInjector().resolve('schedule')

    // emitter parameter
    this._mode = null
    this._blendMode = null
    this._duration = null
    this._maxParticles = null

    // - emission
    this._emissionRate = null
    this._emissionAngle = null
    this._emissionAngleVar = null
    this._emissionAngleFromCenter = null

    // - burst
    this._burstInterval = null
    this._burstMin = null
    this._burstMax = null

    // life
    this._life = null
    this._lifeVar = null

    // speed
    this._initialSpeed = null
    this._initialSpeedVar = null
    this._finalSpeed = null
    this._finalSpeedVar = null

    // rotation
    this._initialRotation = null
    this._initialRotationVar = null
    this._finalRotation = null
    this._finalRotationVar = null

    // scale
    this._initialScale = null
    this._initialScaleVar = null
    this._finalScale = null
    this._finalScaleVar = null

    // alpha
    this._initialAlpha = null
    this._initialAlphaVar = null
    this._finalAlpha = null
    this._finalAlphaVar = null

    // color
    this._initialColor = null
    this._initialColorVar = null
    this._finalColor = null
    this._finalColorVar = null

    // other forces
    this._gravityX = null
    this._gravityY = null
    this._radialAcceleration = null
    this._radialAccelerationVar = null
    this._tangentialAcceleration = null
    this._tangentialAccelerationVar = null

    this._tick = this._tick.bind(this)
    this.addChild(this._container)

    this._initialize(options || {})
    this._setupParticles()
    this._setupTextures()

    if (this._autoStart) {
      this.start()
    }
  }

  get paused() { return this._paused }
  get active() { return this._active }
  get counter() { return this._counter }
  get particles() { return this._particles }

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

  get blendMode() { return this._blendMode }
  set blendMode(v) { this._blendMode = v}

  get mode() { return this._mode }
  set mode(v) {
    this._mode = v
    if (this._mode === C.EMITTER_MODE.EMISSION) {
      this._burstTime = null;
    } else if (this._mode === C.EMITTER_MODE.BURST) {
      this._emissionTime = 0;
    }
  }

  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  get maxParticles() { return this._maxParticles }
  set maxParticles(v) {
    this._maxParticles = v
    this._setupParticles()
    this._setupTextures()
  }
  
  get life() { return this._life }
  set life(v) { this._life = parseInt(v) }
  
  get lifeVar() { return this._lifeVar }
  set lifeVar(v) { this._lifeVar = parseInt(v) }
  
  get emissor() { return this._emissor }
  set emissor(v) { this._emissor = v }

  get emissionRate() { return 1000/this._emissionRate }
  set emissionRate(v) { this._emissionRate = 1000/v }

  get emissionAngle() { return this._emissionAngle }
  set emissionAngle(v) { this._emissionAngle = v }

  get emissionAngleVar() { return this._emissionAngleVar }
  set emissionAngleVar(v) { this._emissionAngleVar = v }

  get emissionAngleFromCenter() { return this._emissionAngleFromCenter }
  set emissionAngleFromCenter(v) { this._emissionAngleFromCenter = !!v }

  get burstInterval() { return this._burstInterval }
  set burstInterval(v) { this._burstInterval = parseInt(v) }

  get burstMin() { return this._burstMin }
  set burstMin(v) { this._burstMin = parseInt(v) }

  get burstMax() { return this._burstMax }
  set burstMax(v) { this._burstMax = parseInt(v) }

  get initialSpeed() { return this._initialSpeed }
  set initialSpeed(v) { this._initialSpeed = v }

  get initialSpeedVar() { return this._initialSpeedVar }
  set initialSpeedVar(v) { this._initialSpeedVar = v }

  get finalSpeed() { return this._finalSpeed }
  set finalSpeed(v) { this._finalSpeed = v }

  get finalSpeedVar() { return this._finalSpeedVar }
  set finalSpeedVar(v) { this._finalSpeedVar = v }

  get initialRotation() { return this._initialRotation }
  set initialRotation(v) { this._initialRotation = v }

  get initialRotationVar() { return this._initialRotationVar }
  set initialRotationVar(v) { this._initialRotationVar = v }

  get finalRotation() { return this._finalRotation }
  set finalRotation(v) { this._finalRotation = v }

  get finalRotationVar() { return this._finalRotationVar }
  set finalRotationVar(v) { this._finalRotationVar = v }

  get initialScale() { return this._initialScale }
  set initialScale(v) { this._initialScale = v }

  get initialScaleVar() { return this._initialScaleVar }
  set initialScaleVar(v) { this._initialScaleVar = v }

  get finalScale() { return this._finalScale }
  set finalScale(v) { this._finalScale = v }

  get finalScaleVar() { return this._finalScaleVar }
  set finalScaleVar(v) { this._finalScaleVar = v }

  get initialAlpha() { return this._initialAlpha }
  set initialAlpha(v) { this._initialAlpha = v }

  get initialAlphaVar() { return this._initialAlphaVar }
  set initialAlphaVar(v) { this._initialAlphaVar = v }

  get finalAlpha() { return this._finalAlpha }
  set finalAlpha(v) { this._finalAlpha = v }

  get finalAlphaVar() { return this._finalAlphaVar }
  set finalAlphaVar(v) { this._finalAlphaVar = v }

  get initialColor() { return this._initialColor }
  set initialColor(v) { this._initialColor = v }

  get initialColorVar() { return this._initialColorVar }
  set initialColorVar(v) { this._initialColorVar = v }

  get finalColor() { return this._finalColor }
  set finalColor(v) { this._finalColor = v }

  get finalColorVar() { return this._finalColorVar }
  set finalColorVar(v) { this._finalColorVar = v }

  get gravityX() { return this._gravityX }
  set gravityX(v) { this._gravityX = v }

  get gravityY() { return this._gravityY }
  set gravityY(v) { this._gravityY = v }

  get radialAcceleration() { return this._radialAcceleration }
  set radialAcceleration(v) { this._radialAcceleration = v }

  get radialAccelerationVar() { return this._radialAccelerationVar }
  set radialAccelerationVar(v) { this._radialAccelerationVar = v }

  get tangentialAcceleration() { return this._tangentialAcceleration }
  set tangentialAcceleration(v) { this._tangentialAcceleration = v }

  get tangentialAccelerationVar() { return this._tangentialAccelerationVar }
  set tangentialAccelerationVar(v) { this._tangentialAccelerationVar = v }


  _initialize(options) {
    options = Object.assign({}, DEFAULTS, options);

    this._blendMode = options.blendMode
    this._mode = options.mode
    
    this._autoStart = options.autoStart
    this._maxParticles = options.maxParticles
    this._duration = options.duration
    
    this._emissionRate = 1000/options.emissionRate
    this._emissionAngle = options.emissionAngle
    this._emissionAngleVar = options.emissionAngleVar
    this._emissionAngleFromCenter = options.emissionAngleFromCenter
    
    this._burstInterval = options.burstInterval
    this._burstMin = options.burstMin
    this._burstMax = options.burstMax
    
    this._life = options.life
    this._lifeVar = options.lifeVar
    this._initialSpeed = options.startSpeed
    this._initialSpeedVar = options.startSpeedVar
    this._finalSpeed = options.endSpeed
    this._finalSpeedVar = options.endSpeedVar
    this._initialRotation = options.startRotation
    this._initialRotationVar = options.startRotationVar
    this._finalRotation = options.endRotation
    this._finalRotationVar = options.endRotationVar
    this._initialScale = options.startScale
    this._initialScaleVar = options.startScaleVar
    this._finalScale = options.endScale
    this._finalScaleVar = options.endScaleVar
    this._initialAlpha = options.startAlpha
    this._initialAlphaVar = options.startAlphaVar
    this._finalAlpha = options.endAlpha
    this._finalAlphaVar = options.endAlphaVar
    this._initialColor = options.startColor
    this._initialColorVar = options.startColorVar
    this._finalColor = options.endColor
    this._finalColorVar = options.endColorVar
    this._gravityX = options.gravityX
    this._gravityY = options.gravityY
    this._radialAcceleration = options.radialAcceleration
    this._radialAccelerationVar = options.radialAccelerationVar
    this._tangentialAcceleration = options.tangentialAcceleration
    this._tangentialAccelerationVar = options.tangentialAccelerationVar
  }

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

  _addParticle() {
    if (this._counter >= this._maxParticles) return

    let p = this._particles[this._counter]
    let {x, y} = this._emissor.create()

    let t1 = p.texture
    p.texture = random.choose(this._textures)
    if (p.texture !== t1) {
      this._container.onChildrenChange(p._$containerIndex)
    }

    p.reset(x, y, this)
    this._counter++
  }

  _removeParticle(i) {
    let p = this._particles[i]
    this._particles[i] = this._particles[this._counter-1]
    this._particles[this._counter-1] = p
    
    p.kill()
    this._counter -= 1
  }

  _tick(elapsed) {
    if (this._paused) return

    let emissionEnabled = this._mode === C.EMITTER_MODE.EMISSION || this._mode === C.EMITTER_MODE.BOTH
    let burstEnabled = this._mode === C.EMITTER_MODE.BURST || this._mode === C.EMITTER_MODE.BOTH

    if (this._active) {
      if (emissionEnabled) {
        this._emissionTime += elapsed
      }

      if (burstEnabled) {
        this._burstTime = (this._burstTime || elapsed) - elapsed
      }

      // Continuous emission
      if (emissionEnabled && this._emissionTime > 0) {
        let amount = Math.floor(this._emissionTime/this._emissionRate)
        if (amount) {
          this._emissionTime -= amount*this._emissionRate
        }

        amount = Math.min(amount, this._maxParticles - this._counter)
        for (let i=0; i<amount; i++) {
          this._addParticle()
        }
      }

      // Burst emission
      if (burstEnabled && this._burstTime <= 0) {
        this._burstTime += this._burstInterval

        let amount = random.int(this._burstMin, this._burstMax);
        amount = Math.min(amount, this._maxParticles - this._counter)
        for (let i=0; i<amount; i++) {
          this._addParticle()
        }
      }

      // Deactivate the emitter if duration has been reached
      if (this._duration && this._duration >= 0) {
        this._elapsed += elapsed

        if (this._elapsed > this._duration) {
          this.stop()
        }
      }
    }
    
    // Update alive particles
    let i = 0
    let N = this._counter
    while (i < N) {
      let p = this._particles[i]

      // Update life
      p.update(elapsed, elapsed/1000)

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
    this._counter = N
  
    // Cap emission time to avoid infinity accumulation
    this._emissionTime = Math.min(this._emissionTime, 1000)
    this._burstTime = Math.max(this._burstTime, -this._burstInterval)
  }

  emit(amount) {
    amount = Math.min(amount, this._maxParticles - this._counter)
    for (let i=0; i<amount; i++) {
      this._addParticle()
    }
  }

  start() {
    if (this._active) return

    this._active = true
    this._paused = false
    this._elapsed = 0
    this._burstTime = 0
    this._emissionTime = 0
    this._counter = 0
    this._schedule = $.getInjector().resolve('schedule')

    this._schedule.add(this._tick)
  }

  pause() {
    this._paused = true
  }

  resume() {
    this._paused = false
  }

  stop() {
    if (!this._active) return

    this._active = false
    this._schedule.remove(this._tick) 
  }

  destroy() {
    super.destroy(true)
    this.stop()
  }
}

module.exports = Emitter