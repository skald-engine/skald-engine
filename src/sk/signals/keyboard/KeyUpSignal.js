const Signal = require('sk/core/Signal')

class KeyUpSignal extends Signal {
  dispatch(code, shift, ctrl, alt, meta, nativeEvent) {
    super.dispatch(code, shift, ctrl, alt, meta, nativeEvent)
  }
}

module.exports = KeyUpSignal