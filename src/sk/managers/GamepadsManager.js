const $ = require('sk/$')
const C = require('sk/constants')
const Gamepad = require('sk/core/Gamepad')
const Manager = require('sk/core/Manager')


class GamepadsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor() {
    super()

    this._gamepads       = null
    this._numConnected   = 0

    this._profile       = null
    this._config        = null

    this._gamepadConnectedSignal = null
    this._gamepadDisconnectedSignal = null
  }

  get numConnected() { return this._numConnected }

  /**
   * Setup the this manager. Called by the engine, do not call it manually.
   */
  setup() {
    let injector = $.getInjector()

    this._profile = injector.resolve('profile')
    this._config = injector.resolve('config')

    this._gamepadConnectedSignal = injector.resolve('gamepadConnectedSignal')
    this._gamepadDisconnectedSignal = injector.resolve('gamepadDisconnectedSignal')

    this._profile.begin('keyboard')
    this._setupGamepads()
    this._profile.end('keyboard')
  }

  /**
   * Setup the events on the canvas.
   */
  _setupGamepads() {
    this._gamepads = []
    for (let i=0; i<4; i++) {
      let gamepad = new Gamepad(i)
      gamepad.setup()
      this._gamepads.push(gamepad)  
    }

    let gamepads = this._getGamepads()
    for (let i=0; i<gamepads.length; i++) {
      if (gamepads[i]) {
        this._connectGamepad(gamepads[i])
      }
    }
  }

  /**
   * Connects a gamepad.
   *
   * @param {Gamepad} browserGamepad - The browser gamepad.
   */
  _connectGamepad(browserGamepad) {
    let gamepad = this._gamepads[browserGamepad.index]
    if (!gamepad.connected) {
      this._numConnected++
      gamepad.bind(browserGamepad)
      this._gamepadConnectedSignal.dispatch(gamepad.id)
      return
    }
  }

  /**
   * Disconnects a gamepad.
   *
   * @param {Number} id - The index of the gamepad to be removed.
   */
  _disconnectGamepad(id) {
    let gamepad = this._gamepads[id]
    this._numConnected--
    gamepad.unbind()
    this._gamepadDisconnectedSignal.dispatch(gamepad.id)
  }

  /**
   * Get browser gamepads.
   *
   * @return {Array<Gamepad>} The list of the browser gamepads.
   */
  _getGamepads() {
    return navigator.getGamepads && navigator.getGamepads() ||
           navigator.webkitGetGamepads && navigator.webkitGetGamepads() ||
           navigator.msGetGamepads && navigator.msGetGamepads() ||
           navigator.webkitGamepads && navigator.webkitGamepads() ||
           []
  }

  /**
   * Pre update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {
    // call get gamepads every tick to force browser to get the updated values
    let browserGamepads = this._getGamepads()

    // verifies if there is any connection or disconnection (the browser 
    // events for it are unreliable)
    for (let i=0; i<browserGamepads.length; i++) {
      let browserGamepad = browserGamepads[i]        
      let gamepad = this._gamepads[i]

      if (gamepad.connected && !gamepad.isBoundedTo(browserGamepad)) {
        this._disconnectGamepad(i)
      }

      if (!gamepad.connected && browserGamepad) {
        this._connectGamepad(browserGamepad)
      }
    }

    for (let i=0; i<this._gamepads.length; i++) {
      this._gamepads[i].postUpdate()
    }
  }

  /**
   * Get a gamepad by its id.
   *
   * @param {Number} id - The gamepad id, should be 0, 1, 2, or 3.
   * @return {Gamepad} The gamepad object.
   */
  get(id) {
    return this._gamepads[id]
  }

  /**
   * Get the first gamepad connected.
   *
   * @return {Gamepad} The gamepad object.
   */
  getFirst() {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected) {
        return this._gamepads[i]
      }
    }
  }

  /**
   * Get all connected gamepads.
   *
   * @return {Array<Gamepad>} The list of connected gamepads.
   */
  getConnected() {
    return this._gamepads.filter(g => g.connected)
  }

  /**
   * Get all gamepads.
   *
   * @return {Array<Gamepad>} The list of all gamepads.
   */
  getAll() {
    return this._gamepads.slice()
  }

  /**
   * Verifies if a given button is down.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isDown(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isDown(button)) {
        return true
      }
    }
    return false
  }

  /**
   * Verifies if a given button is up.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isUp(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isUp(button)) {
        return true
      }
    }
    return false
  }

  /**
   * Verifies if a given button has changed its status from up to down (this is
   * only valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isPressed(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isPressed(button)) {
        return true
      }
    }
    return false
  }

  /**
   * Verifies if a given button has changed its status from down to up (this is
   * only valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isReleased(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isReleased(button)) {
        return true
      }
    }
    return false
  }

  /**
   * Verifies if any button is down.
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyDown(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isAnyDown(button)) {
        return true
      }
    }
    return false
  }

  /**
   * Verifies if any button has changed its status from up to down (this is only
   * valid for a single tick).
   *
   * @param {Number} button - The button code.
   * @return {Boolean} The button status.
   */
  isAnyPressed(button) {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isAnyPressed(button)) {
        return true
      }
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
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected && this._gamepads[i].isAnyReleased(button)) {
        return true
      }
    }
    return false
  }
}

module.exports = GamepadsManager