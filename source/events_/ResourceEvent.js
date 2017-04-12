import Event from 'events_/Event'

export default class ResourceEvent extends Event {
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
}