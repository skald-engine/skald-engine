const Signal = require('sk/core/Signal')

class ResourceUnloadedSignal extends Signal {
  dispatch(id, resource) {
    super.dispatch(id, resource)
  }
}

module.exports = ResourceUnloadedSignal