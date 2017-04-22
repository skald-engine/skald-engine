import Transition from 'sk/core/Transition'
import * as utils from 'sk/utils'

/**
 * Generic interpolation transition.
 *
 * You may extend this class to create interpolation-based transitions. I.e.,
 * transitions that change numeric values from one point to another, for 
 * example, a fade in transition that changes alpha from 0 to 1.
 *
 * By default, all interpolation transitions have the `time` and `ease` 
 * variables that are used to control how much time the transition will take 
 * (thus, it can verifies automatically is the transition is finished or not),
 * and to transform transition values over time, respectively.
 * 
 * This class uses the variables `_currentSceneTransition` and
 * `_nextSceneTransition` to configure how the values will work. These 
 * variables must take the following form:
 *
 *     {
 *       delay: 0,
 *       duration: 1,
 *       properties: {
 *         alpha: [0, 1]
 *       }
 *     }
 *
 * where:
 *
 * - **delay** is the percentage of the total time that the transition will 
 *   wait to execute. For example, if the transition will take 400 
 *   milliseconds and the delay for the next scene transition is 0.5, thus the
 *   next scene transition will start after 200 milliseconds.
 * - **duration** is the percentage of the total time that the transition will
 *   run. For instance, suppose that you have a transition with 400 
 *   milliseconds and the duration of 0.5 for the next scene transition, thus, 
 *   the next scene transition will finish at 200 milliseconds. Notice that,
 *   if you set the value so `delay+duration > 1`, the duration will be 
 *   automatically set to its maximum possible value (i.e., 
 *   `duration = 1-delay`).
 * - **properties** the list of properties that will be used in the 
 *   interpolation and their values. You should use the format: 
 *   `property: [initial value, final value]`.
 *
 *
 * Example of use:
 *
 *     class FadeInOut extends skald.InterpolationTransition {
 *       constructor(time, ease) {
 *         super(time, ease)
 *
 *         // fades out the current scene
 *         this._currentSceneTransition = {
 *           delay: 0, // no delay
 *           duration: 0.5, // will finish at the half of the transition
 *           properties: {
 *             alpha: [1, 0] // will change the alpha from 1 to 0
 *           }
 *         }
 *         
 *         // fades in the next scene
 *         this._currentSceneTransition = {
 *           delay: 0.5, // will start after the half of the transition
 *           duration: 0.5, // will run until the final moment of the transition
 *           properties: {
 *             alpha: [0, 1] // will change the alpha from 0 to 1
 *           }
 *         }
 *       }
 *     }
 */
export default class InterpolationTransition extends Transition {
  
  /**
   * @param {Number} [time=400] - Total duration (in milliseconds) of the 
   *        transition.
   * @param {Function} [ease=skald.utils.easing.linear] - The easing function.
   */
  constructor(time, ease) {
    super()

    this._time = time || 400
    this._ease = ease || utils.easing.linear
    this._currentSceneTransition = null
    this._nextSceneTransition = null

    this._currentTime = 0
  }


  /**
   * The total duration (in milliseconds) of this transition. Readonly.
   * @type {Number}
   */
  get time() { return this._time }

  /**
   * The easing function. You may use the functions of `skald.utils.easing`. 
   * Readonly.
   * @type {Function}
   */
  get ease() { return this._ease }


  /**
   * Validates and fill with defaults the transition objects.
   *
   * @param {Object} transition - The transition object.
   */
  _verifyTransition(transition) {
    if (!transition) return

    transition.duration = transition.duration || 1
    transition.delay = transition.delay || 0
    transition.properties = transition.properties || {}

    Object.keys(transition.properties).forEach(p => {
      let range = transition.properties[p]
      if (!range ||
          typeof range[0] !== 'number' ||
          typeof range[1] !== 'number') {
        throw new Error(`Wrong range value in transition property "${p}". `+
                        `Please use numeric values in the format \`[0, 1]\`.`)
      }
    })
  }

  /**
   * Change scene parameters given a transition and a theta value.
   *
   * @param {Scene} scene - The scene object.
   * @param {Object} transition - The transition object.
   * @param {Number} theta - The percentage of the transition progression, must
   *        be between 0 and 1, where 0 is the initial state and 1 is the final
   *        state.
   */
  _applyTransition(scene, transition, theta) {
    if (!scene || !transition) return

    // recompute the theta value considering the delay and the duration of
    // the transition
    theta = (theta-transition.delay)/transition.duration
    theta = skald.utils.clip(theta, 0, 1)

    Object.keys(transition.properties).forEach(p => {
      let range = transition.properties[p]

      // Property name may contain "." to access sub properties
      let _ = p.split('.')
      let subproperties = _.slice(0, _.length-1)
      let property = _.slice(-1)

      let item = scene._world
      subproperties.forEach(p => {
        item = item[p]
      })
      item[property] = range[0] + (range[1]-range[0])*theta

    })
  }

  /**
   * Start the transition.
   */
  start() {
    this._currentTime = this._time

    this._verifyTransition(this._currentSceneTransition)
    this._verifyTransition(this._nextSceneTransition)

    this._applyTransition(this._currentScene, this._currentSceneTransition, 0)
    this._applyTransition(this._nextScene, this._nextSceneTransition, 0)
  }

  /**
   * Update the transition.
   */
  update(delta) {
    this._currentTime -= delta*1000
    
    let theta = this._ease(1 - this._currentTime/this._time)
    this._applyTransition(this._currentScene, this._currentSceneTransition, theta)
    this._applyTransition(this._nextScene, this._nextSceneTransition, theta)
  }

  /**
   * Finishes the transition.
   */
  stop() {
    this._applyTransition(this._currentScene, this._currentSceneTransition, 1)
    this._applyTransition(this._nextScene, this._nextSceneTransition, 1)
  }

  /**
   * Informs if the transition has been finished or not.
   *
   * @return {Boolean} `true` if the transition has been finished.
   */
  isFinished() {
    return this._currentTime <= 0
  }
}
