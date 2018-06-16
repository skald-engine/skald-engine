const $ = require('sk/$')
const Manager = require('sk/core/Manager')

class ScheduleItem {
  constructor(callback, interval, once=false) {
    this.callback = callback
    this.interval = interval
    this.once = once

    this.currentTime = 0
  }

  update(elapsed) {
    this.currentTime += elapsed

    if (!this.interval || this.currentTime >= this.interval) {
      this.callback(this.interval? this.currentTime : elapsed)

      if (this.once) {
        return true
      }

      if (this.interval) {
        this.currentTime = Math.min(this.currentTime - this.interval, this.interval)
      }
    }

    return false
  }
}

class ScheduleManager extends Manager {
  constructor() {
    super('schedule')

    this._time = null
    this._scheduled = null
  }

  setup() {
    let injector = $.getInjector()
    this._time = injector.resolve('time')
    this._scheduled = []
  }

  tearDown() {
    this._time = null
    this._scheduled = []
  }

  update() {
    let indexesToRemove = []
    let elapsed = this._time.elapsed

    for (let i=0; i<this._scheduled.length; i++) {
      if (this._scheduled[i].update(elapsed)) {
        indexesToRemove.push(i)
      }
    }

    for (let i=indexesToRemove.length-1; i>=0; i--) {
      this._scheduled.splice(indexesToRemove[i], 1)
    }
  }

  add(callback, interval) {
    this._scheduled.push(new ScheduleItem(callback, interval))
  }

  addOnce(callback, delay) {
    this._scheduled.push(new ScheduleItem(callback, delay, true))
  }

  remove(callback) {
    let idx = this._scheduled.findIndex(x => x.callback === callback)
    if (idx >= 0) {
      this._scheduled.splice(idx, 1)
    }
  }
}

module.exports = ScheduleManager