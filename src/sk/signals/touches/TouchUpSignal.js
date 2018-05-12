const Signal = require('sk/core/Signal')

class TouchUpSignal extends Signal {
  dispatch(id, x, y, nativeEvent) {
    super.dispatch(id, x, y, nativeEvent)
  }
}

module.exports = TouchUpSignal