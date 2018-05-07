const Signal = require('sk/core/Signal')

class MouseUpSignal extends Signal {
  dispatch(button, x, y, nativeEvent) {
    super.dispatch(button, x, y, nativeEvent)
  }
}

module.exports = MouseUpSignal