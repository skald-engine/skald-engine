import Entity from 'core/Entity'

export default class BitmapText extends Entity {
  constructor(game, scene, suppressInitialize) {
    let displayObject = new BitmapTextWrap()
    super(game, scene, displayObject, suppressInitialize)
  }

  get anchor() { return this._displayObject.anchor }
  set anchor(value) { this._displayObject.anchor = value }

  get width() { return this._displayObject.width }
  set width(value) { this._displayObject.width = value }

  get height() { return this._displayObject.height }
  set height(value) { this._displayObject.height = value }

  get text() { return this.displayObject.text }
  set text(value) { this.displayObject.text = value }

  get align() { return this.displayObject.align }
  set align(value) { this.displayObject.align = value }

  get tint() { return this.displayObject.tint }
  set tint(value) { this.displayObject.tint = value }

  get font() { return this.displayObject.font }
  set font(value) { this.displayObject.font = value }
}


class BitmapTextWrap extends PIXI.extras.BitmapText {
  updateText() {
    if (!this._font.name) return

    super.updateText()
  }
}