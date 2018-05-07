const Signal = require('sk/core/Signal')

class MouseDownSignal extends Signal {
  dispatch(button, x, y, nativeEvent) {
    super.dispatch(button, x, y, nativeEvent)
  }
}

module.exports = MouseDownSignal