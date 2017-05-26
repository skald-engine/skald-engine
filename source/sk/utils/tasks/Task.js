import lerp from 'sk/utils/lerp'
import {linear} from 'sk/utils/easing'

export default class Task {
  constructor(duration, delay=0, loop=false, ease=null) {
    ease = ease || linear

    this._duration = duration
    this._delay = delay
    this._loop = loop
    this._ease = ease

    this._isFinished = false
    this._currentTime = 0
  }

  /**
   * The duration of the tween, in milliseconds. Readonly
   * @type {Number}
   */
  get duration() { return this._duration }

  /**
   * The delay of the tween. If set, the total execution time of the tween 
   * will be `delay + duration`.
   * @type {Object}
   */
  get delay() { return this._delay }

  /**
   * If the tween should repeat or not. If true, the tween `hasFinished` 
   * method will only return true when the tween is manually stop. Notice 
   * that, the tween will pause for the delay time every iteration.
   * @type {Boolean}
   */
  get loop() { return this._loop }

  /**
   * The easing function. Defaults to linear.
   * @type {Function}
   */
  get ease() { return this._ease }

  /**
   * Updates the tween and perform the proper modifications on the target 
   * object.
   *
   * @param {Number} delta - The amount of seconds passed between this tick and
   *        the last one.
   */
  _update(delta) {
    if (this._isFinished) return

    // convert seconds to milliseconds
    this._currentTime += delta*1000

    // verify if the tween is in the delay
    let v = this._currentTime - this._delay
    if (v < 0) return

    // verify if the tween has finished
    if (v > this._duration) {
      if (this._loop) {
        this.reset()
        this._currentTime = v - this.duration
        return this._update(delta)
      } else {
        return this.stop()
      }
    }

    // perform the tween
    let th = 1 - (this._duration-v)/this._duration
    let ease = this._ease
    this.update(th, delta)
  }
  update(th, delta) {}

  /**
   * Stops the tween. This method is also called internally when the tween 
   * finishes its execution.
   */
  _stop() {
    if (this._isFinished) return    
    this._isFinished = true

    this.update(1, 0)
    this.stop()
  }
  stop() {}

  /**
   * Resets the tween, starting it again from zero.
   */
  reset() {
    this._isFinished = false
    this._currentTime = 0
  }

  /**
   * Returns whether this tween has finish its execution or not.
   *
   * @return {Boolean}
   */
  hasFinished() {
    return this._isFinished
  }
}