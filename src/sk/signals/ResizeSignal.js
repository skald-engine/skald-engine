const Signal = require('sk/core/Signal')

class ResizeSignal extends Signal {
  dispatch(width, height) {
    super.dispatch(width, height)
  }
}

module.exports = ResizeSignal