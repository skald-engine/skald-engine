import Entity from 'core/Entity'

export default class Sprite extends Entity {
  constructor(game, scene, suppressInitialize) {
    let displayObject = new PIXI.Sprite()
    super(game, scene, displayObject, suppressInitialize)
  }

  get texture() { return this._displayObject.texture }
  set texture(value) { 
    this._displayObject.texture = value
  }

  get width() { return this._displayObject.width }
  set width(value) { this._displayObject.width = value }

  get height() { return this._displayObject.height }
  set height(value) { this._displayObject.height = value }

  get anchor() { return this._displayObject.anchor }
  set anchor(value) { this._displayObject.anchor = value }

  get tint() { return this._displayObject.tint }
  set tint(value) { this._displayObject.tint = value }
}