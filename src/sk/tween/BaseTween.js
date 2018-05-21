const $ = require('sk/$')
const linear = require('sk/ease').linear
const isFunction = require('sk/utils').isFunction

const DEFAULTS = {
  delay       : 0,
  ease        : linear,
  repeat      : 0,
  repeatDelay : 0,
  yoyo        : false,
  yoyoDelay   : 0,
  yoyoEase    : null,
  onStart     : null,
  onUpdate    : null,
  onComplete  : null,
  onRepeat    : null,
  onReverse   : null
}

class BaseTween {
  constructor(options) {
    // Options
    this._delay = null
    this._ease = null
    this._repeat = null
    this._repeatDelay = null
    this._yoyo = null
    this._yoyoDelay = null
    this._yoyoEase = null
    this._onStart = null
    this._onUpdate = null
    this._onComplete = null
    this._onRepeat = null
    this._onReverse = null

    // External inspection
    this._duration = null
    this._progress = null
    this._realProgress = null
    this._totalProgress = null

    // Internal state
    this._alive = true
    this._active = false
    this._paused = false
    this._started = null
    this._reversed = null
    this._loop = null
    this._ended = null

    // Internal control
    this._currentTime = 0
    this._callback = null
    this._schedule = null

    this._initializeOptions(options)
  }

  static _add(tween) {
    let index = BaseTween._tweens.indexOf(tween)
    if (index < 0) {
      BaseTween._tweens.push(tween)
    }
  }

  static _remove(tween) {
    let index = BaseTween._tweens.indexOf(tween)
    if (index >= 0) {
      BaseTween._tweens.splice(index, 1)
    }
  }

  static isTweening() {
    return !!BaseTween._tweens.length
  }

  static getAll() {
    return BaseTween._tweens.slice()
  }

  static pauseAll() {
    let tweens = BaseTween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].pause()
    }
  }

  static resumeAll() {
    let tweens = BaseTween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].resume()
    }
  }

  static stopAll() {
    let tweens = BaseTween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].stop()
    }
  }

  static destroyAll() {
    let tweens = BaseTween._tweens.slice()
    for (let i=0; i<tweens.length; i++) {
      tweens[i].destroy()
    }
  }


  get delay() { return this._delay }
  get ease() { return this._ease }
  get repeat() { return this._repeat }
  get repeatDelay() { return this._repeatDelay }
  get yoyo() { return this._yoyo }
  get yoyoDelay() { return this._yoyoDelay }
  get yoyoEase() { return this._yoyoEase }
  get onStart() { return this._onStart }
  get onUpdate() { return this._onUpdate }
  get onComplete() { return this._onComplete }
  get onRepeat() { return this._onRepeat }
  get onReverse() { return this._onReverse }

  get duration() { return this._duration }
  get progress() { return this._progress }
  get realProgress() { return this._realProgress }
  get totalProgress() { return this._totalProgress }

  get alive() { return this._alive }
  get active() { return this._active }
  get started() { return this._started }
  get ended() { return this._ended }
  get paused() { return this._paused }

  get totalDuration() {
    let yoyoMod = this._yoyo? 2 : 1
    let yoyoDelayMod = this._yoyo? 1 : 0
    return (
      this._delay +
      yoyoMod*(this._duration * (this.repeat + 1)) +
      this._repeatDelay * this.repeat +
      yoyoDelayMod*(this._yoyoDelay * (this._repeat + 1))
    )
  }


  _initializeOptions(options) {
    let injector = $.getInjector()
    this._schedule = sk.resolve('schedule')

    options = Object.assign({}, DEFAULTS, options)
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

    if (!Number.isFinite(options.yoyoDelay) || options.yoyoDelay < 0) {
      throw new Error(`The option "yoyoDelay" must be a number bigger or equal to 0.`)
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
    this._yoyoDelay   = options.yoyoDelay
    this._yoyoEase    = options.yoyoEase
    this._onStart     = options.onStart
    this._onUpdate    = options.onUpdate
    this._onComplete  = options.onComplete
    this._onRepeat    = options.onRepeat
    this._onReverse   = options.onReverse
  }

  _reset() {
    if (this._active) {
      this._schedule.remove(this._callback)
      BaseTween._remove(this)
    }
    this._currentTime = 0
    this._callback = null
    this._active = false
    this._paused = false
    this._started = null
    this._reversed = null
    this._loop = null
    this._ended = null
  }

  _tick(elapsed) {
    if (this._paused) return

    this._currentTime += elapsed
    this.seek(this._currentTime)

    if (this._currentTime > this.totalDuration) {
      this.stop()
    }
  }

  _preUpdate(progress, justStarted, justRepeated, justReversed, justEnded) {}

  _update(time) {}

  _computeReversed(time, loop) {
    if (!this._yoyo) return false

    let yoyoMod = +this._yoyo

    time = (
      time -(this._delay + this.duration)
           -loop*(this._repeatDelay + this.duration)
           -loop*yoyoMod*(this._yoyoDelay + this.duration)
    )

    return time > 0
  }

  _computeLoop(time) {
    if (this._repeat <= 0) return 0

    let yoyoMod = +this._yoyo
    let yoyoTime = yoyoMod*(this._yoyoDelay + this.duration)
    let intialLoopTime = (this._delay + this.duration) + yoyoTime
    let loopTime = (this._repeatDelay + this.duration) + yoyoTime

    if ((time - intialLoopTime) <=  0) {
      return 0
    } else {
      return Math.ceil((time - intialLoopTime) / loopTime)
    }
  }

  _computeProgress(time, loop, reversed) {
    let yoyoMod = +this._yoyo
    let reversedMod = +reversed

    let localTime = (
      time -this._delay
           -loop*(this._repeatDelay + this.duration)
           -loop*yoyoMod*(this._yoyoDelay + this.duration)
           -reversedMod*(this._yoyoDelay + this.duration)
    )

    let progress = Math.min(Math.max(localTime / this.duration, 0), 1)
    return reversed? 1 - progress : progress
  }


  seek(time, suppressEvents=false, allowUpdate=false) {
    let totalDuration = this.totalDuration
    time = Math.min(Math.max(time, 0), totalDuration)
    let loop = this._computeLoop(time)
    let reversed = this._computeReversed(time, loop)
    
    let realProgress = this._computeProgress(time, loop, reversed)
    let totalProgress = time / totalDuration
    let progress = reversed
                    ? this.yoyoEase(realProgress)
                    : this.ease(realProgress)

    let _ended = this._ended ||
                 (this._started && (time === totalDuration || time === 0))
    let _started = true
    let _reversed = reversed
    let _loop = loop

    let justStarted = this._started !== _started
    let justRepeated = this._loop !== null && this._loop !== _loop
    let justReversed = this._reversed !== null && this._reversed !== _reversed
    let justEnded = this._ended !== null && this._ended !== _ended

    if (!suppressEvents && this._onStart && justStarted) {
      this._onStart(this)
    }

    this._update(progress, justStarted, justRepeated, justReversed, justEnded)

    if ((!suppressEvents || allowUpdate) && this._onUpdate) {
      this._onUpdate(this, progress, realProgress, totalProgress)
    }

    if (!suppressEvents && this._onRepeat && justRepeated) {
      this._onRepeat(this, _loop, this._loop)
    }

    if (!suppressEvents && this._onReverse && justReversed) {
      this._onReverse(this, reversed)
    }

    if (!suppressEvents && this._onComplete && justEnded) {
      this._onComplete(this, progress, realProgress, totalProgress)
    }

    this._ended = _ended
    this._started = _started
    this._reversed = _reversed
    this._loop = _loop
  }

  start() {
    if (!this._alive) return this

    this._reset()
    this._active = true
    this._callback = (elapsed) => { this._tick(elapsed) }
    this._schedule.add(this._callback)
    BaseTween._add(this)

    this.seek(0)
    return this
  }

  pause() {
    if (!this._alive || !this._active || this._paused) return this

    this._paused = true
    this._schedule.remove(this._callback)

    return this
  }

  resume() {
    if (!this._alive || !this._paused) return this

    this._paused = false
    this._schedule.add(this._callback)

    return this
  }

  stop() {
    if (!this._alive || !this._active) return this
    this._reset()
    return this
  }

  destroy() {
    this._alive = false
    this._reset()
  }
}

BaseTween._tweens = []

module.exports = BaseTween