import InputEvent from 'core/events/InputEvent'

export default class KeyboardEvent extends InputEvent {
  constructor(type, code, shift, ctrl, meta, alt, nativeEvent, cancelable) {
    super(type, cancelable)

    this._code        = code
    this._shift       = shift
    this._ctrl        = ctrl
    this._meta        = meta
    this._alt         = alt
    this._nativeEvent = nativeEvent
  }

  get code() { return this._code }
  get shift() { return this._shift }
  get ctrl() { return this._ctrl }
  get meta() { return this._meta }
  get alt() { return this._alt }
  get nativeEvent() { return this._nativeEvent }
}