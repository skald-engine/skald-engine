const Event = require('sk/events/Event')

class ResourceEvent extends Event {
  constructor(type, id, url, resource, metadata, cancelable) {
    super(type, cancelable)

    this._id = id
    this._url = url
    this._resource = resource
    this._metadata = metadata
  }

  get id() { return this._id }
  get url() { return this._url }
  get resource() { return this._resource }
  get metadata() { return this._metadata }

  reset() {
    super.reset()
    this._id = null
    this._url = null
    this._resource = null
    this._metadata = null
  }
}


module.exports = ResourceEvent