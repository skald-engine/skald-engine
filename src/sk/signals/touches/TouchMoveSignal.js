const Signal = require('sk/core/Signal')

class TouchMoveSignal extends Signal {
  dispatch(id, x, y, nativeEvent) {
    super.dispatch(id, x, y, nativeEvent)
  }
}

module.exports = TouchMoveSignal