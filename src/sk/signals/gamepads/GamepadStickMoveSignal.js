const Signal = require('sk/core/Signal')

class GamepadStickMoveSignal extends Signal {
  dispatch(gamepadId, leftStickX, leftStickY, rightStickX, rightStickY) {
    super.dispatch(gamepadId, leftStickX, leftStickY, rightStickX, rightStickY)
  }
}

module.exports = GamepadStickMoveSignal