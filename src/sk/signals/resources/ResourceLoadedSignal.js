const Signal = require('sk/core/Signal')

class ResourceLoadedSignal extends Signal {
  dispatch(id, resource) {
    super.dispatch(id, resource)
  }
}

module.exports = ResourceLoadedSignal