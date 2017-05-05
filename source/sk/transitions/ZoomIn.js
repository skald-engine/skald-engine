import TweenTransition from 'sk/core/TweenTransition'

export default class ZoomIn extends TweenTransition {
  start() {
    if (this.nextWorld) {
      this.nextWorld.scale.x = 0
      this.nextWorld.scale.y = 0
      this.nextWorld.x = this.game.display.width/2
      this.nextWorld.y = this.game.display.height/2

      this.addTween({
        target: this.nextWorld,
        duration: this.duration,
        ease: this.ease,
        to: {
          x: 0,
          y: 0
        }
      })
      this.addTween({
        target: this.nextWorld.scale,
        duration: this.duration,
        ease: this.ease,
        to: {
          x: 1,
          y: 1
        }
      })
    }
  }
}