import {InterpolationTransition} from 'core'

/**
 * A transition effect to fade-out the current scene.
 */
export default class FadeOut extends InterpolationTransition {
  constructor(time, ease) {
    super(time, ease)
    
    this._swapScenes = true
    
    this._currentSceneTransition = {
      properties: {
        alpha: [1, 0]
      }
    }
    this._nextSceneTransition = {
      properties: {
        alpha: [1, 1]
      }
    }
  }
}