const Signal = require('sk/core/Signal')

class MouseWheelSignal extends Signal {
  dispatch(x, y, z, nativeEvent) {
    super.dispatch(x, y, z, nativeEvent)
  }
}

module.exports = MouseWheelSignal