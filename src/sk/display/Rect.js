const pixi = require('pixi.js')

class Rect extends pixi.Graphics {
  constructor(width, height, color=0xFFFFFF, radius=0) {
    super()

    this.beginFill(color)
    if (radius) {
      this.drawRoundedRect(0, 0, width, height, radius)
    } else {
      this.drawRect(0, 0, width, height)
    }
    this.endFill()
  }
}

module.exports = Rect