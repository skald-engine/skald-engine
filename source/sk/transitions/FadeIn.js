import InterpolationTransition from 'sk/core/InterpolationTransition'

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