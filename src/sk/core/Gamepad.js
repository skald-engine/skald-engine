const $ = require('sk/$')

class Gamepad {
  constructor(id) {
    this._id = id
    this._description = null
    this._connected = false

    this._rawLeftStickX = 0
    this._rawLeftStickY = 0
    this._rawRightStickX = 0
    this._rawRightStickY = 0
    this._leftStickX = 0
    this._leftStickY = 0
    this._rightStickX = 0
    this._rightStickY = 0
    this._leftStickForce = 0
    this._rightStickForce = 0
    this._leftTrigger = 0
    this._rightTrigger = 0
    this._leftStickDeadzone = 0
    this._rightStickDeadzone = 0

    this._lastState = []
    this._state = []
    this._gamepad = null

    this._config = null

    this._gamepadButtonDownSignal = null
    this._gamepadButtonHoldSignal = null
    this._gamepadButtonUpSignal = null
    this._gamepadStickMoveSignal = null
  }

  setup() {
    let injector = $.getInjector()
    this._config = injector.resolve('config')

    this._gamepadButtonDownSignal = injector.resolve('gamepadButtonDownSignal')
    this._gamepadButtonHoldSignal = injector.resolve('gamepadButtonHoldSignal')
    this._gamepadButtonUpSignal = injector.resolve('gamepadButtonUpSignal')
    this._gamepadStickMoveSignal = injector.resolve('gamepadStickMoveSignal')

    this._leftStickDeadzone = this._config.get('gamepads.left_stick_deadzone', 0)
    this._rightStickDeadzone = this._config.get('gamepads.right_stick_deadzone', 0)
  }
  /**
   * The gamepad id (and index of the manager list). Readonly.
   * @type {Number}
   */
  get id() { return this._id }

  get description() { return this._description }

  /**
   * The game instance. Readonly.
   * @type {Game}
   */
  get game() { return this._game }

  /**
   * Flag telling if this gamepad is connected. Readonly
   * @type {Boolean}
   */
  get connected() { return this._connected }

  /**
   * Raw value (before dead zone computation) in the x-axis of the left stick.
   * Readonly.
   * @type {Number}
   */
  get rawLeftStickX() { return this._rawLeftStickX }

  /**
   * Raw value (before dead zone computation) in the y-axis of the left stick.
   * Readonly.
   * @type {Number}
   */
  get rawLeftStickY() { return this._rawLeftStickY }

  /**
   * Raw value (before dead zone computation) in the x-axis of the right stick.
   * Readonly.
   * @type {Number}
   */
  get rawRightStickX() { return this._rawRightStickX }

  /**
   * Raw value (before dead zone computation) in the y-axis of the right stick.
   * Readonly.
   * @type {Number}
   */
  get rawRightStickY() { return this._rawRightStickY }

  /**
   * The value (after dead zone computation) in the x-axis of the left stick.
   * Readonly.
   * @type {Number}
   */
  get leftStickX() { return this._leftStickX }

  /**
   * The value (after dead zone computation) in the y-axis of the left stick.
   * Readonly.
   * @type {Number}
   */
  get leftStickY() { return this._leftStickY }

  /**
   * The value (after dead zone computation) in the x-axis of the right stick.
   * Readonly.
   * @type {Number}
   */
  get rightStickX() { return this._rightStickX }

  /**
   * The value (after dead zone computation) in the y-axis of the right stick.
   * Readonly.
   * @type {Number}
   */
  get rightStickY() { return this._rightStickY }

  /**
   * The left stick force. Readonly.
   * @type {Number}
   */
  get leftStickForce() { return this._leftStickForce }

  /**
   * The right stick force. Readonly.
   * @type {Number}
   */
  get rightStickForce() { return this._rightStickForce }

  /**
   * The left trigger force. Readonly.
   * @type {Number}
   */
  get leftTrigger() { return this._leftTrigger }

  /**
   * The right trigger force. Readonly.
   * @type {Number}
   */
  get rightTrigger() { return this._rightTrigger }

  /**
   * Computes the scaled radial deadzone of a given stick
   */
  _computeDeadzone(x, y, deadzone) {
    let force = 0
    let norm = Math.sqrt(x*x + y*y)

    // is larger than dead zone, so we will normalize it
    if (norm > deadzone) {
      let scale =  ((norm-deadzone)/(1-deadzone))
      x = scale*(x/norm)
      y = scale*(y/norm)
      force = Math.sqrt(x*x + y*y)

      // normalize again if necessary (to avoid the box range problem)
      if (force >= 1) {
        x /= force
        y /= force
        force = 1
      }

    // is lesser than dead zone, so we will ignore the value
    } else {
      x = y = force = 0
    }

    return [x, y, force]
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate() {
    let gamepad = this._gamepad
    if (!gamepad) return

    this._lastState = this._state.slice()

    // get raw values for axes
    let lx = this._rawLeftStickX = gamepad.axes[0]
    let ly = this._rawLeftStickY = gamepad.axes[1]
    let rx = this._rawRightStickX = gamepad.axes[2]
    let ry = this._rawRightStickY = gamepad.axes[3]

    let results = this._computeDeadzone(lx, ly, this._leftStickDeadzone)
    this._leftStickX = results[0]
    this._leftStickY = results[1]
    this._leftStickForce = results[2]

    results = this._computeDeadzone(rx, ry, this._rightStickDeadzone)
    this._rightStickX = results[0]
    this._rightStickY = results[1]
    this._rightStickForce = results[2]

    // send event for sticks
    if (this._leftStickForce > 0 || this._rightStickForce > 0) {
      this._gamepadStickMoveSignal.dispatch(
        this._id,
        this._leftStickX,
        this._leftStickY,
        this._rightStickX,
        this._rightStickY
      )
    }

    // get button values
    this._leftTrigger = gamepad.buttons[6].value
    this._rightTrigger = gamepad.buttons[7].value
    this._state = []
    for (let i=0; i<gamepad.buttons.length; i++) {
      if (gamepad.buttons[i].pressed) {
        this._state.push(i)
      }
    }

    // button down events
    for (let i=0; i<this._state.length; i++) {
      let button = this._state[i]
      if (this._lastState.indexOf(button) < 0) {
        this._gamepadButtonDownSignal.dispatch(this._id, button)
      } else {
        this._gamepadButtonHoldSignal.dispatch(this._id, button)
      }
    }

    // button up events
    for (let i=0; i<this._lastState.length; i++) {
      let button = this._lastState[i]
      if (this._state.indexOf(button) < 0) {
        this._gamepadButtonUpSignal.dispatch(this._id, button)
      }
    }
  }

  /**
   * Bind this object to a browser gamepad object.
   *
   * @param {Gamepad} gamepad - The browser gamepad object.
   */
  bind(gamepad) {
    this._gamepad = gamepad
    this._description = gamepad.id
    this._connected = true
    this._state = []
    this._lastState = []
  }

  /**
   * Verifies if this object is bounded to the provided browser gamepad object.
   *
   * @param {Gamepad} gamepad - The browser gamepad.
   * @return {Boolean} Whether this object is bounded to the provided gamepad 
   *         or not.
   */
  isBoundedTo(gamepad) {
    return this._gamepad === gamepad
  }

  /**
   * Unbind the current browser gamepad from this object.
   */
  unbind() {
    this._gamepad = null
    this._connected = false
    this._rawLeftStickX = 0
    this._rawLeftStickY = 0
    this._rawRightStickX = 0
    this._rawRightStickY = 0
    this._leftStickX = 0
    this._leftStickY = 0
    this._rightStickX = 0
    this._rightStickY = 0
    this._leftStickForce = 0
    this._rightStickForce = 0
    this._leftTrigger = 0
    this._rightTrigger = 0
    this._state = []
    this._lastState = []
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

module.exports = Gamepad