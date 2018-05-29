const Signal = require('sk/core/Signal')

class GamepadButtonHoldSignal extends Signal {
  dispatch(gamepadId, button) {
    super.dispatch(gamepadId, button)
  }
}

module.exports = GamepadButtonHoldSignal