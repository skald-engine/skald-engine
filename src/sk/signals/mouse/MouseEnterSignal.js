const Signal = require('sk/core/Signal')

class MouseEnterSignal extends Signal {
  dispatch(x, y, nativeEvent) {
    super.dispatch(x, y, nativeEvent)
  }
}

module.exports = MouseEnterSignal