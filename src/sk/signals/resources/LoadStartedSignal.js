const Signal = require('sk/core/Signal')

class LoadStartedSignal extends Signal {
  dispatch(total) {
    super.dispatch(total)
  }
}

module.exports = LoadStartedSignal