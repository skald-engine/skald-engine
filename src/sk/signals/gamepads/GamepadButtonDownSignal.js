const Signal = require('sk/core/Signal')

class GamepadButtonDownSignal extends Signal {
  dispatch(gamepadId, button) {
    super.dispatch(gamepadId, button)
  }
}

module.exports = GamepadButtonDownSignal