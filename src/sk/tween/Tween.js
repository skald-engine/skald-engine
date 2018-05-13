const $ = require('sk/$')
const linear = require('sk/ease').linear
const isFunction = require('sk/utils').isFunction

const DEFAULT = {
  delay       : 0,
  ease        : linear,
  repeat      : 0,
  repeatDelay : 0,
  yoyo        : false,
  yoyoEase    : null,
  onStart     : null,
  onUpdate    : null,
  onComplete  : null,
  onRepeat    : null,
  onReverse   : null
}

class Tween {
  constructor(target, duration, fromVars, toVars, options) {
    this._target = target
    this._duration = duration
    this._fromVars = null
    this._toVars = null
    this._keys = null
    this._options = null

    this._callback = null
    this._currentTime = null
    this._currentLoop = null
    this._currentDelay = null

    this._alive = true
    this._paused = false
    this._active = false
    this._reversed = false

    this._delay = null
    this._ease = null
    this._repeat = null
    this._repeatDelay = null
    this._yoyo = null
    this._yoyoEase = null

    this._onStart = null
    this._onUpdate = null
    this._onComplete = null
    this._onRepeat = null
    this._onReverse = null

    this._schedule = null

    this._initialize(fromVars, toVars, options)
  }

  static _add(tween) {
    let index = Tween._tweens.indexOf(tween)
    if (index < 0) {
      Tween._tweens.push(tween)
    }
  }
  static _remove(tween) {
    let index = Tween._tweens.indexOf(tween)
    if (index >= 0) {
      Tween._tweens.splice(index, 1)
    }
  }
  
  static fromTo(target, duration, fromVars, toVars, options) {
    return new Tween(target, duration, fromVars, toVars, options)
  }

  static from(target, duration, fromVars, options) {
    return new Tween(target, duration, fromVars, {}, options)
  }

  static to(target, duration, toVars, options) {
    return new Tween(target, duration, {}, toVars, options)
  }

  static isTweening() {
    return !!Tween._tweens.length
  }
  static getAll() {
    return Tween._tweens.slice()
  }
  static stopAll() {
    let tweens = Tween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].stop()
    }
  }
  static destroyAll() {
    let tweens = Tween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].destroy()
    }
  }

  get target() { return this._target }

  get duration() { return this._duration }
  set duration(v) { this._duration = v }

  get delay() { return this._delay }
  set delay(v) { this._delay = v }

  get ease() { return this._ease }
  set ease(v) { this._ease = v }

  get repeat() { return this._repeat }
  set repeat(v) { this._repeat = v }

  get repeatDelay() { return this._repeatDelay }
  set repeatDelay(v) { this._repeatDelay = v }

  get yoyo() { return this._yoyo }
  set yoyo(v) { this._yoyo = v }

  get yoyoEase() { return this._yoyoEase }
  set yoyoEase(v) { this._yoyoEase = v }

  get onStart() { return this._onStart }
  set onStart(v) { this._onStart = v }

  get onUpdate() { return this._onUpdate }
  set onUpdate(v) { this._onUpdate = v }

  get onComplete() { return this._onComplete }
  set onComplete(v) { this._onComplete = v }

  get onRepeat() { return this._onRepeat }
  set onRepeat(v) { this._onRepeat = v }

  get onReverse() { return this._onReverse }
  set onReverse(v) { this._onReverse = v }

  get paused() { return this._paused }
  get alive() { return this._alive }
  get active() { return this._active }

  get progress() {
    let p = Math.min(this._currentTime/this._duration, 1)
    if (this._reversed) {
      return 1 - p
    } else {
      return p
    }
  }

  _initialize(fromVars, toVars, options) {
    this._initializeOptions(options)
    this._initializeVariables(fromVars, toVars)
    this._checkVariables()

    let injector = $.getInjector()
    this._schedule = sk.resolve('schedule')
  }

  _initializeOptions(options) {
    options = Object.assign(DEFAULT, options)

    options.yoyo = !!options.yoyo

    if (!options.yoyoEase) {
      options.yoyoEase = options.ease
    }

    if (!Number.isFinite(options.repeat) || options.repeat < 0) {
      throw new Error(`The option "repeat" must be a number bigger or equal to 0.`)
    }

    if (!Number.isFinite(options.delay) || options.delay < 0) {
      throw new Error(`The option "delay" must be a number bigger or equal to 0.`)
    }

    if (!Number.isFinite(options.repeatDelay) || options.repeatDelay < 0) {
      throw new Error(`The option "repeatDelay" must be a number bigger or equal to 0.`)
    }

    if (!isFunction(options.ease)) {
      throw new Error(`The option "ease" must be a function.`)
    }

    if (!isFunction(options.yoyoEase)) {
      throw new Error(`THe option "yoyoEase" must be a function.`)
    }

    if (options.onStart && !isFunction(options.onStart)) {
      throw new Error(`The option "onStart" must be a function.`)
    }

    if (options.onUpdate && !isFunction(options.onUpdate)) {
      throw new Error(`The option "onUpdate" must be a function.`)
    }

    if (options.onComplete && !isFunction(options.onComplete)) {
      throw new Error(`The option "onComplete" must be a function.`)
    }

    if (options.onRepeat && !isFunction(options.onRepeat)) {
      throw new Error(`The option "onRepeat" must be a function.`)
    }

    if (options.onReverse && !isFunction(options.onReverse)) {
      throw new Error(`The option "onReverse" must be a function.`)
    }

    this._delay       = options.delay
    this._ease        = options.ease
    this._repeat      = options.repeat
    this._repeatDelay = options.repeatDelay
    this._yoyo        = options.yoyo
    this._yoyoEase    = options.yoyoEase
    this._onStart     = options.onStart
    this._onUpdate    = options.onUpdate
    this._onComplete  = options.onComplete
    this._onRepeat    = options.onRepeat
    this._onReverse   = options.onReverse
  }

  _initializeVariables(fromVars, toVars) {
    fromVars = fromVars || {}
    toVars = toVars || {}
    this._keys = Object.keys(fromVars).concat(Object.keys(toVars))

    for (let i=0; i<this._keys.length; i++) {
      let key = this._keys[i]

      if (typeof fromVars[key] === 'undefined') {
        fromVars[key] = this._target[key]
      }

      if (typeof toVars[key] === 'undefined') {
        toVars[key] = this._target[key]
      }
    }

    this._fromVars = fromVars
    this._toVars = toVars
  }

  _checkVariables() {
    for (let key in this._fromVars) {
      if (!Number.isFinite(this._fromVars[key])) {
        throw new Error(`Trying to tween from a non-number variable "${key}"`)
      }

      if (!Number.isFinite(this._toVars[key])) {
        throw new Error(`Trying to tween to a non-number variable "${key}"`)
      }
    }
  }

  _set(progress) {
    for (let i=0; i<this._keys.length; i++) {
      let key = this._keys[i]

      let a = this._fromVars[key]
      let b = this._toVars[key]
      this._target[key] = (1 - progress)*a + (progress*b);
    }
  }

  start() {
    if (this._active || !this._alive) return this
    Tween._add(this)

    this._active = true
    this._alive = true
    this._reversed = false
    
    this._currentTime = 0
    this._currentLoop = 0
    this._currentDelay = this._delay

    this._callback = (elapsed) => { this.update(elapsed) }
    this._schedule.add(this._callback)

    this._set(0)

    if (this._onStart) this._onStart()

    return this
  }

  pause() {
    Tween._remove(this)
    this._paused = true
    this._schedule.remove(this._callback)

    return this
  }

  resume() {
    if (!this._paused || !this._alive) return
    Tween._add(this)

    this._active = true
    this._alive = true

    this._schedule.add(this._callback)

    return this
  }

  stop() {
    Tween._remove(this)
    this._active = false
    this._paused = false

    this._schedule.remove(this._callback)

    if (this._onComplete) this._onComplete()

    return this
  }

  restart() {
    if (!this._active || !this._alive) return this
    this._currentTime = 0
    this._currentLoop = 0
    this._currentDelay = this._delay
    this._reversed = false

    if (this._onStart) this._onStart()
    return this
  }

  destroy() {
    Tween._remove(this)
    this.stop()
    this._alive = false
  }

  reverse() {
    this._reversed = !this._reversed
    this._currentTime = this._duration - this._currentTime
    
    return this
  }

  update(elapsed) {
    this._currentTime += elapsed

    // Resolve delay
    if (this._currentDelay > 0) {
      if (this._currentTime >= this._currentDelay) {
        this._currentTime -= this._currentDelay
        this._currentDelay = 0
      } else {
        return
      }
    }

    // Resolve easing
    let realProgress = this.progress
    let progress = this._reversed? this._yoyoEase(realProgress) : this._ease(realProgress)

    // Update
    if (this._onUpdate) this._onUpdate(progress)

    // Resolve yoyo, repeat or complete
    if (this._currentTime >= this._duration) {
      // Yoyo
      if (this._yoyo && !this._reversed) {
        this._currentTime = 0
        this._reversed = true
        if (this._onReverse) this._onReverse(progress)

      // Repeat
      } else if (this._currentLoop < this._repeat) {
        this._currentLoop++
        this._currentTime = 0
        this._currentDelay = this._repeatDelay
        this._reversed = false
        if (this._onRepeat) this._onRepeat(progress)

      // Complete
      } else {
        this._set(this._reversed? 0 : 1)
        return this.stop()
      }
    }

    this._set(progress)
  }
}

Tween._tweens = []

module.exports = Tween