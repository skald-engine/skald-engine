// TODO: Gotta create a BaseTween class to put common code between Timeline and Tween
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

class Timeline {
  constructor(options) {
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

    this._initialize(options)
  }

  add(tween, position) {}
  addCall(callback, position) {}
  addLabel(label, position) {}
  addPause(value, position) {}

  start() {}
  pause() {}
  resume() {}
  stop() {}
  destroy() {}
  reverse() {}
}

module.exports = Timeline