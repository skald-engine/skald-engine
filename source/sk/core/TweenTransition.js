import Transition from 'sk/core/Transition'
import * as utils from 'sk/utils'

/**
 * Generic tween transition.
 *
 * This class is helper to create transitions using tweens. The transition 
 * object will handle the proper execution of the tween objects.
 * 
 * By default, the TweenTransition receives the transition duration and the 
 * easing function as parameters. You can use them to create the new 
 * transitions.
 *
 * You only should create the tween objects in the `start` method, because it 
 * requires the world instances. Update, stop and hasFinish methods already 
 * have a default procedure, so it don't need to worry about them. 
 *
 * To create a tween, you should use the method `addTween` with the tween 
 * spec. It will create the tween object internally.
 *
 * Notice that, `stop` method will remove all tweens registered in this 
 * transition.
 */
export default class TweenTransition extends Transition {
  
  /**
   * Constructor.
   * 
   * @param {Number} [duration=400] - Total duration (in milliseconds) of the 
   *        transition.
   * @param {Function} [ease=skald.utils.easing.linear] - The easing function.
   */
  constructor(duration=400, ease=utils.easing.linear) {
    super()

    this._duration = duration
    this._ease = ease
    this._tweens = []
  }


  /**
   * The total duration (in milliseconds) of this transition. Readonly.
   * @type {Number}
   */
  get duration() { return this._duration }

  /**
   * The easing function. You may use the functions of `skald.utils.easing`. 
   * Readonly.
   * @type {Function}
   */
  get ease() { return this._ease }


  /**
   * Adds a new tween.
   *
   * @param {Object} spec - The tween specification.
   */
  addTween(spec) {
    this._tweens.push(utils.tween(spec))
  }

  /**
   * Start the transition.
   */
  start() {}

  /**
   * Update the transition.
   */
  update(delta) {
    for (let i=0; i<this._tweens.length; i++) {
      this._tweens[i].update(delta)
    }
  }

  /**
   * Finishes the transition.
   */
  stop() {
    for (let i=0; i<this._tweens.length; i++) {
      this._tweens[i].stop()
    }
    this._tweens = []
  }

  /**
   * Informs if the transition has been finished or not.
   *
   * @return {Boolean} `true` if the transition has been finished.
   */
  hasFinished() {
    for (let i=0; i<this._tweens.length; i++) {
      if (!this._tweens[i].hasFinished()) {
        return false
      }
    }

    return true
  }
}
