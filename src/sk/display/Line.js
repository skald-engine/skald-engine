const pixi = require('pixi.js')

class Line extends pixi.Graphics {
  constructor(x, y, color=0xFFFFFF, width=1, alignment=1) {
    super()

    this.lineStyle(width, color, 1, alignment)
    this.moveTo(0, 0)
    this.lineTo(x, y)
  }
}

module.exports = Line