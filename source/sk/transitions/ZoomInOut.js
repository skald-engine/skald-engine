import TweenTransition from 'sk/core/TweenTransition'

/**
 * A transition effect to fade-out the current scene.
 */
export default class ZoomInOut extends TweenTransition {
  constructor(duration, ease) {
    super(duration, ease)
    
    this._swapScenes = true
  }

  start() {
    if (this.currentWorld) {
      this.currentWorld.scale.x = 1
      this.currentWorld.scale.y = 1
      this.currentWorld.x = 0
      this.currentWorld.y = 0

      this.addTween({
        target: this.currentWorld,
        duration: this.duration/2,
        ease: this.ease,
        to: {
          x: this.game.display.width/2,
          y: this.game.display.height/2
        }
      })
      this.addTween({
        target: this.currentWorld.scale,
        duration: this.duration/2,
        ease: this.ease,
        to: {
          x: 0,
          y: 0
        }
      })
    }

    if (this.nextWorld) {
      this.nextWorld.scale.x = 0
      this.nextWorld.scale.y = 0
      this.nextWorld.x = this.game.display.width/2
      this.nextWorld.y = this.game.display.height/2

      this.addTween({
        target: this.nextWorld,
        duration: this.duration/2,
        delay: this.duration/2,
        ease: this.ease,
        to: {
          x: 0,
          y: 0
        }
      })
      this.addTween({
        target: this.nextWorld.scale,
        duration: this.duration/2,
        delay: this.duration/2,
        ease: this.ease,
        to: {
          x: 1,
          y: 1
        }
      })
    }
  }
}