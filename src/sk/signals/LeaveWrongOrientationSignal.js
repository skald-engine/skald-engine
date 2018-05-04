const Signal = require('sk/core/Signal')

class LeaveWrongOrientationSignal extends Signal {
  dispatch(orientation, alpha, beta, gamma) {
    super.dispatch(orientation, alpha, beta, gamma)
  }
}

module.exports = LeaveWrongOrientationSignal