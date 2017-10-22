const InputEvent = require('sk/events/InputEvent')

class TouchEvent extends InputEvent {
  constructor(type, index, x, y, nativeEvent, cancelable) {
    super(type, cancelable)

    this._index      = index
    this._x           = x
    this._y           = y
    this._nativeEvent = nativeEvent
  }

  get index() { return this._index }
  get x() { return this._x }
  get y() { return this._y }
  get position() { return new PIXI.Point(this._x, this._y) }
  get nativeEvent() { return this._nativeEvent }

  reset() {
    super.reset()
    this._index = null
    this._x = null
    this._y = null
    this._nativeEvent = null
  }
}


module.exports = TouchEvent