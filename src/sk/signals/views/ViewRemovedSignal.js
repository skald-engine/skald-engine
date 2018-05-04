const Signal = require('sk/core/Signal')

class ViewRemovedSignal extends Signal {
  dispatch(id) {
    super.dispatch(id)
  }
}

module.exports = ViewRemovedSignal