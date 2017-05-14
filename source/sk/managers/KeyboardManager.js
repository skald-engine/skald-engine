import Manager from 'sk/core/Manager' 
import KeyboardEvent from 'sk/events/KeyboardEvent'
import * as utils from 'sk/utils'

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
export default class KeyboardManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._lastState       = []
    this._state           = []
    this._preventDefaults = null
    this._allowEvents     = null
  }

  /**
   * Whether this manager should prevent the default keyboard event behavior or
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
    utils.profiling.begin('keyboard')
    this._setupConfig()
    this._setupEvents()
    utils.profiling.end('keyboard')
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {
    this._lastState = this._state.slice()
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    let config = this.game.config
    this._preventDefaults = config.keyboard.preventDefaults
    this._allowEvents     = config.keyboard.allowEvents
  }

  /**
   * Setup the events on the canvas.
   */
  _setupEvents() {
    let view = this.game.renderer.view
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
  _dispatchEvent(eventType, nativeEvent) {
    if (!this._allowEvents) return

    let event = this.game.pool.create(KeyboardEvent)
    event._type = eventType
    event._code = nativeEvent.keyCode||nativeEvent.which
    event._shift = nativeEvent.shiftKey
    event._ctrl = nativeEvent.ctrlKey
    event._meta = nativeEvent.metaKey
    event._alt = nativeEvent.altKey
    event._nativeEvent = nativeEvent
    this.game.events.dispatch(event)
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
    if (!event.repeat) {
      this._state.push(event.keyCode||event.which)
      this._dispatchEvent('keyboard.down', event)

    // Holding key
    } else {
      this._dispatchEvent('keyboard.hold', event)
    }

    if (this._preventDefaults) {
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
    if (this._preventDefaults) {
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
    this._dispatchEvent('keyboard.up', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
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

  /**
   * Returns 1 is the key is beign pressed, returns 0 otherwise. This method is
   * useful for the inputs manager.
   *
   * @param {KEY} key - The key code.
   * @return {Number} 1 if key is pressed, 0 otherwise.
   */
  getInput(key) {
    return this.isDown(key)? 1:0
  }
}
