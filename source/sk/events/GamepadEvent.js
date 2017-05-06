import InputEvent from 'sk/events/InputEvent'

export default class GamepadEvent extends InputEvent {
  constructor(type, gamepadId, leftStickX, leftStickY, rightStickX, 
              rightStickY, button, cancelable) {
    super(type, cancelable)

    this._gamepadId = gamepadId
    this._leftStickX = leftStickX
    this._leftStickY = leftStickY
    this._rightStickX = rightStickX
    this._rightStickY = rightStickY
    this._button = button
  }

  get gamepadId() { return this._gamepadId }
  get leftStickX() { return this._leftStickX }
  get leftStickY() { return this._leftStickY }
  get rightStickX() { return this._rightStickX }
  get rightStickY() { return this._rightStickY }
  get button() { return this._button }
}