const Signal = require('sk/core/Signal')

class TouchDownSignal extends Signal {
  dispatch(id, x, y, nativeEvent) {
    super.dispatch(id, x, y, nativeEvent)
  }
}

module.exports = TouchDownSignal