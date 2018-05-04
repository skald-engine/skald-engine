const Signal = require('sk/core/Signal')

class EnterWrongOrientationSignal extends Signal {
  dispatch(orientation, alpha, beta, gamma) {
    super.dispatch(orientation, alpha, beta, gamma)
  }
}

module.exports = EnterWrongOrientationSignal