const Signal = require('sk/core/Signal')

class GamepadButtonUpSignal extends Signal {
  dispatch(gamepadId, button) {
    super.dispatch(gamepadId, button)
  }
}

module.exports = GamepadButtonUpSignal