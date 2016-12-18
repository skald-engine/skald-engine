import {InterpolationTransition} from 'core'

/**
 * A transition effect to fade-in the new scene.
 */
export default class FadeIn extends InterpolationTransition {
  constructor(time, ease) {
    super(time, ease)
    
    this._nextSceneTransition = {
      properties: {
        alpha: [0, 1]
      }
    }
  }
}