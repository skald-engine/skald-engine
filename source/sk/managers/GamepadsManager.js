import Manager from 'sk/core/Manager' 
import Gamepad from 'sk/core/Gamepad'
import GamepadEvent from 'sk/events/GamepadEvent'
import {GAMEPAD_AXIS} from 'sk/constants'
import * as utils from 'sk/utils'

/**
 * The gamepad manager is used to handle gamepad controllers via the HTML5 api.
 * It is created by the engine and can be accessed via `game.gamepads`.
 *
 * Notice that, a gamepad can only be used if the browser supports it. Check it
 * out this link to see the browser support:
 *
 * - http://caniuse.com/#feat=gamepad
 * 
 * This manager can handle up to 4 gamepads in the x-input format (such as the
 * XBOX controller). Each gamepad has its own state and can be accessed with
 * the getters functions, such as `gamepads.get(id)` or 
 * `gamepads.getFirstConnected()`.
 */
export default class GamepadsManager extends Manager {
  
  /**
   * @param {Game} game - The game instance.
   */
  constructor(game) {
    super(game)

    this._preventDefaults = null
    this._allowEvents     = null
    this._gamepads        = null
    this._numConnecteds   = 0
    this._inputAxesMap    = null
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
    utils.profiling.begin('gamepads')
    this._setupConfig()
    this._setupGamepads()

    this._inputAxesMap = {
      [GAMEPAD_AXIS.LEFT_STICK_X]      : 'leftStickX',
      [GAMEPAD_AXIS.LEFT_STICK_Y]      : 'leftStickY',
      [GAMEPAD_AXIS.LEFT_STICK_FORCE]  : 'leftStickForce',
      [GAMEPAD_AXIS.RIGHT_STICK_X]     : 'rightStickX',
      [GAMEPAD_AXIS.RIGHT_STICK_Y]     : 'rightStickY',
      [GAMEPAD_AXIS.RIGHT_STICK_FORCE] : 'rightStickForce',
      [GAMEPAD_AXIS.LEFT_TRIGGER]      : 'leftTrigger',
      [GAMEPAD_AXIS.RIGHT_TRIGGER]     : 'rightTrigger',
    }
    utils.profiling.end('gamepads')
  }

  /**
   * Pre update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  preUpdate(delta) {
    // call get gamepads every tick to force browser to get the updated values
    let gamepads = this._getGamepads()

    // verifies if there is any connection or disconnection (the browser 
    // events for it are unreliable)
    for (let i=0; i<gamepads.length; i++) {
      let browserGamepad = gamepads[i]        
      let skaldGamepad = this._gamepads[i]

      if (skaldGamepad.connected && !skaldGamepad.isBoundedTo(browserGamepad)) {
        this._disconnectGamepad(i)
      }

      if (!skaldGamepad.connected && browserGamepad) {
        this._connectGamepad(browserGamepad)
      }
    }

    this._gamepads[0].preUpdate(delta)
    this._gamepads[1].preUpdate(delta)
    this._gamepads[2].preUpdate(delta)
    this._gamepads[3].preUpdate(delta)
  }

  /**
   * Post update method. Called by the engine, do not call it manually.
   *
   * @param {Number} delta - The elapsed time.
   */
  postUpdate(delta) {
    this._gamepads[0].postUpdate(delta)
    this._gamepads[1].postUpdate(delta)
    this._gamepads[2].postUpdate(delta)
    this._gamepads[3].postUpdate(delta)
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
   * Setup the gamepads objects.
   */
  _setupGamepads() {
    this._gamepads = [
      new Gamepad(0, this.game),
      new Gamepad(1, this.game),
      new Gamepad(2, this.game),
      new Gamepad(3, this.game)
    ]

    let gamepads = this._getGamepads()
    for (let i=0; i<gamepads.length; i++) {
      if (gamepads[i]) {
        this._connectGamepad(gamepads[i])
      }
    }
  }

  /**
   * Dispatch a browser gamepad event to the game.
   *
   * @param {String} eventType - The type of the event.
   * @param {Event} event - The browser event.
   */
  _dispatchEvent(eventType, gamepad) {
    if (!this._allowEvents) return

    this.game.events.dispatch(new GamepadEvent(eventType, gamepad))
  }

  /**
   * Connects a gamepad.
   *
   * @param {Gamepad} browserGamepad - The browser gamepad.
   */
  _connectGamepad(browserGamepad) {
    let skaldGamepad = this._gamepads[browserGamepad.index]
    if (!skaldGamepad.connected) {
      this._numConnecteds++
      skaldGamepad.bind(browserGamepad)
      this._dispatchEvent('gamepads.connected', skaldGamepad)
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
    this._numConnecteds--
    gamepad.unbind()
    this._dispatchEvent('gamepads.disconnected', gamepad)
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
  getFirstConnected() {
    for (let i=0; i<this._gamepads.length; i++) {
      if (this._gamepads[i].connected) {
        return this._gamepads[i]
      }
    }
  }

  /**
   * Get the number of connected gamepads.
   *
   * @return {Number} Number of connected gamepads.
   */
  getNumConnecteds() {
    return this._numConnecteds
  }

  /**
   * Get all connected gamepads.
   *
   * @return {Array<Gamepad>} The list of connected gamepads.
   */
  getConnecteds() {
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
   * Returns 1 is the button is beign pressed, returns 0 otherwise. It may 
   * return a value between 0 and 1 when working with sticks and trigger.
   *
   * @param {BUTTON} button - The button code.
   * @return {Number} 1 if key is pressed, 0 otherwise.
   */
  getInput(button, i) {
    let gamepads = this._gamepads
    if (typeof i !== 'undefined') {
      gamepads = this._gamepads[Math.min(i, this._gamepads.length)]
    }

    for (var i=0; i<gamepads.length; i++) {
      let gamepad = gamepads[i]

      if (this._inputAxesMap[button]) {
        let value = gamepad[this._inputAxesMap[button]]
        if (value) {
          return value
        }
      } else {
        if (gamepad.isDown(button)) {
          return 1
        }
      }
    }

    return 0
  }
}