
export default class Touch {
  constructor(index, game) {
    this._id = null
    this._index = index
    this._game = game

    this._down = false
    this._x = null
    this._y = null
    this._force = null
    this._radiusX = null
    this._radiusY = null
    this._rotation = null
  }

  get id() { return this._id }
  get index() { return this._index }
  get game() { return this._game }
  get down() { return this._down }
  get x() { return this._x }
  get y() { return this._y }
  get position() { return new PIXI.Point(this._x, this._y) }
  get force() { return this._force }
  get radiusX() { return this._radiusX }
  get radiusY() { return this._radiusY }
  get radius() { return new PIXI.Point(this._radiusX, this._radiusY) }
  get rotation() { return this._rotation }

  bind(touch) {
    this._down = true
    this._id = touch.identifier
    this.notify(touch)
  }

  unbind(touch) {
    this._id = -1
    this._down = false
    if (touch) this.notify(touch)
  }

  notify(touch) {
    this._x = touch.pageX
    this._y = touch.pageY
    this._force = touch.force || touch.webkitForce || 0
    this._radiusX = touch.radiusX || touch.webkitRadiusX || 0
    this._radiusY = touch.radiusY || touch.webkitRadiusY || 0
    this._rotation = touch.rotationAngle || touch.webkitRotationAngle || 0
  }
}