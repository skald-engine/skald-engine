import InputEvent from 'sk/events/InputEvent'

export default class MouseEvent extends InputEvent {
  constructor(type, button, x, y, nativeEvent, cancelable) {
    super(type, cancelable)

    this._button      = button
    this._x           = x
    this._y           = y
    this._nativeEvent = nativeEvent
  }

  get button() { return this._button }
  get x() { return this._x }
  get y() { return this._y }
  get position() { return new PIXI.Point(this._x, this._y) }
  get nativeEvent() { return this._nativeEvent }

  reset() {
    super.reset()
    this._button = null
    this._x = null
    this._y = null
    this._nativeEvent = null
  }
}