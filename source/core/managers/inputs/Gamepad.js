
export default class Gamepad {
  constructor(game) {
    this._game = null
    this._connected = false
    this._rawLeftStickX = 0
    this._rawLeftStickY = 0
    this._rawRightStickX = 0
    this._rawRightStickY = 0
    this._leftStickX = 0
    this._leftStickY = 0
    this._rightStickX = 0
    this._rightStickY = 0
    this._leftStickForce = 0
    this._rightStickForce = 0
    this._leftTrigger = 0
    this._rightTrigger = 0
    this._deadZoneLeft = 0 // should be on manager
    this._deadZoneRight = 0

    this._lastState = []
    this._state = []
    this._listening = true
  }

  _dispatchEvent(type, event) {}
  _onBlur(event) {}
  _onFocus(event) {}
  _preUpdate(delta) {}
  _postUpdate(delta) {}
  bind(gamepad) {}
  unbind() {}

  isDown(button) {}
  isUp(button) {}
  isPressed(button) {}
  isReleased(button) {}
  isAnyDown() {}
  isAnyReleased() {}
  isAnyPressed() {}

}