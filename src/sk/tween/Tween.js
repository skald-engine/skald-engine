const BaseTween = require('sk/tween/BaseTween')

class Tween extends BaseTween {
  constructor(target, duration, fromVars, toVars, options) {
    super(options)

    this._target = target
    this._duration = duration
    this._fromVars = fromVars
    this._toVars = toVars
    this._keys = null

    this._initialized = false
    this._currentFromVars = null
    this._currentToVars = null

    if (fromVars && !Object.keys(fromVars).length) {
      this._fromVars = null
    }
    if (toVars && !Object.keys(toVars).length) {
      this._toVars = null
    }

    if (fromVars) this._checkVariables(fromVars)
    if (toVars) this._checkVariables(toVars)
  }

  static fromTo(target, duration, fromVars, toVars, options) {
    return new Tween(target, duration, fromVars, toVars, options)
  }

  static from(target, duration, fromVars, options) {
    return new Tween(target, duration, fromVars, null, options)
  }

  static to(target, duration, toVars, options) {
    return new Tween(target, duration, null, toVars, options)
  }

  get target() { return this._target }

  _reset() {
    super._reset()
    this._initialized = false
  }

  _initializeVariables() {
    this._initialized = true
    let fromVars = this._fromVars || {}
    let toVars = this._toVars || {}
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

    this._currentFromVars = fromVars
    this._currentToVars = toVars
  }

  _checkVariables(vars) {
    for (let key in vars) {
      if (!Number.isFinite(vars[key])) {
        throw new Error(`Trying to tween to a non-number variable "${key}"`)
      }
    }
  }

  _update(progress) {
    if (!this._initialized) {
      this._initializeVariables()
    }

    for (let i=0; i<this._keys.length; i++) {
      let key = this._keys[i]

      let a = this._currentFromVars[key]
      let b = this._currentToVars[key]
      this._target[key] = (1 - progress)*a + (progress*b);
    }
  }

  start() {
    if (!this._alive) return this

    this._initializeVariables()
    return super.start()
  }
}

module.exports = Tween