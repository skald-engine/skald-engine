import InputEvent from 'sk/events/InputEvent'

export default class GamepadEvent extends InputEvent {
  constructor(type, gamepad, nativeEvent, cancelable) {
    super(type, cancelable)

    this._gamepad     = gamepad
  }

  get gamepad() { return this._gamepad }
}