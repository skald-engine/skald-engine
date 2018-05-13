const $ = require('sk/$')
const Manager = require('sk/core/Manager')

/**
 * A manager that handles the keyboard state. It is created by the game and can be
 * accessed via `game.keyboard`.
 *
 * This manager uses the browser events to keep the keyboard state updated. The
 * state is the set of the status of each individual keys in a given time step.
 *
 * You may use the constants {@link KEYS} with this manager.
 *
 * Usage example:
 *
 *    update() {
 *      if (game.keyboard.isDown(sk.KEYS.UP)) {
 *        // move play forward
 *      })
 *
 *      if (game.keyboard.isDown(sk.KEYS.SPACE)) {
 *        // shoot!
 *      }
 *    }
 */
class KeyboardManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor() {
    super()

    this._lastState       = []
    this._state           = []
    this._preventDefault = null

    this._profile       = null
    this._config        = null
    this._renderer      = null
    this._keyDownSignal = null
    this._keyHoldSignal = null
    this._keyUpSignal   = null
  }

  /**
   * Whether this manager should prevent the default keyboard event behavior or
   * not.
   * @type {Boolean}
   */
  get preventDefault() { return this._preventDefault }
  set preventDefault(value) { this._preventDefault = !!value}

  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    let injector = $.getInjector()

    this._profile = injector.resolve('profile')
    this._config = injector.resolve('config')
    this._renderer = injector.resolve('renderer')
    this._keyDownSignal = injector.resolve('keyDownSignal')
    this._keyHoldSignal = injector.resolve('keyHoldSignal')
    this._keyUpSignal = injector.resolve('keyUpSignal')

    this._profile.begin('keyboard')
    this._setupConfig()
    this._setupEvents()
    this._profile.end('keyboard')
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    this._preventDefault = this._config.get('keyboard.prevent_default', false)
  }

  /**
   * Setup the events on the canvas.
   */
  _setupEvents() {
    let view = this._renderer.view
    view.addEventListener('blur', e=>this._onBlur(e), false)
    view.addEventListener('focus', e=>this._onFocus(e), false)
    view.addEventListener('keydown', e=>this._onKeyDown(e), false)
    view.addEventListener('keypress', e=>this._onKeyPress(e), false)
    view.addEventListener('keyup', e=>this._onKeyUp(e), false)
  }

  /**
   * Dispatch a browser keyboard event to the game.
   *
   * @param {String} eventType - The type of the event.
   * @param {Event} nativeEvent - The browser event.
   */
  _dispatchEvent(signal, nativeEvent) {
    signal.dispatch(
      nativeEvent.keyCode || nativeEvent.which,
      nativeEvent.shiftKey,
      nativeEvent.ctrlKey,
      nativeEvent.altKey,
      nativeEvent.metaKey,
      nativeEvent
    )
  }

  /**
   * Callback for the canvas blur event.
   *
   * @param {Event} event - The browser event.
   */
  _onBlur(event) {
    this._state = []
  }

  /**
   * Callback for the canvas focus event.
   *
   * @param {Event} event - The browser event.
   */
  _onFocus(event) {
  }

  /**
   * Callback for the canvas keydown event.
   *
   * @param {Event} event - The browser event.
   */
  _onKeyDown(event) {
    // Pressing key the first time
    if (this._state.indexOf(event.keyCode||event.which) < 0) {
      this._state.push(event.keyCode||event.which)
      this._dispatchEvent(this._keyDownSignal, event)

    // Holding key
    } else {
      this._dispatchEvent(this._keyHoldSignal, event)
    }

    if (this._preventDefault) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for the canvas keypress event.
   *
   * @param {Event} event - The browser event.
   */
  _onKeyPress(event) {
    if (this._preventDefault) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for the canvas keyup event.
   *
   * @param {Event} event - The browser event.
   */
  _onKeyUp(event) {
    this._state.splice(this._state.indexOf(event.keyCode||event.which), 1)
    this._dispatchEvent(this._keyUpSignal, event)

    if (this._preventDefault) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate() {
    this._lastState = this._state.slice()
  }

  /**
   * Verifies if a given key is down.
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isDown(key) {
    return this._state.indexOf(key) >= 0
  }

  /**
   * Verifies if a given key is up.
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isUp(key) {
    return this._state.indexOf(key) < 0
  }

  /**
   * Verifies if a given key has changed its status from up to down (this is
   * only valid for a single tick).
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isPressed(key) {
    return this._state.indexOf(key) >= 0 &&
           this._lastState.indexOf(key) < 0
  }

  /**
   * Verifies if a given key has changed its status from down to up (this is
   * only valid for a single tick).
   *
   * @param {Number} key - The key code.
   * @return {Boolean} The key status.
   */
  isReleased(key) {
    return this._state.indexOf(key) < 0 &&
           this._lastState.indexOf(key) >= 0
  }

  /**
   * Verifies if any key is down.
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isAnyDown(key) {
    return !!this._state.length 
  }

  /**
   * Verifies if any key has changed its status from up to down (this is only
   * valid for a single tick).
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isAnyPressed(key) {
    for (let i=0; i<this._state.length; i++) {
      let key = this._state[i];
      if (this._lastState.indexOf(key) < 0) return true
    }
  
    return false
  }

  /**
   * Verifies if any key has changed its status from down to up (this is only
   * valid for a single tick).
   *
   * @param {KEY} key - The key code.
   * @return {Boolean} The key status.
   */
  isAnyReleased(key) {
    for (let i=0; i<this._lastState.length; i++) {
      let key = this._lastState[i];
      if (this._state.indexOf(key) < 0) return true
    }

    return false
  }
}

module.exports = KeyboardManager