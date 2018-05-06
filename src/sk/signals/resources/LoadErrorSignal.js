const Signal = require('sk/core/Signal')

class LoadErrorSignal extends Signal {
  dispatch(message, error, context) {
    super.dispatch(message, error, context)
  }
}

module.exports = LoadErrorSignal