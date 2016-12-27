import Manager from 'core/Manager' 
import Touch from 'core/managers/inputs/Touch'


export default class TouchesManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._preventDefaults = null
    this._allowEvents     = null
    this._touches         = null
    this._numTouches      = 0
  }

  /**
   * Whether this manager should prevent the default mouse event behavior or
   * not.
   * @type {Boolean}
   */
  get preventDefaults() { return this._preventDefaults }
  set preventDefaults(value) { this._preventDefaults = !!value}

  /**
   * Whether this manager should dispatch events or not.
   * @type {Boolean}
   */
  get allowEvents() { return this._allowEvents }
  set allowEvents(value) { this._allowEvents = !!value}

  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    this._setupConfig()
    this._setupEvents()
    this._setupTouches()
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    let config = this.game.config
    this._preventDefaults = config.mouse.preventDefaults
    this._allowEvents     = config.mouse.allowEvents
  }

  /**
   * Setup the touch-related events.
   */
  _setupEvents() {
    let view = this.game.renderer.view
    view.addEventListener('blur', e=>this._onBlur(e), false);
    view.addEventListener('touchstart', e=>this._onTouchStart(e), false);
    view.addEventListener('touchmove', e=>this._onTouchMove(e), false);
    view.addEventListener('touchend', e=>this._onTouchEnd(e), false);
    view.addEventListener('touchcancel', e=>this._onTouchCancel(e), false);
  }

  /**
   * Setup up the touch objects.
   */
  _setupTouches() {
    this._touches = [
      new Touch(0, this.game),
      new Touch(1, this.game),
      new Touch(2, this.game),
      new Touch(3, this.game),
      new Touch(4, this.game),
      new Touch(5, this.game),
      new Touch(6, this.game),
      new Touch(7, this.game),
      new Touch(8, this.game),
      new Touch(9, this.game)
    ]
  }

  _onBlur(event) {
    this._numTouches = 0

    for (let i=0; i<this._touches.length; i++) {
      this._touches[i].unbind()
    }
  }
  _onTouchStart(event) {
    for (let i=0; i<event.changedTouches.length; i++) {
      let browserTouch = event.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (!skaldTouch.down || skaldTouch.id === id) {
          skaldTouch.bind(browserTouch)
          this._numTouches++
          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
  _onTouchMove(event) {
    for (let i=0; i<event.changedTouches.length; i++) {
      let browserTouch = event.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (skaldTouch.id === id) {
          skaldTouch.notify(browserTouch)
          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
  _onTouchEnd(event) {
    for (let i=0; i<event.changedTouches.length; i++) {
      let browserTouch = event.changedTouches[i]
      let id = browserTouch.identifier

      for (let j=0; j<this._touches.length; j++) {
        let skaldTouch = this._touches[j]

        if (skaldTouch.id === id) {
          skaldTouch.unbind(browserTouch)
          this._numTouches--
          break
        }
      }
    }

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }
  _onTouchCancel(event) {
    this._numTouches = 0

    for (let i=0; i<this._touches.length; i++) {
      this._touches[i].unbind()
    }

    if (this._preventDefaults) {
      return false
    }
  }


  get(index) {
    return this._touches[index]
  }
  getFirstTouch() {
    for (let i=0; i<this._touches.length; i++) {
      if (this._touches[i].down) {
        return this._touches[i]
      }
    }
  }
  getNumTouches() {
    return this._numTouches
  }
  getDownTouches() {
    return this._touches.filter(t => t.down)
  }
  getAll() {
    return this._touches.slice()
  }
}