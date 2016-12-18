import Manager from 'core/Manager' 

/**
 * Handle the time-based information of the engine.
 */
export default class TimeManager extends Manager {
  constructor(game) {
    super(game)

    this._time = 0
    this._prevTime = 0
    this._delta = 0
    this._elapsed = 0
    this._fps = 0
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
  get prevTime() { return this._prevTime }

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
  get elapsed() { return this._fDelta }

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
    this._time = Date.now()
    this._prevTime = Date.now()
    this._delta = 0
    this._elapsed = 0
    this._fps = 60
  }

  /**
   * Pre update the manager. Called by the engine, thus, do not call it 
   * manually.
   */
  preUpdate() {
    this._prevTime = this._time
    this._time = Date.now()
    this._elapsed = this._time - this._prevTime
    this._delta = this._elapsed/1000
    this._fps = this._fps*0.9 + (1000/this._delta)*0.1
  }
}