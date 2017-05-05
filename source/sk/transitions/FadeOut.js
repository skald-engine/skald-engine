import TweenTransition from 'sk/core/TweenTransition'

/**
 * A transition effect to fade-out the current scene.
 */
export default class FadeOut extends TweenTransition {
  constructor(duration, ease) {
    super(duration, ease)
    
    this._swapScenes = true
  }

  start() {
    if (this.currentWorld) {
      this.currentWorld.alpha = 1
      this.addTween({
        target: this.currentWorld,
        duration: this.duration,
        ease: this.ease,
        to: {
          alpha: 0
        }
      })
    }
  }
}