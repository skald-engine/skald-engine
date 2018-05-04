const Signal = require('sk/core/Signal')

class OrientationChangeSignal extends Signal {
  dispatch(orientation, alpha, beta, gamma) {
    super.dispatch(orientation, alpha, beta, gamma)
  }
}

module.exports = OrientationChangeSignal