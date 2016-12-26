
export default class Gamepad {
  constructor(id, game) {
    this._id = id
    this._game = game
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
    this._leftStickDeadzone = this._game.config.gamepads.leftStickDeadzone
    this._rightStickDeadzone = this._game.config.gamepads.rightStickDeadzone

    this._lastState = []
    this._state = []
    this._gamepad = null
  }

  get id() { return this._id }
  get game() { return this._game }
  get connected() { return this._connected }
  get rawLeftStickX() { return this._rawLeftStickX }
  get rawLeftStickY() { return this._rawLeftStickY }
  get rawRightStickX() { return this._rawRightStickX }
  get rawRightStickY() { return this._rawRightStickY }
  get leftStickX() { return this._leftStickX }
  get leftStickY() { return this._leftStickY }
  get rightStickX() { return this._rightStickX }
  get rightStickY() { return this._rightStickY }
  get leftStickForce() { return this._leftStickForce }
  get rightStickForce() { return this._rightStickForce }
  get leftTrigger() { return this._leftTrigger }
  get rightTrigger() { return this._rightTrigger }

  /**
   * Pre update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  preUpdate(delta) {
    let gamepad = this._gamepad
    if (!gamepad) return


    // get raw values for axes
    let lx = this._rawLeftStickX = gamepad.axes[0]
    let ly = this._rawLeftStickY = gamepad.axes[1]
    let rx = this._rawRightStickX = gamepad.axes[2]
    let ry = this._rawRightStickY = gamepad.axes[3]

    let results;
    // treat values for deadzone
    results = this._computeDeadzone(lx, ly, this._leftStickDeadzone)
    this._leftStickX = results[0]
    this._leftStickY = results[1]
    this._leftStickForce = results[2]

    results = this._computeDeadzone(rx, ry, this._rightStickDeadzone)
    this._rightStickX = results[0]
    this._rightStickY = results[1]
    this._rightStickForce = results[2]

    // get button values
    this._leftTrigger = gamepad.buttons[6].value
    this._rightTrigger = gamepad.buttons[7].value
    this._state = []
    for (var i=0; i<gamepad.buttons.length; i++) {
      if (gamepad.buttons[i].pressed) {
        this._state.push(i)
      }
    }
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
   * Bind this object to a browser gamepad object.
   *
   * @param {Gamepad} gamepad - The browser gamepad object.
   */
  bind(gamepad) {
    this._gamepad = gamepad
    this._connected = true
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
    this._gamepad = null;
    this._connected = false;
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
    this._state = [];
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