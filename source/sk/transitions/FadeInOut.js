import TweenTransition from 'sk/core/TweenTransition'

/**
 * A transition effect to fade-out the current scene and then fade-in the new
 * scene.
 */
export default class FadeInOut extends TweenTransition {
  start() {
    if (this.currentWorld) {
      this.currentWorld.alpha = 1
      this.addTween({
        target: this.currentWorld,
        duration: this.duration/2,
        ease: this.ease,
        to: {
          alpha: 0
        }
      })
    }

    if (this.nextWorld) {
      this.nextWorld.alpha = 0
      this.addTween({
        target: this.nextWorld,
        duration: this.duration/2,
        delay: this.duration/2,
        ease: this.ease,
        to: {
          alpha: 1
        }
      })
    }
  }
}