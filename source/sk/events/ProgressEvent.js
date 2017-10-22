const Event = require('sk/events/Event')

class ProgressEvent extends Event {
  constructor(type, loaded, total, cancelable) {
    super(type, cancelable)

    this._loaded = loaded
    this._total = total
  }

  get loaded() { return this._loaded }
  get total() { return this._total }
  get progress() {
    return (this._total>0&&this._loaded>0)? 
            this._loaded/this._total :
            -1 
  }

  reset() {
    super.reset()
    this._loaded = null
    this._total = null
  }
}


module.exports = ProgressEvent