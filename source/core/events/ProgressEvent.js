import Event from 'core/events/Event'

export default class ProgressEvent extends Event {
  constructor(type, loaded, total, cancelable) {
    super(type, cancelable)

    this._loaded = loaded
    this._total = total
    this._progress = (total>0&&loaded>0)? loaded/total : -1
  }

  get loaded() { return this._loaded }
  get total() { return this._total }
  get progress() { return this._progress }
}