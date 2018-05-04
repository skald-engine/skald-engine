const Signal = require('sk/core/Signal')

class ViewAddedSignal extends Signal {
  dispatch(id, view) {
    super.dispatch(id, view)
  }
}

module.exports = ViewAddedSignal