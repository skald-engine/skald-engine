import TweenTransition from 'sk/core/TweenTransition'

export default class MoveOut extends TweenTransition {
  constructor(direction, duration, ease) {
    super(duration, ease)

    this._direction = direction || 'left'
    this._swapScenes = true
  }

  get direction() { return this._direction }

  start() {
    const w = this.game.display.width
    const h = this.game.display.height

    if (this.currentWorld) {
      let x = 0
      let y = 0

      if (this.direction.endsWith('left')) {
        x = -w
      } else if (this.direction.endsWith('right')) {
        x = w
      }

      if (this.direction.startsWith('top')) {
        y = -h
      } else if (this.direction.startsWith('bottom')) {
        y = h
      }

      this.currentWorld.x = 0
      this.currentWorld.y = 0
      this.addTween({
        target: this.currentWorld,
        duration: this.duration,
        ease: this.ease,
        to: {x, y}
      })
    }
  }
}