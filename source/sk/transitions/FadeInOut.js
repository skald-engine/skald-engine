import InterpolationTransition from 'sk/core/InterpolationTransition'

/**
 * A transition effect to fade-out the current scene and then fade-in the new
 * scene.
 */
export default class FadeInOut extends InterpolationTransition {
  constructor(time, ease) {
    super(time, ease)
    
    this._currentSceneTransition = {
      duration: 0.5,
      properties: {
        alpha: [1, 0]
      }
    }

    this._nextSceneTransition = {
      delay: 0.5,
      duration: 0.5,
      properties: {
        alpha: [0, 1]
      }
    }
  }
}