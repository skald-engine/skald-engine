const Signal = require('sk/core/Signal')

class KeyHoldSignal extends Signal {
  dispatch(code, shift, ctrl, alt, meta, nativeEvent) {
    super.dispatch(code, shift, ctrl, alt, meta, nativeEvent)
  }
}

module.exports = KeyHoldSignal