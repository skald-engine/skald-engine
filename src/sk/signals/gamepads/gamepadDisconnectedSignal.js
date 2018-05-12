const Signal = require('sk/core/Signal')

class GamepadDisconnectedSignal extends Signal {
  dispatch(gamepadId) {
    super.dispatch(gamepadId)
  }
}

module.exports = GamepadDisconnectedSignal