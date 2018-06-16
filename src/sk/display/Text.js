const pixi = require('pixi.js')
const FontStyle = require('sk/core/FontStyle')

class Text extends pixi.Text {
  constructor(text, style) {
    super(text)

    this.style = new FontStyle(style)
  }

  get style() { return this._style }
  set style(style) {
    style = style || {}
    if (style instanceof pixi.TextStyle) {
      this._style = style
    } else {
      this._style = new FontStyle(style)
    }
    this.localStyleID = -1;
    this.dirty = true;
  }
}

module.exports = Text