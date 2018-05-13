const pixi = require('pixi.js')
const $ = require('sk/$')
const Manager = require('sk/core/Manager')

/**
 * A manager that handles the mouse state. It is created by the game and can be
 * accessed via `game.mouse`.
 *
 * This manager uses the browser events to keep the mouse state updated. The
 * state is the set of the status of each individual buttons in a given time 
 * step.
 *
 * You may use the constants {@link BUTTONS} with this manager.
 *
 * Usage example:
 *
 *    update() {
 *      if (game.mouse.isDown(sk.BUTTONS.LEFT)) {
 *        // click left
 *      })
 *
 *      if (game.mouse.isDown(sk.BUTTONS.RIGHT)) {
 *        // click right
 *      }
 *    }
 */
class MouseManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor() {
    super()

    this._lastState      = []
    this._state          = []
    this._preventDefault = null
    this._x              = 0
    this._y              = 0
    this._deltaX         = 0
    this._deltaY         = 0
    this._deltaZ         = 0

    this._profile  = null
    this._display  = null
    this._config   = null
    this._renderer = null

    this._clickSignal       = null
    this._doubleClickSignal = null
    this._mouseDownSignal   = null
    this._mouseUpSignal     = null
    this._mouseMoveSignal   = null
    this._mouseLeaveSignal  = null
    this._mouseEnterSignal  = null
    this._mouseWheelSignal  = null
  }

  /**
   * Whether this manager should prevent the default mouse event behavior or
   * not.
   * @type {Boolean}
   */
  get preventDefault() { return this._preventDefault }
  set preventDefault(value) { this._preventDefault = !!value}

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
   * Wheel delta X accumulative scroll. Readonly.
   * @type {Number}
   */
  get deltaX() { return this._deltaX }

  /**
   * Wheel delta Y accumulative scroll. Readonly.
   * @type {Number}
   */
  get deltaY() { return this._deltaY }

  /**
   * Wheel delta Z accumulative scroll. Readonly.
   * @type {Number}
   */
  get deltaZ() { return this._deltaZ }

  /**
   * Cursor position. Readonly.
   * @type {PIXI.Point}
   */
  get position() { return new pixi.Point(this._x, this._y) }
  
  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    let injector = $.getInjector()

    this._profile = injector.resolve('profile')
    this._display = injector.resolve('display')
    this._config = injector.resolve('config')
    this._renderer = injector.resolve('renderer')

    this._clickSignal = injector.resolve('clickSignal')
    this._doubleClickSignal = injector.resolve('doubleClickSignal')
    this._mouseDownSignal = injector.resolve('mouseDownSignal')
    this._mouseUpSignal = injector.resolve('mouseUpSignal')
    this._mouseMoveSignal = injector.resolve('mouseMoveSignal')
    this._mouseLeaveSignal = injector.resolve('mouseLeaveSignal')
    this._mouseEnterSignal = injector.resolve('mouseEnterSignal')
    this._mouseWheelSignal = injector.resolve('mouseWheelSignal')

    this._profile.begin('mouse')
    this._x = this._display.halfWidth
    this._y = this._display.halfHeight
    this._setupConfig()
    this._setupEvents()
    this._profile.end('mouse')
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {
    this._lastState = this._state.slice()
    this._deltaX = 0
    this._deltaY = 0
    this._deltaZ = 0
  }

  /**
   * Setup the manager variables using the game configuration.
   */
  _setupConfig() {
    this._preventDefault = this._config.get('mouse.prevent_default', false)
  }

  /**
   * Setup the events on the canvas.
   */
  _setupEvents() {
    let view = this._renderer.view
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
   * Dispatch a browser mouse event to the game.
   *
   * @param {String} eventType - The type of the event.
   * @param {Event} nativeEvent - The browser event.
   */
  _dispatchMouseEvent(signal, nativeEvent) {
    event._button = nativeEvent.button
    event._x = this._x
    event._y = this._y
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
   * Callback for click browser event.
   * 
   * @param {Event} event - The browser event.
   */
  _onClick(event) {
    this._clickSignal.dispatch(event.button, this._x, this._y, event)
    this._renderer.view.focus()

    if (this._preventDefault) {
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
    this._doubleClickSignal.dispatch(event.button, this._x, this._y, event)
    this._renderer.view.focus()

    if (this._preventDefault) {
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
    if (this._state.indexOf(event.button) < 0) {
      this._state.push(event.button)
      this._mouseDownSignal.dispatch(event.button, this._x, this._y, event)
    }

    this._renderer.view.focus()

    if (this._preventDefault) {
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
    this._mouseUpSignal.dispatch(event.button, this._x, this._y, event)

    if (this._preventDefault) {
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
    this._updateMouse(event)
    this._mouseMoveSignal.dispatch(this._x, this._y, event)

    if (this._preventDefault) {
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
    this._mouseLeaveSignal.dispatch(this._x, this._y, event)

    if (this._preventDefault) {
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
    this._mouseEnterSignal.dispatch(this._x, this._y, event)

    if (this._preventDefault) {
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
    this._deltaX += event.deltaX || 0
    this._deltaY += event.deltaY || 0
    this._deltaZ += event.deltaZ || 0

    this._mouseWheelSignal.dispatch(
      this._deltaX,
      this._deltaY,
      this._deltaZ,
      event
    )

    if (this._preventDefault) {
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
    if (this._preventDefault) {
      event.preventDefault()
      return false
    }
  }

  /**
   * Update the mouse position.
   *
   * @param {Event} event - The mouse event.
   */
  _updateMouse(event) {
    let x = event.clientX
    let y = event.clientY

    let rect = this._renderer.view.getBoundingClientRect();
    let res = this._display.resolution;

    x = ((x - rect.left) * (this._display.width/rect.width)) * res;
    y = ((y - rect.top) * (this._display.height/rect.height)) * res;

    this._x = x
    this._y = y
  }

  /**
   * Verifies if a given button is down.
   *
   * @param {BUTTON} button - The button code.
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
   * @param {BUTTON} button - The button code.
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
   * @param {BUTTON} button - The button code.
   * @return {Boolean} The button status.
   */
  isReleased(button) {
    return this._state.indexOf(button) < 0 &&
           this._lastState.indexOf(button) >= 0
  }

  /**
   * Verifies if any button is down.
   *
   * @param {BUTTON} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyDown(button) {
    return !!this._state.length 
  }

  /**
   * Verifies if any button has changed its status from up to down (this is only
   * valid for a single tick).
   *
   * @param {BUTTON} button - The button code.
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
   * @param {BUTTON} button - The button code.
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


module.exports = MouseManager