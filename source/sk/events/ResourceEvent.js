const Event = require('sk/events/Event')

class ResourceEvent extends Event {
  constructor(type, id, url, resource, metadata, cancelable) {
    super(type, cancelable)

    this._id = id
    this._url = url
    this._resource = resource
  }

  get id() { return this._id }
  get url() { return this._url }
  get resource() { return this._resource }

  reset() {
    super.reset()
    this._id = null
    this._url = null
    this._resource = null
  }
}


module.exports = ResourceEvent