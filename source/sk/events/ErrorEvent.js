const Event = require('sk/events/Event')

class ErrorEvent extends Event {
  constructor(type, message, details, cancelable) {
    super(type, cancelable)

    this._message = message
    this._details = details
  }

  get message() { return this._message }
  get details() { return this._details }

  reset() {
    super.reset()
    this._message = null
    this._details = null
  }
}


module.exports = ErrorEvent