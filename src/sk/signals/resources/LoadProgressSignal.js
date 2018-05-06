const Signal = require('sk/core/Signal')

class LoadProgressSignal extends Signal {
  dispatch(loaded, total) {
    let progress = (total > 0 && loaded > 0) ? loaded/total : -1 
    super.dispatch(loaded, total, progress)
  }
}

module.exports = LoadProgressSignal