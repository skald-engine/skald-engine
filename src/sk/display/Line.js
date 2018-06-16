const pixi = require('pixi.js')

class Line extends pixi.Graphics {
  constructor(x, y, width=1, color=0xFFFFFF, alignment=1) {
    super()

    this.lineStyle(width, color, 1, alignment)
    this.moveTo(0, 0)
    this.lineTo(x, y)
  }
}

module.exports = Line