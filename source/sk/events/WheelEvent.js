import InputEvent from 'sk/events/InputEvent'

export default class Mouse0Event extends InputEvent {
  constructor(type, deltaX, deltaY, deltaZ, nativeEvent, cancelable) {
    super(type, cancelable)

    this._deltaX = deltaX
    this._deltaY = deltaY
    this._deltaZ = deltaZ
    this._nativeEvent = nativeEvent
  }

  get deltaX() { return this._deltaX }
  get deltaY() { return this._deltaY }
  get deltaZ() { return this._deltaZ }
  get nativeEvent() { return this._nativeEvent }
}