import TweenTransition from 'sk/core/TweenTransition'

/**
 * A transition effect to fade-out the current scene.
 */
export default class ZoomOut extends TweenTransition {
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
        duration: this.duration,
        ease: this.ease,
        to: {
          x: this.game.display.width/2,
          y: this.game.display.height/2
        }
      })
      this.addTween({
        target: this.currentWorld.scale,
        duration: this.duration,
        ease: this.ease,
        to: {
          x: 0,
          y: 0
        }
      })
    }
  }
}