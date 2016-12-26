import InputEvent from 'core/events/InputEvent'

export default class Mouse0Event extends InputEvent {
  constructor(type, button, x, y, nativeEvent, cancelable) {
    super(type, cancelable)

    this._button      = button
    this._x           = x
    this._y           = y
    // this._shift       = shift
    // this._ctrl        = ctrl
    // this._meta        = meta
    // this._alt         = alt
    this._nativeEvent = nativeEvent
  }

  get button() { return this._button }
  get x() { return this._x }
  get y() { return this._y }
  get position() { return new PIXI.Point(this._x, this._y) }
  get shift() { return this._shift }
  get ctrl() { return this._ctrl }
  get meta() { return this._meta }
  get alt() { return this._alt }
  get nativeEvent() { return this._nativeEvent }
}