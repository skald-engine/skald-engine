const Signal = require('sk/core/Signal')

class MouseMoveSignal extends Signal {
  dispatch(x, y, nativeEvent) {
    super.dispatch(x, y, nativeEvent)
  }
}

module.exports = MouseMoveSignal