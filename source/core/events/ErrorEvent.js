import Event from 'core/events/Event'

export default class ErrorEvent extends Event {
  constructor(type, message, details, cancelable) {
    super(type, cancelable)

    this._message = message
    this._details = details
  }

  get message() { return this._message }
  get details() { return this._details }
}