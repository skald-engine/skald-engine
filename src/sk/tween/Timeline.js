const BaseTween = require('sk/tween/BaseTween')
const Tween = require('sk/tween/Tween')

const ITEM_TYPE = {
  TWEEN    : 'tween',
  CALL     : 'call',
}

class TimelineItem {
  constructor(type, object, start, end) {
    this.type   = type
    this.object = object
    this.start  = start
    this.end    = end

    this.lastTime = null
  }
  
  update(time, reversed) {
    if (time === this.lastTime) return

    let lastTime = this.lastTime
    let pastStart = false
    let pastEnd = false
    let within = false

    if (lastTime !== null) {
      if (!reversed && lastTime < this.end && time > this.end) {
        pastEnd = true
      }
      if (reversed && lastTime > this.start && time < this.start) {
        pastStart = true
      }
    }
    if (time >= this.start && time <= this.end) {
      within = true
    }
    
    if (within || pastStart || pastEnd) {
      if (this.type === ITEM_TYPE.TWEEN) {
        let localTime = Math.min(Math.max(time, this.start), this.end) - this.start
        this.object.seek(localTime, true, true)
      } else if (this.type === ITEM_TYPE.CALL) {
        this.object()
      }
    }

    this.lastTime = time
  }

  reset() {
    if (this.type === ITEM_TYPE.TWEEN) {
      this.object._reset()
    }
  }
}

class Timeline extends BaseTween {
  constructor(options) {
    options = options || {}
    
    super(options)
    
    if (options.yoyo) {
      throw new Error(`Timeline does not support yoyo parameter yet`)
    }

    if (options.repeat > 0) {
      throw new Error(`Timeline does not support repeat parameter yet`)
    }

    this._duration = 0    
    this._items = []
  }

  _computeStart(relative, absolute) {
    let reference = this._duration
    if (Number.isFinite(absolute)) {
      reference = absolute
    }

    return Math.max(reference += relative, 0)
  }

  tween(tween, relative=0, absolute=null) {
    let start = this._computeStart(relative, absolute)
    let end = start + tween.totalDuration

    this._items.push(new TimelineItem(
      ITEM_TYPE.TWEEN,
      tween,
      start,
      end
    ))

    this._duration = Math.max(this._duration, end)
    return this
  }
  call(fn, relative=0, absolute=null) {
    let start = this._computeStart(relative, absolute)
    let end = start

    this._items.push(new TimelineItem(
      ITEM_TYPE.CALL,
      fn,
      start,
      end
    ))

    this._duration = Math.max(this._duration, end)
    return this
  }
  sleep(time, relative=0, absolute=null) {
    let start = this._computeStart(relative, absolute)
    let end = start + time

    this._items.push(new TimelineItem(
      ITEM_TYPE.SLEEP,
      time,
      start,
      end
    ))

    this._duration = Math.max(this._duration, end)
    return this
  }

  fromTo(target, duration, fromVars, toVars, options, relative=0, absolute=null) {
    return this.tween(
      Tween.fromTo(target, duration, fromVars, toVars, options),
      relative,
      absolute
    )
  }
  from(target, duration, fromVars, options, relative=0, absolute=null) {
    return this.tween(
      Tween.from(target, duration, fromVars, options),
      relative,
      absolute
    )
  }
  to(target, duration, toVars, options, relative=0, absolute=null) {
    return this.tween(
      Tween.to(target, duration, toVars, options),
      relative,
      absolute
    )
  }

  _reset() {
    super._reset()

    for (let i=0; i<this._items.length; i++) {
      this._items[i].reset()
    }
  }

  _update(progress, justStarted, justRepeated, justReversed, justEnded) {
    let localTime = Math.round(progress * this._duration)
    let reversed = justReversed? !!this._reversed : this._reversed

    for (let i=0; i<this._items.length; i++) {
      let item = this._items[i]
      item.update(localTime, reversed)
    }
  }
}

module.exports = Timeline