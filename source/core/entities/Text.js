import Entity from 'core/Entity'
import FontStyle from 'core/FontStyle'

export default class Text extends Entity {
  constructor(game, scene, suppressInitialize) {
    let displayObject = new PIXI.Text()
    super(game, scene, displayObject, suppressInitialize)

    this.style = new FontStyle()
  }

  get anchor() { return this._displayObject.anchor }
  set anchor(value) { this._displayObject.anchor = value }

  get width() { return this._displayObject.width }
  set width(value) { this._displayObject.width = value }

  get height() { return this._displayObject.height }
  set height(value) { this._displayObject.height = value }

  get style() { return this.displayObject.style }
  set style(style) {
    if (!(style instanceof FontStyle)) {
      style = new FontStyle(style)
    }
    this.displayObject.style = style
   }

  get text() { return this.displayObject.text }
  set text(text) { this.displayObject.text = text }
}