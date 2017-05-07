const rand = (v) => v*(Math.random()*2 - 1)

export default class Emitter extends PIXI.ParticleContainer {
  constructor() {
    super(15000, {scale:true, position:true, rotation:true, alpha:true})

    // Parameters
    this._active = false
    this._duration = 0
    this._counter = 0
    this._textures = []
    this._maxParticles = 100
    this._particles = []
    this._emissionRate = 100
    this._angle = 0
    this._angleVar = 4
    this._emitX = 0
    this._emitXVar = 0
    this._emitY = 0
    this._emitYVar = 0
    this._life = 1000
    this._lifeVar = 0
    this._startAlpha = 1
    this._startAlphaVar = 0
    this._endAlpha = 0
    this._endAlphaVar = 0
    this._startRotation = 0
    this._startRotationVar = 0
    this._endRotation = 0
    this._endRotationVar = 0
    this._startScale = 1
    this._startScaleVar = 0
    this._endScale = 1
    this._endScaleVar = 0
    this._startSpeed = 100
    this._startSpeedVar = 0
    this._endSpeed = 100
    this._endSpeedVar = 0
    this._gravityX = 0
    this._gravityY = 0
    this._radialAcceleration = 0
    this._radialAccelerationVar = 0
    this._tangentialAcceleration = 0
    this._tangentialAccelerationVar = 0
    // this._startColor
    // this._startColorVar
    // this._endColor
    // this._endColorVar
    
    this._updateSprites()
    this._updateTextures()

    // Execution variables
    this._emissionTime = 0
    this._elapsed = 0
  }
  
  /**
   * Whether this emitter is active (creating new particles) or not.
   * @type {Boolean}
   */
  get active() { return this._active }
  set active(v) { this._active = v}
  
  /**
   * Duration of the emitter in milliseconds. After this duration, the emitter
   * will deactivate itself. If you want a continuous emitter, set duration to
   * zero.
   * @type {Integer}
   */
  get duration() { return this._duration }
  set duration(v) { this._duration = v}
  
  /**
   * The amount of alive particles in this emitter. Readonly.
   * @type {Integer}
   */
  get counter() { return this._counter }
  
  /**
   * An array of possible textures. The emitter will select a random texture 
   * from this array when creating new particles. You may assign a Texture 
   * object to this attribute that it will be converted to array.
   * @type {Array<PIXI.Texture>}
   */
  get textures() { return this._textures }
  set textures(v) { 
    if (!Array.isArray(v)) {
      v = [v]
    }

    this._textures = v
    this._updateTextures()
  }
  
  /**
   * Maximum number of particles in this emitter.
   * @type {Integer}
   */
  get maxParticles() { return this._maxParticles }
  set maxParticles(v) {
    this._maxParticles = v
    this._updateSprites()
  }
  
  /**
   * Array of all particles. Readonly.
   * @type {Array<Particles>}
   */
  get particles() { return this._particles }
  
  /**
   * Emission rate of this emitter. The emitter will create a new particle 
   * every `emissionRate` milliseconds.
   * @type {Integer}
   */
  get emissionRate() { return this._emissionRate }
  set emissionRate(v) { this._emissionRate = v}
  
  /**
   * The emitter angle of emission is radians, this will define the direction
   * each particle is headed.
   * @type {Number}
   */
  get angle() { return this._angle }
  set angle(v) { this._angle = v}
  
  /**
   * The variation of the emitter angle.
   * @type {Number}
   */
  get angleVar() { return this._angleVar }
  set angleVar(v) { this._angleVar = v}
  
  /**
   * Start point of the emitter in the X axis, in pixels.
   * @type {Integer}
   */
  get emitX() { return this._emitX }
  set emitX(v) { this._emitX = v }
  
  /**
   * Variation of the start point in the X axis.
   * @type {Integer}
   */
  get emitXVar() { return this._emitXVar }
  set emitXVar(v) { this._emitXVar = v}
  
  /**
   * Start point of the emitter in the Y axis, in pixels.
   * @type {Integer}
   */
  get emitY() { return this._emitY }
  set emitY(v) { this._emitY = v}
  
  /**
   * Variation of the start point in the Y axis.
   * @type {Integer}
   */
  get emitYVar() { return this._emitYVar }
  set emitYVar(v) { this._emitYVar = v}
  
  /**
   * Base life span of each particle, in milliseconds.
   * @type {Integer}
   */
  get life() { return this._life }
  set life(v) { this._life = v}
  
  /**
   * Variation of the particle life span.
   * @type {Integer}
   */
  get lifeVar() { return this._lifeVar }
  set lifeVar(v) { this._lifeVar = v}
  
  /**
   * Initial transparency value of the particle.
   * @type {Number}
   */
  get startAlpha() { return this._startAlpha }
  set startAlpha(v) { this._startAlpha = v}
  
  /**
   * Variation of the initial transparency value of the particle.
   * @type {Number}
   */
  get startAlphaVar() { return this._startAlphaVar }
  set startAlphaVar(v) { this._startAlphaVar = v}
  
  /**
   * Final transparency value of the particle.
   * @type {Number}
   */
  get endAlpha() { return this._endAlpha }
  set endAlpha(v) { this._endAlpha = v}
  
  /**
   * Variation of the final transparency value of the particle.
   * @type {Number}
   */
  get endAlphaVar() { return this._endAlphaVar }
  set endAlphaVar(v) { this._endAlphaVar = v}
  
  /**
   * Initial value for particle rotation, in radians.
   * @type {Number}
   */
  get startRotation() { return this._startRotation }
  set startRotation(v) { this._startRotation = v}
  
  /**
   * Variation of the initial rotation, in radians.
   * @type {Number}
   */
  get startRotationVar() { return this._startRotationVar }
  set startRotationVar(v) { this._startRotationVar = v}
  
  /**
   * Final rotation for each particle, in radians.
   * @type {Number}
   */
  get endRotation() { return this._endRotation }
  set endRotation(v) { this._endRotation = v}
  
  /**
   * Variation of the final particle rotation, in radians.
   * @type {Number}
   */
  get endRotationVar() { return this._endRotationVar }
  set endRotationVar(v) { this._endRotationVar = v}
  
  /**
   * Initial particle scale, use 1 for default value.
   * @type {Number}
   */
  get startScale() { return this._startScale }
  set startScale(v) { this._startScale = v}
  
  /**
   * Variation of the initial particle scale, use 1 for default value.
   * @type {Number}
   */
  get startScaleVar() { return this._startScaleVar }
  set startScaleVar(v) { this._startScaleVar = v}
  
  /**
   * Final particle scale, use 1 for default value.
   * @type {Number}
   */
  get endScale() { return this._endScale }
  set endScale(v) { this._endScale = v}
  
  /**
   * Variation of the final particle scale, use 1 for default value.
   * @type {Number}
   */
  get endScaleVar() { return this._endScaleVar }
  set endScaleVar(v) { this._endScaleVar = v}
  
  /**
   * Initial particle speed, in pixels per seconds.
   * @type {Number}
   */
  get startSpeed() { return this._startSpeed }
  set startSpeed(v) { this._startSpeed = v}
  
  /**
   * Variation of the initial particle speed, in pixels per seconds.
   * @type {Number}
   */
  get startSpeedVar() { return this._startSpeedVar }
  set startSpeedVar(v) { this._startSpeedVar = v}
  
  /**
   * Final particle speed, in pixels per seconds.
   * @type {Number}
   */
  get endSpeed() { return this._endSpeed }
  set endSpeed(v) { this._endSpeed = v}
  
  /**
   * Variation of the final particle speed, in pixels per seconds.
   * @type {Number}
   */
  get endSpeedVar() { return this._endSpeedVar }
  set endSpeedVar(v) { this._endSpeedVar = v}
  
  /**
   * Gravity force in the X axis in pixels per second, applied to all particles.
   * @type {Number}
   */
  get gravityX() { return this._gravityX }
  set gravityX(v) { this._gravityX = v}
  
  /**
   * Gravity force in the Y axis in pixels per second, applied to all particles. 
   * @type {Number}
   */
  get gravityY() { return this._gravityY }
  set gravityY(v) { this._gravityY = v}
  
  /**
   * Radial acceleration of all particles, in pixels per second.
   * @type {Number}
   */
  get radialAcceleration() { return this._radialAcceleration }
  set radialAcceleration(v) { this._radialAcceleration = v}
  
  /**
   * Variation of the radial acceleration of all particles.
   * @type {Number}
   */
  get radialAccelerationVar() { return this._radialAccelerationVar }
  set radialAccelerationVar(v) { this._radialAccelerationVar = v}
  
  /**
   * Tangential acceleration of all particles,  in pixels per second.
   * @type {Number}
   */
  get tangentialAcceleration() { return this._tangentialAcceleration }
  set tangentialAcceleration(v) { this._tangentialAcceleration = v}
  
  /**
   * Variation of the tangential acceleration of all particles.
   * @type {Number}
   */
  get tangentialAccelerationVar() { return this._tangentialAccelerationVar }
  set tangentialAccelerationVar(v) { this._tangentialAccelerationVar = v}
  
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
   * 
   */
  start() {
    this._active = true
    this._elapsed = 0
    this._emissionTime = 0
  }

  stop() {
    this._active = false
  }

  /**
   * Update the emitter
   */
  update(delta) {
    let milliseconds = delta*1000

    // Add particles if active
    if (this._active) {
      this._elapsed += milliseconds
      this._emissionTime += milliseconds
      
      // Create the particles
      while (this._emissionTime > this._emissionRate && 
             this._counter < this._maxParticles) {

        this._addParticle()
        this._emissionTime -= this._emissionRate
      }

      // Deactivate the emitter if duration has been reached
      if (this._duration && this._elapsed > this._duration) {
        this._active = false
      }
    }

    // Update alive particles
    let i = 0
    let amount = this._counter

    while (i < amount) {
      let p = this._particles[i]

      p.life -= milliseconds

      // Kill the particle
      if (p.life <= 0) {
        p.visible = false

        amount -= 1
        this._particles[i] = this._particles[amount]
        this._particles[amount] = p
        continue
      }

      // Update values
      let t = p.life/p.initialLife

      // compute tangential and radial acceleration
      let x = p.x - p.initialX
      let y = p.y - p.initialY
      let vx = 0
      let vy = 0
      if (x || y) {
        let norm = Math.sqrt(x*x + y*y)
        vx = x/norm
        vy = y/norm
      }
      let radX = vx*p.radialAcceleration
      let radY = vy*p.radialAcceleration
      let tanX = -vy*p.tangentialAcceleration
      let tanY = vx*p.tangentialAcceleration

      // compute the new direction
      p.dirX += (radX + tanX + p.gravityX)*delta
      p.dirY += (radY + tanY + p.gravityY)*delta

      // interpolate the simple values
      p.alpha += p.deltaAlpha*milliseconds
      p.scale.x += p.deltaScale*milliseconds
      p.scale.y = p.scale.x
      p.rotation += p.deltaRotation*milliseconds
      p.speed += p.deltaSpeed*milliseconds

      // compute new position
      p.x += p.dirX * p.speed * delta
      p.y += p.dirY * p.speed * delta

      i++
    }

    // Cap emission time to avoid infinity accumulation
    this._emissionTime = Math.min(this._emissionTime, this._emissionRate*100)
    this._counter = amount
  }

  _addParticle() {
    if (this._counter >= this._maxParticles) return

    let p = this._particles[this._counter]
    let texture = this._textures[Math.floor(Math.random()*this._textures.length)]
    let changed = false
    if (p.texture !== texture) {
      p.texture = texture
      changed = true
    }

    p.visible = true
    p.initialLife = this.life + rand(this.lifeVar)
    p.life = p.initialLife
    p.alpha = this.startAlpha + rand(this.startAlphaVar)
    p.x = this.emitX + rand(this.emitXVar)
    p.y = this.emitY + rand(this.emitYVar)
    p.initialX = this.emitX
    p.initialY = this.emitY

    let angle = this.angle + rand(this.angleVar)
    p.dirX = Math.cos(angle)
    p.dirY = Math.sin(angle)
    p.speed = this.startSpeed + rand(this.startSpeedVar)
    p.rotation = this.startRotation + rand(this.startRotationVar)
    p.scale.x = this.startScale + rand(this.startScaleVar)
    p.scale.y = p.scale.x

    let endAlpha = this.endAlpha + rand(this.endAlphaVar)
    p.deltaAlpha =  (endAlpha - p.alpha)/p.life

    let endRotation = this.endRotation + rand(this.endRotationVar)
    p.deltaRotation = (endRotation - p.rotation)/p.life

    let endScale = this.endScale + rand(this.endScaleVar)
    p.deltaScale = (endScale - p.scale.x)/p.life

    let endSpeed = this.endSpeed + rand(this.endSpeedVar)
    p.deltaSpeed = (endSpeed - p.speed)/p.life

    p.gravityX = this.gravityX
    p.gravityY = this.gravityY
    p.radialAcceleration = this.radialAcceleration + rand(this.radialAccelerationVar)
    p.tangentialAcceleration = this.tangentialAcceleration + rand(this.tangentialAccelerationVar)

    this._counter += 1

    // notify the container that we changed an object
    if (changed) this.onChildrenChange(p.containerIndex)
  }
  _updateSprites() {
    let difference = this._maxParticles - this._particles.length

    // Should remove because there is more particles than the max
    if (difference < 0) {
      this.removeChildren(this._maxParticles)
      this._particles = this.children.slice()
    }

    // Should add because there there is less particles than the max
    else if (difference > 0) {
      for (let i=0; i<difference; i++) {
        let p = new PIXI.Sprite()
        p.visible = 0
        p.alpha = 0 // force hidden on particle container
        p.anchor.x = .5
        p.anchor.y = .5
        p.x = rand(100)
        p.y = rand(100)

        p.containerIndex = this.children.length
        this._particles.push(p)
        this.addChild(p)
      }
    }
  }
  _updateTextures() {
    let minIndex = 100000
    for (let i=this._counter; i<this._maxParticles; i++) {
      let texture = this._textures[Math.floor(Math.random()*this._textures.length)]
      if (!texture) return

      let p = this._particles[i]
      p.texture = texture
      minIndex = Math.min(p.containerIndex, minIndex)
    }
    if (minIndex < 100000) {
      this.onChildrenChange(minIndex)
    }
  }
}