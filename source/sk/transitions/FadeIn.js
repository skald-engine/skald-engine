import TweenTransition from 'sk/core/TweenTransition'

export default class FadeIn extends TweenTransition {
  start() {
    if (this.nextWorld) {
      this.nextWorld.alpha = 0
      this.addTween({
        target: this.nextWorld,
        duration: this.duration,
        ease: this.ease,
        to: {
          alpha: 1
        }
      })
    }
  }
}