import Manager from 'core/Manager' 
import MouseEvent from 'core/events/MouseEvent'

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
export default class MouseManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._lastState       = []
    this._state           = []
    this._preventDefaults = null
    this._allowEvents     = null
    this._x               = 0
    this._y               = 0
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
   * Cursor x position. Readonly.
   * @type {Number}
   */
  get x() { return this._x }
  
  /**
   * Cursor y position. Readonly.
   * @type {Number}
   */
  get y() { return this._y }

  /**
   * Cursor position. Readonly.
   * @type {PIXI.Point}
   */
  get position() { return new PIXI.Point(this._x, this._y) }
  
  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    this._setupConfig()
    this._setupEvents()
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
    view.addEventListener('blur', e=>this._onBlur(e), false);
    view.addEventListener('focus', e=>this._onFocus(e), false);
    view.addEventListener('click', e=>this._onClick(e), false)
    view.addEventListener('dblclick', e=>this._onDblClick(e), false)
    view.addEventListener('mousedown', e=>this._onMouseDown(e), false)
    view.addEventListener('mouseup', e=>this._onMouseUp(e), false)
    view.addEventListener('mousemove', e=>this._onMouseMove(e), false)
    view.addEventListener('mouseout', e=>this._onMouseOut(e), false)
    view.addEventListener('mouseover', e=>this._onMouseOver(e), false)
    view.addEventListener('wheel', e=>this._onWheel(e), false)
    view.addEventListener('contextmenu', e=>this._onContextMenu(e), false)
  }

  /**
   * Dispatch a browser keyboard event to the game.
   *
   * @param {String} eventType - The type of the event.
   * @param {Event} event - The browser event.
   */
  _dispatchEvent(eventType, event) {
    if (!this._allowEvents) return

    this.game.events.dispatch(new MouseEvent(
      eventType,
      event.button,
      event.x,
      event.y,
      event
    ))
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
   * Callback for click browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onClick(event) {
    this._dispatchEvent('click', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for dblclick browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onDblClick(event) {
    this._dispatchEvent('doubleclick', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for mousedown browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onMouseDown(event) {
    this._state.push(event.button)
    this._dispatchEvent('mousedown', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for mouseup browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onMouseUp(event) {
    this._state.splice(this._state.indexOf(event.button), 1);
    this._dispatchEvent('mouseup', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for mousemove browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onMouseMove(event) {
    this._dispatchEvent('mousemove', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for mouseout browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onMouseOut(event) {
    this._dispatchEvent('mouseleave', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for mouseover browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onMouseOver(event) {
    this._dispatchEvent('mouseenter', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for wheel browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onWheel(event) {
    // this._dispatchEvent('click', event)

    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Callback for the right mouse click.
   *
   * @param {Event} event - The browser event.
   */
  _onContextMenu(event) {
    if (this._preventDefaults) {
      event.preventDefault()
      return false
    }
  }







  /**
   * Verifies if a given button is down.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isDown(button) {
    return this._state.indexOf(button) >= 0
  }

  /**
   * Verifies if a given button is up.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isUp(button) {
    return this._state.indexOf(button) < 0
  }

  /**
   * Verifies if a given button has changed its status from up to down (this is
   * only valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isPressed(button) {
    return this._state.indexOf(button) >= 0 &&
           this._lastState.indexOf(button) < 0
  }

  /**
   * Verifies if a given button has changed its status from down to up (this is
   * only valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isReleased(button) {
    return this._state.indexOf(button) < 0 &&
           this._lastState.indexOf(button) >= 0
  }

  /**
   * Verifies if any button is down.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyDown(button) {
    return !!this._state.length 
  }

  /**
   * Verifies if any button has changed its status from up to down (this is only
   * valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyPressed(button) {
    for (let i=0; i<this._state.length; i++) {
      let button = this._state[i];
      if (this._lastState.indexOf(button) < 0) return true
    }
  
    return false
  }

  /**
   * Verifies if any button has changed its status from down to up (this is only
   * valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyReleased(button) {
    for (let i=0; i<this._lastState.length; i++) {
      let button = this._lastState[i];
      if (this._state.indexOf(button) < 0) return true
    }

    return false
  }

}