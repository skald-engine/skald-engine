const Signal = require('sk/core/Signal')

class MouseLeaveSignal extends Signal {
  dispatch(x, y, nativeEvent) {
    super.dispatch(x, y, nativeEvent)
  }
}

module.exports = MouseLeaveSignal