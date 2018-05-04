
const Signal = require('sk/core/Signal')

class ViewEnterSignal extends Signal {
  dispatch(id, view) {
    super.dispatch(id, view)
  }
}

module.exports = ViewEnterSignal