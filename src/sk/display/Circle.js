const pixi = require('pixi.js')

class Circle extends pixi.Graphics {
  constructor(radius, color=0xFFFFFF) {
    super()

    this.beginFill(color)
    this.drawCircle(radius, radius, radius)
    this.endFill()
  }
}

module.exports = Circle