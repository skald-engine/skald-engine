const Manager = require('sk/core/Manager')

class TimeManager extends Manager {
  constructor() {
    super()

    this._time = 0
    this._previousTime = 0
    this._delta = 0
    this._elapsed = 0
    this._fps = 0
    this._maxElapsed = 100 // 10fps
  }

  /**
   * Current unix-time (i.e., number of milliseconds elapsed since 1 January 
   * 1970 00:00:00 UTC.). Readonly.
   * @type {Number}
   */
  get time() { return this._time }

  /**
   * The unix-time in the previous tick. Readonly
   * @type {Number}
   */
  get prevTime() { return this._previousTime }

  /**
   * The microseconds between last tick and this tick (this means that delta is
   * equals to `elapsed_milliseconds/1000`). Readonly.
   * @type {Number}
   */
  get delta() { return this._delta }

  /**
   * The milliseconds between last tick and this tick. This the same of 
   * `delta*1000`. Readonly.
   * @type {Number}
   */
  get elapsed() { return this._elapsed }

  /**
   * The current FPS counter. This number may have a differ a bit from the real
   * number because the time manager computes the FPS incrementally during the
   * execution of the game.
   * @type {Number}
   */
  get fps() { return parseInt(this._fps) }

  /**
   * Initializes the manager. Called by the engine, thus, do not call it 
   * manually.
   */
  setup() {
    this._time = performance.now()
    this._previousTime = performance.now()
    this._delta = 0
    this._elapsed = 0
    this._fps = 60
  }

  /**
   * Pre update the manager. Called by the engine, thus, do not call it 
   * manually.
   */
  preUpdate() {
    this._previousTime = this._time
    this._time = performance.now()
    this._elapsed = Math.min(this._time - this._previousTime, this._maxElapsed) || 1
    this._delta = this._elapsed/1000
    this._fps = this._fps*0.99 + (1000/this._elapsed)*0.01
  }

}

module.exports = TimeManager