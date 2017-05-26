import lerp from 'sk/utils/lerp'
import {linear} from 'sk/utils/easing'

export default class Task {
  constructor(duration, delay=0, loop=false, ease=null, update=null,
              stop=null) {
    this._duration = duration
    this._delay = delay
    this._loop = loop
    this._ease = ease || linear

    this._isFinished = false
    this._currentTime = 0

    this._updateFn = update
    this._stopFn = stop
  }

  get duration() { return this._duration }
  get delay() { return this._delay }
  get loop() { return this._loop }
  get ease() { return this._ease }

  update(delta) {
    if (this._isFinished) return

    // convert seconds to milliseconds
    this._currentTime += delta*1000

    // verify if the tween is in the delay
    let v = this._currentTime - this._delay
    if (v < 0) return

    // verify if the tween has finished
    if (v > this._duration) {
      if (this._loop) {
        this.reset()
        this._currentTime = v - this.duration
        return this._update(delta)
      } else {
        return this.stop()
      }
    }

    // perform the tween
    let th = this.ease(1 - (this._duration-v)/this._duration)
    if (this._updateFn) this._updateFn(th, delta)
  }

  stop() {
    if (this._isFinished) return
    this._isFinished = true

    if (this._updateFn) this._updateFn(1, 0)
    if (this._stopFn) this._stopFn()
  }

  reset() {
    this._isFinished = false
    this._currentTime = 0
  }

  hasFinished() {
    return this._isFinished
  }
}