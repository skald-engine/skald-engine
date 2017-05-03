import lerp from 'sk/utils/lerp'
import {linear} from 'sk/utils/easing'

/**
 * Tween class.
 *
 * The main goal of this class is to provide an automated process to animate 
 * objects in the canvas. For example, suppose that you want to animate the 
 * damage indicator that is created everytime the player hits an enemy, you can
 * use a Tween to move the indicator up and progressively fade away.
 *
 * This class, however, does not control automatically the execution of the 
 * tween. This is due to avoid the tween keeping executing the animation after
 * the scene leaving the screen, or the scene is pause, or the object is 
 * removed from the scene, and a lot of other complications.
 *
 * It is recommended that you use the {@link sk.tween} function instead of 
 * created this class directly. The tween function provides validation and 
 * proper convertion of the input data.
 */
export default class Tween {

  /**
   * Constructor.
   *
   * @param {Object} target - The target objects (which will receive the 
   *        modifications).
   * @param {Number} duration - The duration of the tween, in milliseconds.
   * @param {Object} properties - The map of properties to be changed, the key
   *        is the name of the property, and the values are a 2-value lists
   *        with initial and final value of the property. Obviously, the
   *        values must be numbers.
   * @param {Number} delay - The delay of the tween. If set, the total 
   *        execution time of the tween will be `delay + duration`.
   * @param {Boolean} loop - If the tween should repeat or not. If true, the 
   *        tween `hasFinished` method will only return true when the tween is
   *        manually stop. Notice that, the tween will pause for the delay time
   *        every iteration.
   * @param {Function} ease - The easing function.
   */
  constructor(target, duration, properties, delay=0, loop=false, ease=null) {
    ease = ease || linear

    this._target = target
    this._duration = duration
    this._delay = delay
    this._loop = loop
    this._properties = properties
    this._ease = ease

    this._isFinished = false
    this._currentTime = 0

    this._updateFn = null
    this._stopFn = null
  }

  /**
   * The target objects (which will receive the modifications). Readonly.
   * @type {Object}
   */
  get target() { return this._target }

  /**
   * The duration of the tween, in milliseconds. Readonly
   * @type {Number}
   */
  get duration() { return this._duration }

  /**
   * The map of properties to be changed, the key is the name of the property,
   * and the values are a 2-value lists with initial and final value of the 
   * property. Obviously, the values must be numbers.
   * @type {Object}
   */
  get properties() { return this._properties }

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
  update(delta) {
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
        return this.update(delta)
      } else {
        return this.stop()
      }
    }

    // perform the tween
    let t = 1 - (this._duration-v)/this._duration
    let target = this._target
    let ease = this._ease

    for (let k in this._properties) {
      let p = this._properties[k]

      target[k] = lerp(p[0], p[1], ease(t))
    }

    if (this._updateFn) {
      this._updateFn(t)
    }
  }

  /**
   * Stops the tween. This method is also called internally when the tween 
   * finishes its execution.
   */
  stop() {
    if (this._isFinished) return
      
    this._isFinished = true

    for (let k in this._properties) {
      this._target[k] = this._properties[k][1]
    }

    if (this._updateFn) {
      this._updateFn()
    }
  }

  /**
   * Resets the tween, starting it again from zero.
   */
  reset() {
    this._isFinished = false
    this._currentTime = 0

    for (let k in this._properties) {
      this._target[k] = this._properties[k][0]
    }
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