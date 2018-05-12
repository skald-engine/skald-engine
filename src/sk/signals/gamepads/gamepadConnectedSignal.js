const Signal = require('sk/core/Signal')

class GamepadConnectedSignal extends Signal {
  dispatch(gamepadId) {
    super.dispatch(gamepadId)
  }
}

module.exports = GamepadConnectedSignal